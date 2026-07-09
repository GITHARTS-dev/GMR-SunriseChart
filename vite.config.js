import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Split rarely-changing vendor libraries into their own chunks so browsers
    // cache them across deploys and download them in parallel. (xlsx is loaded
    // on demand via dynamic import in App.jsx, so it is already its own chunk.)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return "react-vendor";
          if (id.includes("@azure/msal")) return "msal-vendor";
          if (/framer-motion|motion-dom|motion-utils/.test(id))
            return "motion-vendor";
          return undefined;
        },
      },
    },
  },
});
