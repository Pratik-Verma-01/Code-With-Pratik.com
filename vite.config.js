import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Warning limit badha di (1MB)
    rollupOptions: {
      output: {
        // Badi libraries ko alag chunks mein todo
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          ui: ['lucide-react', 'react-hot-toast', 'clsx', 'tailwind-merge'],
          utils: ['zod', 'react-hook-form', 'react-markdown', 'react-syntax-highlighter']
        }
      }
    }
  }
});
