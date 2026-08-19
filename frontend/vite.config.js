import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Every package in the react-markdown dependency tree. See the note in
// manualChunks below for why this is an explicit list and not a regex.
const MARKDOWN_PKGS = [
              'bail',
              'character-entities',
              'comma-separated-tokens',
              'decode-named-character-reference',
              'devlop',
              'estree-util-is-identifier-name',
              'extend',
              'hast-util-to-jsx-runtime',
              'hast-util-whitespace',
              'html-url-attributes',
              'inline-style-parser',
              'is-plain-obj',
              'mdast-util-from-markdown',
              'mdast-util-to-hast',
              'mdast-util-to-string',
              'micromark',
              'micromark-core-commonmark',
              'micromark-factory-destination',
              'micromark-factory-label',
              'micromark-factory-space',
              'micromark-factory-title',
              'micromark-factory-whitespace',
              'micromark-util-character',
              'micromark-util-chunked',
              'micromark-util-classify-character',
              'micromark-util-combine-extensions',
              'micromark-util-decode-numeric-character-reference',
              'micromark-util-decode-string',
              'micromark-util-encode',
              'micromark-util-html-tag-name',
              'micromark-util-normalize-identifier',
              'micromark-util-resolve-all',
              'micromark-util-sanitize-uri',
              'micromark-util-subtokenize',
              'property-information',
              'react-markdown',
              'remark-parse',
              'remark-rehype',
              'space-separated-tokens',
              'style-to-js',
              'style-to-object',
              'trim-lines',
              'trough',
              'unified',
              'unist-util-is',
              'unist-util-position',
              'unist-util-stringify-position',
              'unist-util-visit',
              'unist-util-visit-parents',
              'vfile',
              'vfile-message',
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      /**
       * Vite preloads every top-level chunk from the entry HTML by default.
       * markdown-vendor (31 kB gzip) is only reachable from three lazy routes
       * -- AiTutor, AiCourse and RoadmapGenerator -- yet it was being
       * modulepreloaded on "/" where nothing renders markdown. Excluding it
       * from the entry preload leaves it a normal lazy chunk: the routes that
       * need it still fetch it, the landing page no longer does.
       */
      modulePreload: {
        resolveDependencies(_url, deps) {
          return deps.filter((d) => !d.includes('markdown-vendor'));
        },
      },
      rollupOptions: {
        output: {
          /**
           * Split the vendor bundle so a route only downloads what it uses.
           *
           * Before this, everything shipped as one 486 kB / 167 kB gzip chunk.
           * Measured composition: react 142 kB, framer-motion 120 kB,
           * gsap 115 kB, react-markdown 105 kB, the rest under 41 kB each.
           * All of it is genuinely imported somewhere -- removing packages did
           * not help, because reactflow, chart.js, react-chartjs-2 and dayjs
           * were already tree-shaken out and the bundle was byte-identical
           * without them. The problem was never dead code, it was that one
           * chunk served every route.
           *
           * The landing page ("/") uses react, gsap, router and icons. It does
           * NOT use react-markdown (AI chat/tutor only), axios (API layer),
           * date-fns (post timestamps) or framer-motion (MainLayout page
           * transitions, which the landing route sits outside of).
           *
           * KNOWN, TRIAGED, DO NOT RE-INVESTIGATE WITHOUT NEW INFORMATION:
           * markdown-vendor (~35 kB gzip) still loads on "/". Ruled out:
           *   - not an import-surface problem. There are ZERO barrel files in
           *     src/, and tracing the full landing graph from Home.jsx gives
           *     20 local modules with no markdown import anywhere in it.
           *   - not a manualChunks matcher gap. Enumerating all 51 packages in
           *     the react-markdown tree by name did not break the edge.
           *   - not a modulePreload issue. Filtering it out of the entry
           *     preload did not stop it loading.
           * The remaining edge is react/jsx-runtime, which
           * hast-util-to-jsx-runtime shares with React itself, so the chunk
           * stays reachable from a preloaded chunk no matter how it is split.
           * Fixing it means either a custom Rollup plugin or dropping
           * react-markdown from the three routes that use it. Neither is worth
           * 35 kB. Left deliberately.
           */
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            // React runtime. Every route needs it.
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return 'react-vendor';
            }
            // GSAP + Lenis: the landing page's animation stack.
            if (id.includes('gsap') || id.includes('lenis')) return 'gsap-vendor';
            // framer-motion: MainLayout transitions and a few app components.
            // The landing route is outside MainLayout, so it skips this.
            if (id.includes('framer-motion') || id.includes('motion-dom') ||
                id.includes('motion-utils')) {
              return 'motion-vendor';
            }
            // Markdown: AI tutor, AI chat and the roadmap generator only.
            // The markdown stack. Enumerated by package name rather than
            // matched by pattern: this list came from inspecting which
            // packages Rollup actually placed in `vendor`, and a pattern
            // guess left 4 of them behind (unified, trim-lines,
            // decode-named-character-reference, inline-style-parser). Any one
            // left out creates a static vendor -> markdown edge, and since
            // the entry HTML preloads `vendor`, that single edge drags all
            // 31 kB onto every route including "/".
            // Verified after every change: vendor.js must have NO static
            // import of markdown-vendor.
            if (MARKDOWN_PKGS.some((n) => id.includes(`node_modules/${n}/`))) {
              return 'markdown-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  };
});
