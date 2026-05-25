import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/medinnovate/",

  plugins: [react(), tailwindcss()],

  preview: {
    port: 4173,
  },
});
