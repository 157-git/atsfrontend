import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:9090",
        // target: "http://192.168.1.37:9090",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
