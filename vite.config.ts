import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      '/api/v1/flight': 'http://localhost:3001',
      '/api/v1/hotel': 'http://localhost:3002',
      '/api/v1/insurance': 'http://localhost:3003',
      '/api/v1/transfer': 'http://localhost:3004',
      '/api/v1/orders': 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
