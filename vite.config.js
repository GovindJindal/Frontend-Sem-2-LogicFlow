import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion':       ['framer-motion'],
          'reactflow':    ['reactflow'],
          'charts':       ['recharts'],
          'pdf':          ['jspdf', 'html2canvas'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
