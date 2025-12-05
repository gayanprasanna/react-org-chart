import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-org-chart": resolve(__dirname, "../../src"),
    },
  },
  optimizeDeps: {
    exclude: ["react-org-chart"],
  },
  server: {
    watch: {
      ignored: ["!**/node_modules/react-org-chart/**"],
    },
  },
});
