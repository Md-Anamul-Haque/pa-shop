import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig } from 'vite'
console.log('in ts config')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
