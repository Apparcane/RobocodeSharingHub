import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic', // Гарантирует автоматический импорт React для JSX
        }),
    ],
    server: {
        host: true,
        port: 3000,
    },
});