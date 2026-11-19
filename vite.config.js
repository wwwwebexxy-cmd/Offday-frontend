import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Local development uses the separate Offday Django app. No previous
  // deployment origin is used as a fallback.
  const devApiTarget = env.VITE_OFFDAY_DEV_API_PROXY_TARGET || 'http://127.0.0.1:8000'
  const server = {}

  if (devApiTarget) {
    server.proxy = {
      '/backend': {
        target: devApiTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    }
  }

  return {
    plugins: [react()],
    server,
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})
