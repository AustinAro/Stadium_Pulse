import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'StadiumPulse Operations Control',
        short_name: 'StadiumPulse',
        description: 'Real-time stadium operations & crowd intelligence for FIFA World Cup 2026',
        theme_color: '#0a0f1a',
        background_color: '#0a0f1a',
        display: 'standalone',
        icons: [
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: [
        'src/main.jsx',
        'src/App.jsx',
        'src/components/Dashboard.jsx'
      ]
    }
  },
});
