import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BASE_PATH lets the same build run at a domain root ("/", Vercel/Netlify)
// or under a sub-path ("/repo-name/", GitHub Pages project sites).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
})
