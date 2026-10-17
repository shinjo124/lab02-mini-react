import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        ex1: fileURLToPath(new URL('./ex1.html', import.meta.url)),
        ex2: fileURLToPath(new URL('./ex2.html', import.meta.url)),
        ex3: fileURLToPath(new URL('./ex3.html', import.meta.url)),
      },
    },
  },
});
