import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        TanStackRouterVite(),
        react(),
        istanbul({
            cypress: true,
            forceBuildInstrument: mode !== 'production', // adds instrumentation to non production builds
            include: ['src/**/*', 'cypress/support/wrappers/**/*']
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
}));
