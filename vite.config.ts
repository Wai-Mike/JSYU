import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        outDir: 'public/build',
        manifest: true,
        rollupOptions: {
            input: {
                app: 'resources/js/app.jsx',
            },
        },
    },
    server: {
        host: process.env.VITE_DEV_SERVER_HOST || 'localhost',
        port: 5173,
        cors: {
            origin: true,
            credentials: true,
        },
        hmr: {
            host: process.env.VITE_DEV_SERVER_HOST || 'localhost',
            protocol: 'ws',
            clientPort: 5173,
        },
    },
});
