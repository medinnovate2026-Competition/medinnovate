import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/medinnovate/", // ✅ required for GitHub Pages

  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "https://medinnovate-production.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },

  preview: {
    port: 4173,
  },
});