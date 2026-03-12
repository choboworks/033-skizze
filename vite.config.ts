// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PROD / PREVIEW: identisch zur .htaccess (kanonisch)
const prodCsp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "frame-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join('; ')

// DEV: lockerer für HMR/React-Refresh (unsafe-inline/eval + ws)
// sonst gleiches Verhalten, damit Fehler früh auffallen
const devCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' ws: blob: data:",
  "worker-src 'self' blob:",
  "frame-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join('; ')

export default defineConfig({
  plugins: [react()],
  server: {
    headers: { 'Content-Security-Policy': devCsp },
  },
  preview: {
    headers: { 'Content-Security-Policy': prodCsp },
  },
  build: {
    rollupOptions: { output: { manualChunks: undefined } },
  },
})
