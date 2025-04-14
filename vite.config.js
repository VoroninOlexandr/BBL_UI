import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'window', // Це визначає global як window для браузера
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your Spring Boot backend
        changeOrigin: true,
        secure: false,
      },

      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      }
    }
  }
})
