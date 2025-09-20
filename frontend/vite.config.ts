import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/CeramicasCentral/', // ¡Exactamente como aparece en GitHub!
    build: {
        outDir: 'dist'
    }
})