import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ,
    {
      name: 'glb-asset-loader',
      transform: (code, id) => {
        if (id.endsWith('.glb')) {
          const base64Code = code.toString('base64')
          return `export default "data:model/gltf-binary;base64,${base64Code}"`
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif", "**/*.webp", "**/*.mp4", "**/*.webm", "**/*.ogg", "**/*.mp3", "**/*.wav", "**/*.flac", "**/*.aac", "**/*.obj", "**/*.glb", "**/*.mtl"],
    extensions: ['.js', '.json', '.vue', '.ts', '.mjs', '.obj', '.jpg', '.png', '.glb'],
  }
})


