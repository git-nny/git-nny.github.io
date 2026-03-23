import { defineConfig } from "vite";

export default defineConfig({
  base: '/', 
  build: {
    outDir: '_site', 
    emptyOutDir: false, 
  },

  publicDir: 'public', 
});