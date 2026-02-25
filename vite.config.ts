import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000,
    host: true,
    watch: {
      // Watch CSV files for changes
      usePolling: true,
      interval: 1000
    }
  },
  // Force full reload when CSV files change
  optimizeDeps: {
    exclude: ['*.csv']
  }
});
