import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from "tailwindcss";
import svgr from 'vite-plugin-svgr';

// function renderChunks(deps) {
//     let chunks = {};
//     Object.keys(deps).forEach((key) => {
//         if (['swiper', 'react-dom', 'filestack-js'].includes(key)) return;
//         chunks[key] = [key];
//     });
//     return chunks;
// }

export default defineConfig({
    base: "/",
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                   if (id.includes("node_modules")) {
                       if (id.includes("filestack-js")) {
                            return "vendor_fs";
                       } else if (id.includes("swiper")) {
                            return "vendor_swiper";
                       }
                       return "vendor";
                   }
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