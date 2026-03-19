# Vite 마이그레이션 정리 문서

## 1. 핵심 요약

| 구분 | 기존 (v3.0 ES Module) | 변경 후 (v4.0 Vite) |
|------|----------------------|---------------------|
| 실행 방법 | 파일을 브라우저에서 직접 열기 | `npm run dev` |
| 빌드 | 없음 | `npm run build` |
| CSS 로딩 | `<link rel="stylesheet">` | JS에서 `import './style.css'` |
| JS 로딩 | `<script type="module">` 2개 | `<script type="module" src="/src/main.js">` 1개 |
| 소스 폴더 | `js/` (루트 직하) | `src/` (Vite 관례) |
| HMR | 없음 | 있음 (파일 저장 즉시 브라우저 자동 반영) |
| 프로덕션 빌드 | 없음 | `dist/` 폴더에 최적화된 파일 생성 |

---

## 2. 추가된 파일

```
level1_html_css_js/
├── package.json        ← NEW: npm 프로젝트 설정, 의존성 관리
├── vite.config.js      ← NEW: Vite 빌드 설정
├── .gitignore          ← NEW: node_modules, dist 폴더 git 제외
├── node_modules/       ← npm install 후 자동 생성 (git 제외)
├── dist/               ← npm run build 후 자동 생성 (git 제외)
└── src/                ← NEW: Vite 소스 폴더
    ├── main.js         ← NEW: 단일 엔트리 포인트 (CSS + JS 통합)
    ├── style.css       ← COPIED from css/style.css
    └── js/
        ├── utils.js            ← COPIED from js/utils.js
        ├── dept_runner_v2.js   ← COPIED from js/dept_runner_v2.js
        ├── emp_runner_v2.js    ← COPIED from js/emp_runner_v2.js
        └── api/
            ├── departmentApi.js ← COPIED from js/api/departmentApi.js
            └── employeeApi.js   ← COPIED from js/api/employeeApi.js
```

> **참고:** `js/` 폴더의 기존 파일들(v1, v2 runner, .md 문서)은 학습 참고용으로 그대로 유지됩니다.

---

## 3. 변경된 파일

### 3-1. `index.html`

#### CSS 링크 변경

```html
<!-- 변경 전 (v3.0) -->
<link rel="stylesheet" href="css/style.css">

<!-- 변경 후 (v4.0 Vite) -->
<!-- CSS는 src/main.js 에서 import './style.css' 로 처리합니다. -->
<!-- <link rel="stylesheet" href="css/style.css"> -->
```

**왜 CSS를 JS에서 import 하나요?**
```
Vite(및 모던 번들러)는 JS에서 CSS를 import 할 수 있습니다.
- 개발 서버: CSS를 <style> 태그로 동적 주입 → HMR(핫 리로드) 지원
- 프로덕션 빌드: 최적화된 .css 파일로 분리 추출
```

#### 스크립트 태그 변경

```html
<!-- 변경 전 (v3.0): 두 개의 script 태그 -->
<script type="module" src="js/dept_runner_v2.js"></script>
<script type="module" src="js/emp_runner_v2.js"></script>

<!-- 변경 후 (v4.0 Vite): 하나의 엔트리 포인트 -->
<script type="module" src="/src/main.js"></script>
```

---

## 4. 새로 추가된 파일 상세

### 4-1. `package.json`

```json
{
  "name": "employee-department-manager",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",        ← npm run dev   → 개발 서버 실행
    "build": "vite build", ← npm run build → 프로덕션 빌드
    "preview": "vite preview" ← npm run preview → 빌드 결과 미리보기
  },
  "devDependencies": {
    "vite": "^6.2.0"      ← 개발 의존성 (빌드 도구)
  }
}
```

**`devDependencies` vs `dependencies`:**
```
devDependencies: 개발/빌드 시에만 필요한 패키지 (vite, eslint 등)
dependencies:    실제 런타임에 필요한 패키지 (react, axios 등)
Vite는 빌드 도구이므로 devDependencies에 넣습니다.
```

### 4-2. `vite.config.js`

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,   // 개발 서버 포트 (기본: 5173)
        open: true,   // npm run dev 시 브라우저 자동 열기
    },
    build: {
        outDir: 'dist',     // 빌드 결과물 폴더
        sourcemap: true,    // 소스맵 생성 (디버깅용)
    },
});
```

### 4-3. `src/main.js` — 단일 엔트리 포인트

```javascript
// CSS를 JS에서 import
import './style.css';

// 부서 관리 모듈 (기존 js/dept_runner_v2.js와 동일한 파일)
import './js/dept_runner_v2.js';

// 직원 관리 모듈 (기존 js/emp_runner_v2.js와 동일한 파일)
import './js/emp_runner_v2.js';
```

---

## 5. 프로젝트 사용 방법

### 5-1. 최초 설치

```bash
# 프로젝트 폴더로 이동
cd level1_html_css_js

# 의존성 설치 (node_modules 폴더 생성)
npm install
```

### 5-2. 개발 서버 실행

```bash
npm run dev
```

```
  VITE v6.x.x  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

- 브라우저가 자동으로 열립니다.
- JS/CSS 파일을 수정하고 저장하면 **브라우저가 자동으로 갱신**됩니다 (HMR).

### 5-3. 프로덕션 빌드

```bash
npm run build
```

```
dist/
├── index.html                 ← 최적화된 HTML
├── assets/
│   ├── index-[hash].css       ← 압축된 CSS
│   └── index-[hash].js        ← 번들링된 JS
```

- 파일명에 해시값이 붙어 브라우저 캐시 문제를 자동 해결합니다.
- JS: 13.75 kB → gzip 4.05 kB (기존 개별 파일들의 합산보다 작음)

### 5-4. 빌드 결과 미리보기

```bash
npm run preview
# → http://localhost:4173/ 에서 dist/ 폴더 내용을 서빙
```

---

## 6. 폴더 구조 전후 비교

### 변경 전 (v3.0 ES Module — 브라우저 직접 실행)

```
level1_html_css_js/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── utils.js
    ├── dept_runner_v2.js
    ├── emp_runner_v2.js
    └── api/
        ├── departmentApi.js
        └── employeeApi.js
```

### 변경 후 (v4.0 Vite)

```
level1_html_css_js/
├── index.html          ← 수정됨 (script 태그 1개로 통합)
├── package.json        ← NEW
├── vite.config.js      ← NEW
├── .gitignore          ← NEW
├── node_modules/       ← npm install 자동 생성
├── dist/               ← npm run build 자동 생성
│
├── src/                ← NEW (Vite 소스 폴더)
│   ├── main.js         ← NEW 엔트리 포인트
│   ├── style.css       ← css/style.css 복사
│   └── js/
│       ├── utils.js
│       ├── dept_runner_v2.js
│       ├── emp_runner_v2.js
│       └── api/
│           ├── departmentApi.js
│           └── employeeApi.js
│
└── js/                 ← 기존 유지 (학습 참고용)
    ├── dept_runner_v1.js + v2.js + .md
    ├── emp_runner_v1.js + v2.js + .md
    ├── utils.js + util.md
    └── api/
        ├── departmentApi.js + .md
        └── employeeApi.js + .md
```

---

## 7. Vite가 해결해 주는 문제들

### 7-1. `file://` 프로토콜 제한 해결

```
기존 문제:
  index.html을 파일 탐색기에서 더블클릭하면 file:// 프로토콜로 열립니다.
  일부 브라우저에서 ES Module의 import/export가 CORS 오류로 동작하지 않습니다.

Vite 해결:
  npm run dev → http://localhost:3000 으로 실행
  HTTP 프로토콜이므로 ES Module이 정상 동작합니다.
```

### 7-2. HMR (Hot Module Replacement)

```
기존: 코드 수정 → 브라우저에서 F5 눌러 새로고침 → 페이지 전체 재로딩
Vite: 코드 수정 → 저장 → 변경된 모듈만 교체 → 페이지 상태 유지 + 즉시 반영
```

### 7-3. 프로덕션 최적화

```
기존: 브라우저가 파일 수만큼 HTTP 요청 (utils.js, departmentApi.js, ...)
Vite: 모든 JS를 하나의 파일로 번들링 → HTTP 요청 1회로 감소
      CSS도 하나로 합쳐서 추출
      파일명 해시 → 브라우저 캐시 자동 무효화
```

### 7-4. 소스맵(sourcemap)

```
번들링 후 dist/assets/index-[hash].js 는 압축/난독화됩니다.
sourcemap: true 설정으로 브라우저 개발자 도구에서
원본 파일(src/js/dept_runner_v2.js) 기준으로 디버깅 가능합니다.
```

---

## 8. 환경 변수(Environment Variables) 설정

### 8-1. 왜 환경 변수가 필요한가?

```
문제: API URL이 코드 안에 하드코딩되어 있으면
      개발 서버(localhost)와 운영 서버(https://api.example.com)를
      배포할 때마다 코드를 직접 수정해야 합니다.

해결: .env 파일에 URL을 분리하면
      코드 변경 없이 환경별로 다른 URL을 자동으로 사용할 수 있습니다.
```

### 8-2. 추가된 파일

```
level1_html_css_js/
├── .env.development    ← NEW: 개발 환경 설정 (npm run dev 시 로드)
├── .env.production     ← NEW: 운영 환경 설정 (npm run build 시 로드)
└── src/
    ├── config.js       ← NEW: 환경 변수를 읽어 앱에 제공하는 설정 모듈
    └── js/
        └── api/
            ├── departmentApi.js  ← 수정: config.js에서 URL 가져오도록 변경
            └── employeeApi.js    ← 수정: config.js에서 URL 가져오도록 변경
```

### 8-3. `.env.development` — 개발 환경

```bash
# npm run dev 실행 시 자동 로드
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV_LABEL=개발 서버
```

### 8-4. `.env.production` — 운영 환경

```bash
# npm run build 실행 시 자동 로드
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV_LABEL=운영 서버
```

### 8-5. Vite 환경 변수 규칙

| 규칙 | 설명 |
|------|------|
| `VITE_` 접두사 필수 | `VITE_`로 시작해야만 브라우저 코드에 노출됩니다 |
| `import.meta.env.VITE_*` | 브라우저 코드에서 접근하는 방법 |
| 컴파일 타임 치환 | 빌드 시 실제 값으로 대체됩니다 (런타임이 아님) |
| 우선순위 | `.env` < `.env.development` < `.env.development.local` |

### 8-6. `src/config.js` — 중앙 설정 모듈

```javascript
// 환경 변수를 읽어 하나의 객체로 내보냅니다
const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,  // API 서버 URL
    mode:       import.meta.env.MODE,                // 'development' | 'production'
    isDev:      import.meta.env.DEV,                 // 개발 서버 실행 중 여부
    envLabel:   import.meta.env.VITE_APP_ENV_LABEL,  // UI 표시용 레이블
};

export default config;
```

### 8-7. API 파일 변경 전후 비교

```javascript
// ── 변경 전 (하드코딩) ──────────────────────────────────────────
const BASE_URL = 'http://localhost:8080/api/departments';  // 운영 배포 시 직접 수정 필요

// ── 변경 후 (환경 변수 사용) ────────────────────────────────────
import config from '../../config.js';
const BASE_URL = `${config.apiBaseUrl}/api/departments`;  // 환경에 따라 자동 변경
```

### 8-8. 환경별 동작 요약

| 명령어 | 로드되는 .env | `config.apiBaseUrl` 값 |
|--------|---------------|------------------------|
| `npm run dev` | `.env.development` | `http://localhost:8080` |
| `npm run build` | `.env.production` | `https://api.example.com` |
| `npm run preview` | `.env.production` | `https://api.example.com` |

---

## 9. Vite 이후 다음 단계

```
현재 (v4.0 Vite Vanilla JS)
    ↓
React + Vite (npm create vite@latest -- --template react)
    - import './App.css'     ← 동일한 CSS import 패턴
    - 컴포넌트 기반 UI 개발
    - JSX 문법
    ↓
React + TypeScript + Vite
    - 타입 안전성
    - 인터페이스/타입 정의
```

Vite는 React, Vue, Svelte 등 모든 프레임워크에서 동일하게 사용됩니다.
이 프로젝트에서 익힌 `npm run dev`, `npm run build`, `vite.config.js` 패턴이
그대로 적용됩니다.

---

## 9. 빌드 결과

```bash
$ npm run build

  vite v6.4.1 building for production...
  ✓ 9 modules transformed.

  dist/index.html                  11.27 kB │ gzip: 2.58 kB
  dist/assets/index-[hash].css      4.22 kB │ gzip: 1.62 kB
  dist/assets/index-[hash].js      13.75 kB │ gzip: 4.05 kB
  ✓ built in 322ms
```

| 파일 | 역할 |
|------|------|
| `dist/index.html` | 최적화된 HTML (script/link 태그 자동 삽입) |
| `dist/assets/*.css` | 번들링된 CSS (모든 스타일 통합) |
| `dist/assets/*.js` | 번들링된 JS (모든 모듈 통합 + 트리쉐이킹) |
