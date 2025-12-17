import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/composable-rewrite/',
  plugins: [
    vue()
  ],
  css: {
    preprocessorOptions: {
      less: {
        paths: [
          fileURLToPath(new URL('./src/styles', import.meta.url))
        ]
      }
    }
  }
})
