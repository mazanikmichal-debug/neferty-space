import { fileURLToPath, URL } from "url";
import fs from "fs";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    // Prevent browser from caching env.json between deploys in dev mode.
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
  // Plugin: add Cache-Control: no-store headers for env.json in the built output.
  // This prevents the browser from serving a stale canister ID after a redeploy.
  plugins: [
    {
      name: "env-json-static",
      // Copy env.json → public/env.json at the start of every build so Vite
      // includes it in dist/ as a static asset (served before the SPA router).
      buildStart() {
        // Sync src/frontend/env.json → public/env.json so Vite includes it
        // in dist/ as a true static asset — served directly, never caught by
        // the SPA router.
        // The platform writes the active canister ID to src/frontend/env.json.
        // __dirname here is the src/frontend/ directory (vite.config.js location).
        const src = path.resolve(__dirname, "env.json");
        const dest = path.resolve(__dirname, "public", "env.json");
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`[env-json-static] synced ${src} → ${dest}`);
        } else {
          console.warn(`[env-json-static] src/frontend/env.json not found at ${src} — public/env.json may be stale`);
        }
      },
      // Dev server: add no-cache headers so the browser always fetches fresh env.json
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url === "/env.json" || req.url.startsWith("/env.json?"))) {
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
          next();
        });
      },
      // Preview server (vite preview): same no-cache treatment
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url === "/env.json" || req.url.startsWith("/env.json?"))) {
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          }
          next();
        });
      },
    },
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
});
