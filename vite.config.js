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
        await fs.copy("algs", "dist/algs");
        await fs.copy("audio", "dist/audio");
        await fs.copy("auth", "dist/auth");
        await fs.copy("bg", "dist/bg");
        await fs.copy("css", "dist/css");
        await fs.copy("img", "dist/img");
        await fs.copy("info", "dist/info");
        await fs.copy("js", "dist/js");
        await fs.copy("language", "dist/language");
        await fs.copy("pricing", "dist/pricing");
        await fs.copy("profile", "dist/profile");
        await fs.copy("timer", "dist/timer");
        await fs.copy("tools", "dist/tools");
        await fs.copy("tuts", "dist/tuts");
        await fs.copy("index.html", "dist/index.html");
        await fs.copy("manifest.json", "dist/manifest.json");
        await fs.copy("components", "dist/components");
        await fs.copy("fonts", "dist/fonts");
        await fs.copy("favicon_io", "dist/favicon_io");
        await fs.copy("sw.js", "dist/sw.js");
        await fs.copy("storage.js", "dist/storage.js");
      },
    },
  ],
});
