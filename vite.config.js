import { defineConfig } from "vite";

export default defineConfig({
  // 1. Crucial for GitHub Pages: If your site is 'user.github.io/repo/', 
  // set this to '/repo/'. If it's a custom domain, use '/'.
  base: '/', 

  build: {
    // 2. Where the final, optimized files go
    outDir: '_site', 
    // 3. Prevents Vite from clearing the 11ty HTML files before bundling
    emptyOutDir: false, 
    rollupOptions: {
      // 4. Ensures Vite can find your JS/CSS even if 11ty nested them
      input: './_site/index.html', 
    },
  },
  
  // 5. Explicitly handle the public directory to avoid resolution errors
  publicDir: 'public', 
});