import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 IMPORTANTE

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 ESSENCIAL
    },
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
});
