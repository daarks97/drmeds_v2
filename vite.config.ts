import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // 👈 IMPORTANTE

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 ESSENCIAL: Alias para a pasta 'src'
    },
  },
  server: {
    host: '0.0.0.0', // Para acesso via rede local
  },
  build: {
    rollupOptions: {
      input: '/index.html', // Ponto de entrada para a construção
    },
  },
});
