import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    // ────────────────────────────────────────────────
    // 플러그인 설정
    // ────────────────────────────────────────────────
    plugins: [
        react(),        // React JSX 변환 + Fast Refresh (HMR)
        tailwindcss(),  // Tailwind CSS v4 — config 파일 없이 바로 동작합니다.
    ],

    // ────────────────────────────────────────────────
    // 개발 서버 설정
    // ────────────────────────────────────────────────
    server: {
        port: 3000,   // 개발 서버 포트
        open: true,   // 브라우저 자동 열기
    },

    // ────────────────────────────────────────────────
    // 빌드 설정
    // ────────────────────────────────────────────────
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});
