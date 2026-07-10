import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend": path.resolve(__dirname, "../backend/src"),
      "@contracts": path.resolve(__dirname, "../backend/contracts"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
