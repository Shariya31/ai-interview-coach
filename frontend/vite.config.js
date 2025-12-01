import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // bind to 0.0.0.0 so container can expose the dev server
    port: 5173,
    // optional: strictPort: true // uncomment later if you want build to fail when port is used
  },
});
