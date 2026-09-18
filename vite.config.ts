/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  // `npm run dev` serves the playground; `npm run build` bundles the library.
  root: "playground",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: "../src/index.ts",
      formats: ["es"],
      fileName: "fronty",
      cssFileName: "fronty",
    },
  },
  test: {
    root: ".",
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
