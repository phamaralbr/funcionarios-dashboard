import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Separate build for the Liferay Custom Element client extension.
// Produces dist-ce/index.js (+ dist-ce/style.css) as a single
// self-executing bundle — this is what gets copied into the
// client extension's assets/ folder.
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
  },
  build: {
    outDir: "dist-ce",
    cssCodeSplit: false,
    lib: {
      entry: "src/liferay-element.tsx",
      formats: ["iife"],
      name: "FuncionariosDashboardCE",
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "style.[ext]",
      },
    },
  },
});
