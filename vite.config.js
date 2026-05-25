import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/medinnovate/",

  plugins: [react()],

  server: {
    proxy: {
      "/api/coupons": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/api/admin": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/api": {
        target: "https://medinnovate-production.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
      "/payments": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
  },
});
