import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  root: resolve("src"),
  base: "",
  publicDir: resolve("src/assets/public"),
  resolve: {
    alias: {
      "@src": resolve("src"),
      "@css": resolve("src/css"),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: resolve("build"),
  },
  server: {
    host: true,
    port: 3000,
  },
  envDir: resolve("./"),
})
