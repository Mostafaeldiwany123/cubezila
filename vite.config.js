import { defineConfig } from "vite";
import fs from "fs-extra";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "[name]-[hash][extname]",
        entryFileNames: "[name]-[hash].js",
        chunkFileNames: "[name]-[hash].js",
      },
    },
  },
  plugins: [
    {
      name: "copy-static-files",
      closeBundle: async () => {
        const toCopy = [
          "algs", "admin", "audio", "auth", "bg", "css", "img", "info",
          "js", "language", "pricing", "profile", "timer",
          "manifest.json", "components", "fonts", "favicon_io",
          "sw.js", "storage.js", "promptcraftr", "refund-policy.html", "pricing.html"
        ];

        for (const item of toCopy) {
          if (await fs.pathExists(item)) {
            await fs.copy(item, `dist/${item}`);
          }
        }
      },
    },
  ],
});