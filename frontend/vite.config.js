import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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

            // ONLY split what is genuinely leaf-like and route-specific.
            //
            // An earlier version also carved out a `react-vendor` chunk. That
            // broke production: react-router-dom and zustand consume React at
            // module-init time, and separating them produced a circular chunk
            // init order that threw
            //   TypeError: Cannot read properties of undefined
            //              (reading 'createContext')
            // before the app could mount. The build succeeded and every local
            // check passed; only loading the built output caught it.
            //
            // React therefore stays in the default vendor chunk with the
            // things that depend on it. The two carve-outs below are safe
            // because nothing in the default chunk imports them at init:
            //   gsap/lenis  -> landing animation stack
            //   framer-motion -> MainLayout only, which the landing route
            //                    renders outside of
            // That still keeps ~38 kB gzip of motion off the landing route,
            // which was the win worth having.
            if (id.includes('gsap') || id.includes('lenis')) return 'gsap-vendor';
            if (id.includes('framer-motion') || id.includes('motion-dom') ||
                id.includes('motion-utils')) {
              return 'motion-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  };
});
