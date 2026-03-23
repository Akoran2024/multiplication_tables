import { defineConfig } from 'vite'
import vue from '@vue/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})