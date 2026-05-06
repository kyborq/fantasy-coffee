import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

import { icons } from "./plugins/vite-plugin-icons";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    icons({
      iconsDir: "src/assets/icons",
      outputFile: "src/assets/icons/icons.ts",
      case: "kebab",
      debounceMs: 120,
    }),
  ],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
