import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build:{
    rollupOptions:{
      input:{
        main: 'index.html',
        login: 'login.html',
        register: 'register.html'
      }
    }
  },

  server:{
    host: "0.0.0.0",
    port: 80,
    strictPort: true,
    allowedHosts: ['client', 'nutri.codexr.dev']
  
    
  },
  preview: {
    host: "0.0.0.0",
    port: 80,         // Make sure this matches the port your Dockerfile exposes
    strictPort: true,
    allowedHosts: ['client, nutri.codexr.dev']
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nutri Tracker',
        short_name: 'Nutri Tracker',
        description: 'A calorie tracking app',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})