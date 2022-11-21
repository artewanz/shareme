import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  root: resolve("app"),
  base: "",
  publicDir: resolve("public"),
  resolve: {
    alias: {
      "@app": resolve("app"),
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
