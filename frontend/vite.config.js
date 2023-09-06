import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from "tailwindcss";
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: "/",
    build: {
        chunkSizeWarningLimit: 700,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    },
    plugins: [
        react(),
        tailwindcss(),
        svgr({
            svgrOptions: {
                // svgr options
            },
        }),
        eslintPlugin({
            // setup the plugin
            cache: false,
            include: ['./src/**/*.js', './src/**/*.jsx'],
            exclude: [],
        }),
    ],

    server: {
        proxy: {
            "/api": "http://localhost:8080",
        }
    }
})