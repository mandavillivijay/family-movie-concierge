/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/family-movie-concierge/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Manifest icons and workbox runtime caching are filled in during the
      // dedicated PWA/offline build phase, once real icon assets exist.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Family Movie Night Concierge',
        short_name: 'Movie Night',
        description: "Pick tonight's family movie in under 60 seconds.",
        start_url: '/family-movie-concierge/',
        scope: '/family-movie-concierge/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
