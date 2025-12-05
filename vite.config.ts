import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["src/mockData/**"],
      outDir: "dist",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "ReactOrgChart",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react-dom", "d3"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          d3: "d3",
        },
      },
    },
  },
});
