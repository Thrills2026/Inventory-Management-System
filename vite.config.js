import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['Thrills logo.png'],
      manifest: {
        name: 'Thrills Inventory System',
        short_name: 'Thrills',
        description: 'Inventory and Expense Management System',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/Inventory-Management-System/',
        icons: [
          {
            src: 'Thrills logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Thrills logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/Inventory-Management-System/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})