#!/usr/bin/env node
/**
 * BUILD SMOKE TEST -- verifies the built output RUNS, not just that it built.
 *
 * WHY THIS EXISTS. Two bugs shipped in one session that every other check
 * passed:
 *   1. A manualChunks split carved React into its own chunk. react-router-dom
 *      and zustand consume React at module-init time, so the split produced a
 *      circular init order that threw "Cannot read properties of undefined
 *      (reading 'createContext')" before the app mounted. Blank page on every
 *      route. The build succeeded and the chunk sizes looked correct.
 *   2. An image pipeline that only ran on macOS. Vercel builds on Linux, so
 *      production would have silently shipped no AVIF/WebP.
 *
 * Both had the same shape: the ARTIFACT was verified, the RUNNING PAGE was not.
 * Headless Chrome cannot measure LCP, but it mounts pages perfectly well, which
 * is exactly what both bugs needed.
 *
 * Serves dist/ on a throwaway port, loads each route in headless Chrome, and
 * asserts three things per route:
 *   - #root has children (the app actually mounted)
 *   - zero uncaught exceptions and zero console errors
 *   - a known text fragment is present (the right page rendered)
 *
 * Exits non-zero on the first failure, naming the route and the error.
 *
 * Usage:  npm run verify         (build + smoke)
 *         npm run smoke          (smoke against an existing dist/)
 *         npm run smoke -- --fail-demo   (deliberately fail, to prove it works)
 */
import { spawn, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";

const PORT = 5399;
const CDP_PORT = 9333;
const FAIL_DEMO = process.argv.includes("--fail-demo");

/**
 * Expectations test that the RIGHT PAGE MOUNTED, not that the backend is up.
 * The smoke test runs against a static dist/ with no API behind it, so pages
 * that fetch will legitimately render an error state. /videos was initially
 * asserted on its <h1> text, which only renders on the success path; with no
 * backend it shows "Failed to load feed" instead. That is the page working
 * correctly, so the assertion moved to chrome that renders either way.
 */
const ROUTES = [
  { path: "/",          expect: "Stop collecting courses", note: "landing" },
  // Nav chrome: present whether the feed loads or errors.
  { path: "/videos",    expect: "AI Roadmaps",             note: "app page" },
  { path: "/login",     expect: "Welcome back",            note: "auth page" },
  { path: "/feed",      expect: "AI Roadmaps",             note: "app page" },
  // Protected: unauthenticated, ProtectedRoute must redirect to /login.
  { path: "/dashboard", expect: "Welcome back", note: "protected -> /login", redirectsTo: "/login" },
];

if (FAIL_DEMO) {
  ROUTES.push({
    path: "/",
    expect: "THIS TEXT DOES NOT EXIST ON THE PAGE",
    note: "deliberate failure to prove the test can fail",
  });
}

if (!existsSync("dist/index.html")) {
  console.error("[smoke] dist/index.html missing. Run `npm run build` first.");
  process.exit(1);
}

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((p) => existsSync(p));

if (!CHROME) {
  console.error("[smoke] No Chrome/Chromium found. Cannot run the smoke test.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (url) =>
  new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let b = "";
      res.on("data", (c) => (b += c));
      res.on("end", () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
    }).on("error", reject);
  });

let server, chrome;
const cleanup = () => {
  try { server?.kill("SIGKILL"); } catch {}
  try { chrome?.kill("SIGKILL"); } catch {}
};
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(130); });

// ---- minimal CDP over websocket, no dependencies -------------------------
import { createConnection } from "node:net";
import { randomBytes } from "node:crypto";

class WS {
  constructor(sock, buf) { this.s = sock; this.buf = buf; this.id = 0; }
  static connect(url) {
    return new Promise((resolve, reject) => {
      const { hostname, port, pathname } = new URL(url.replace("ws://", "http://"));
      const s = createConnection({ host: hostname, port: Number(port) }, () => {
        const key = randomBytes(16).toString("base64");
        s.write(
          `GET ${pathname} HTTP/1.1\r\nHost: ${hostname}:${port}\r\nUpgrade: websocket\r\n` +
          `Connection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`
        );
        let buf = Buffer.alloc(0);
        const onData = (d) => {
          buf = Buffer.concat([buf, d]);
          const i = buf.indexOf("\r\n\r\n");
          if (i !== -1) { s.off("data", onData); resolve(new WS(s, buf.subarray(i + 4))); }
        };
        s.on("data", onData);
      });
      s.on("error", reject);
    });
  }
  _frame(data) {
    const p = Buffer.from(data), mask = randomBytes(4);
    const n = p.length;
    let head;
    if (n < 126) head = Buffer.from([0x81, 0x80 | n]);
    else if (n < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 0x80 | 126; head.writeUInt16BE(n, 2); }
    else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 0x80 | 127; head.writeBigUInt64BE(BigInt(n), 2); }
    const masked = Buffer.alloc(n);
    for (let i = 0; i < n; i++) masked[i] = p[i] ^ mask[i % 4];
    return Buffer.concat([head, mask, masked]);
  }
  async _read(n) {
    while (this.buf.length < n) {
      await new Promise((r) => this.s.once("data", (d) => { this.buf = Buffer.concat([this.buf, d]); r(); }));
    }
    const out = this.buf.subarray(0, n);
    this.buf = this.buf.subarray(n);
    return out;
  }
  async recv() {
    const h = await this._read(2);
    let len = h[1] & 0x7f;
    if (len === 126) len = (await this._read(2)).readUInt16BE(0);
    else if (len === 127) len = Number((await this._read(8)).readBigUInt64BE(0));
    return JSON.parse((await this._read(len)).toString());
  }
  async call(method, params = {}) {
    const id = ++this.id;
    this.s.write(this._frame(JSON.stringify({ id, method, params })));
    for (;;) {
      const m = await this.recv();
      if (m.id === id) return m.result || {};
      if (m.method === "Runtime.exceptionThrown") this.errors.push(
        "EXC " + (m.params.exceptionDetails?.exception?.description ||
                  m.params.exceptionDetails?.text || "unknown")
      );
      if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
        const t = (m.params.args || []).map((a) => String(a.value ?? "")).join(" ");
        if (t && !/DevTools|favicon/i.test(t)) this.errors.push("console.error " + t);
      }
    }
  }
  async drain(ms) { const end = Date.now() + ms; while (Date.now() < end) { await sleep(50); } }
}
// --------------------------------------------------------------------------

(async () => {
  server = spawn("node_modules/.bin/vite", ["preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
  chrome = spawn(CHROME, [
    "--headless=new", "--disable-gpu", "--no-sandbox",
    `--remote-debugging-port=${CDP_PORT}`,
    "--user-data-dir=/tmp/eduverse-smoke-profile", "about:blank",
  ], { stdio: "ignore" });

  // wait for both
  for (let i = 0; i < 40; i++) {
    try { await getJSON(`http://localhost:${CDP_PORT}/json/version`); break; } catch { await sleep(500); }
  }

  const tabs = await getJSON(`http://localhost:${CDP_PORT}/json`);
  const page = tabs.find((t) => t.type === "page");
  const ws = await WS.connect(page.webSocketDebuggerUrl);
  ws.errors = [];
  await ws.call("Runtime.enable");
  await ws.call("Page.enable");

  const failures = [];
  for (const r of ROUTES) {
    ws.errors = [];
    await ws.call("Page.navigate", { url: `http://localhost:${PORT}${r.path}` });
    await ws.drain(3500);

    const res = await ws.call("Runtime.evaluate", {
      expression: `JSON.stringify({
        rootKids: document.getElementById('root') ? document.getElementById('root').childNodes.length : -1,
        // textContent, NOT innerText: innerText returns CSS-RENDERED text, so
        // text-transform:uppercase on the Anton headline turns "Stop collecting"
        // into "STOP COLLECTING" and a case-sensitive match fails on a page
        // that is actually fine. textContent is the raw DOM text.
        // Not sliced: the landing page's headline sits past 4000 chars once the
        // cold-start banner and nav are counted.
        text: document.body.textContent || '',
        path: location.pathname
      })`,
      returnByValue: true,
    });
    const d = JSON.parse(res.result.value);

    const problems = [];
    if (d.rootKids <= 0) problems.push(`#root has ${d.rootKids} children (app did not mount)`);
    if (!d.text.includes(r.expect)) problems.push(`expected text not found: "${r.expect}"`);
    if (r.redirectsTo && d.path !== r.redirectsTo) problems.push(`expected redirect to ${r.redirectsTo}, got ${d.path}`);
    if (ws.errors.length) problems.push(...ws.errors.slice(0, 3));

    if (problems.length) {
      failures.push({ route: r.path, note: r.note, problems });
      console.log(`  FAIL  ${r.path.padEnd(12)} ${r.note}`);
      problems.forEach((p) => console.log(`        - ${p}`));
    } else {
      console.log(`  ok    ${r.path.padEnd(12)} ${r.note}`);
    }
  }

  cleanup();
  if (failures.length) {
    console.error(`\n[smoke] ${failures.length} route(s) failed: ${failures.map((f) => f.route).join(", ")}`);
    process.exit(1);
  }
  console.log(`\n[smoke] all ${ROUTES.length} routes mounted, rendered and error-free.`);
  process.exit(0);
})().catch((e) => { cleanup(); console.error("[smoke] harness error:", e.message); process.exit(1); });
