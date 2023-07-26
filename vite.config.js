import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Mappin",
  server: {
    proxy: {
      "/pins": {
        target: "https://mappinappbackend.onrender.com/api",
        secure: false,
      },
      "/users/register": {
        target: "https://mappinappbackend.onrender.com/api",
        secure: false,
      },
      "/users/login": {
        target: "https://mappinappbackend.onrender.com/api",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
