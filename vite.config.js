import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Thrills logo.png'],
      manifest: {
        name: 'Thrills Inventory System',
        short_name: 'Thrills',
        description: 'Inventory and Expense Management System',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/Thrills logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Thrills logo.png',
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