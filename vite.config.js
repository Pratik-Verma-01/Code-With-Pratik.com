import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for better React support
      babel: {
        plugins: [],
      },
    }),
  ],
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  
  // Development server configuration
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    cors: true,
    // Proxy API requests to avoid CORS issues in development
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation bundle
          'animation-vendor': ['framer-motion'],
          // Firebase bundle
          'firebase-vendor': ['firebase/app', 'firebase/auth'],
          // Supabase bundle
          'supabase-vendor': ['@supabase/supabase-js'],
          // UI utilities bundle
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          // Markdown bundle
          'markdown-vendor': ['react-markdown', 'react-syntax-highlighter'],
        },
      },
    },
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge',
    ],
    exclude: [],
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
  
  // CSS configuration
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
