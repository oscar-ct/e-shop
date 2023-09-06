import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from "tailwindcss";
import svgr from 'vite-plugin-svgr';
import { dependencies } from './package.json';

function renderChunks(deps) {
    let chunks = {};
    Object.keys(deps).forEach((key) => {
        if (['swiper', 'react-dom', 'filestack-js'].includes(key)) return;
        chunks[key] = [key];
    });
    return chunks;
}

export default defineConfig({
    base: "/",
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['swiper', 'react-dom', 'filestack-js'],
                    ...renderChunks(dependencies),
                },
            },
        },
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