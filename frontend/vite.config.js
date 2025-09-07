import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  // Base configuration for different environments
  base: mode === 'production' ? '/' : '/',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://plusdsa.onrender.com/api'),
    'import.meta.env.VITE_SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL || 'https://plusdsa.onrender.com'),
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
    global: 'globalThis'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    // Optimize for better SEO
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // SEO-friendly server configuration
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  }
}))
