import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.svg',
                'favicon.ico',
                'robots.txt',
                'apple-touch-icon.png'
            ],
            manifest: {
                name: 'Avocado',
                short_name: 'Avocado',
                description: 'Your GitHub dashboard in avocado style 🥑',
                theme_color: '#4caf50',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                "icons": [
                    {
                        "src": "./logo.svg",
                        "sizes": "any",
                        "type": "image/svg+xml"
                    }
                ],
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5190
    }
})
