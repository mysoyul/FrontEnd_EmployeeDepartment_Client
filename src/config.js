/**
 * @file config.js
 * @description Vite 환경 변수를 읽어 앱 전체에서 사용할 설정 객체를 내보냅니다.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  Vite 환경 변수 규칙                                              │
 * │  - VITE_ 접두사가 붙은 변수만 브라우저 코드에 노출됩니다.          │
 * │  - import.meta.env.VITE_* 로 접근합니다.                         │
 * │  - 빌드 시점에 실제 값으로 치환됩니다 (런타임이 아닌 컴파일 타임). │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * 환경별 파일 우선순위:
 *   개발(npm run dev) : .env → .env.development → .env.development.local
 *   운영(npm run build): .env → .env.production  → .env.production.local
 *
 * 사용 예시:
 *   import config from './config.js';
 *   console.log(config.apiBaseUrl); // http://localhost:8080 (개발)
 *                                   // https://api.example.com (운영)
 */

// [import.meta.env] Vite가 주입하는 환경 변수 객체입니다.
// - MODE  : 'development' | 'production' | 'test'
// - DEV   : true  (개발 서버 실행 중일 때)
// - PROD  : true  (빌드된 결과물일 때)
// - VITE_*: .env 파일에 정의한 VITE_ 접두사 변수들

const config = {
    // API 서버 기본 URL
    // 개발 환경(.env.development): http://localhost:8080
    // 운영 환경(.env.production) : https://api.example.com
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

    // 현재 실행 환경 이름 ('development' | 'production')
    mode: import.meta.env.MODE,

    // 개발 서버 실행 중 여부 (npm run dev → true, npm run build → false)
    isDev: import.meta.env.DEV,

    // UI에 표시할 환경 레이블 ('개발 서버' | '운영 서버')
    envLabel: import.meta.env.VITE_APP_ENV_LABEL,
};

export default config;
