import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Cache static assets and the model
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,onnx}'],
        // Increase limits since ONNX weights can be large
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
      },
      manifest: {
        name: 'Watermelon AI - Nhận Diện Dưa Hấu',
        short_name: 'Watermelon AI',
        description: 'Ứng dụng AI nhận diện và đánh giá chất lượng dưa hấu theo thời gian thực',
        theme_color: '#020607',
        background_color: '#020607',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: '/static/',
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
