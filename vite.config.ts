import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        react(),
        istanbul({
            cypress: true
        }),
        createHtmlPlugin({
            minify: false
        }),
        ViteMinifyPlugin({})
    ],
    build: {
        sourcemap: true
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    server: {
        watch: {
            ignored: ['**/cypress/downloads/**', '**/.nyc_output/**', '**/coverage/**']
        },
        proxy: {
            '/api/car-repair-register': {
                target: 'http://localhost',
                changeOrigin: true
            }
        }
    }
});
