import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/rabbitmq': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rabbitmq/, '/api')
      },
      '/api/kafka': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kafka/, '/api')
      },
      '/ws/rabbitmq': {
        target: 'ws://localhost:8081',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws\/rabbitmq/, '/ws')
      },
      '/ws/kafka': {
        target: 'ws://localhost:8082',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws\/kafka/, '/ws')
      }
    }
  }
})
