# TailwindCSS 마이그레이션 비교 문서

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 최초 작성 | TailwindCSS v4 적용 초안 |
| v1.1 | 스타일 버그 수정 | 동적 테이블 행 텍스트 파란색 버그 수정 (`@layer base` 추가) |

---

## 1. 핵심 요약

| 구분 | 기존 (`css/style.css`) | 변경 후 (TailwindCSS v4) |
|------|----------------------|--------------------------|
| CSS 작성 방식 | 직접 클래스 정의 | HTML 속성에 유틸리티 클래스 적용 |
| 설정 파일 | 없음 | `vite.config.js` 에 플러그인 1줄 |
| CSS 파일 역할 | 모든 스타일 정의 | `@import "tailwindcss"` + 최소 커스텀만 |
| 빌드 결과 CSS | 6.2 kB (전체 작성) | 19.01 kB (Tailwind 기본 포함) / gzip 4.33 kB |
| 반응형 디자인 | 직접 `@media` 작성 | `sm:`, `md:`, `lg:` 접두사 |
| 호버 효과 | `:hover { ... }` 블록 | `hover:bg-blue-600` 인라인 |

---

## 2. 설치 및 설정

### 2-1. 설치 명령어

```bash
# TailwindCSS v4 + Vite 플러그인
npm install tailwindcss @tailwindcss/vite
```

### 2-2. `vite.config.js` 변경

```javascript
// 변경 전
import { defineConfig } from 'vite';
export default defineConfig({ ... });

// 변경 후 — 플러그인 1줄 추가
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';   // ← 추가

export default defineConfig({
    plugins: [
        tailwindcss(),  // ← 추가 (config 파일 불필요)
    ],
    ...
});
```

**TailwindCSS v3 vs v4 설정 비교:**

| 항목 | v3 (구버전) | v4 (현재) |
|------|------------|---------|
| 설치 | `tailwindcss postcss autoprefixer` | `tailwindcss @tailwindcss/vite` |
| 설정 파일 | `tailwind.config.js` 필수 | 불필요 |
| PostCSS | `postcss.config.js` 필수 | 불필요 |
| CSS 지시어 | `@tailwind base/components/utilities` 3줄 | `@import "tailwindcss"` 1줄 |

### 2-3. `src/style.css` 전체 구조

```css
/* ① Tailwind 전체 포함 */
@import "tailwindcss";

/* ② JS 생성 HTML에 사용되는 컴포넌트 클래스 */
@layer components { .btn, .btn-sm, .btn-*, .actions ... }

/* ③ JS 동적 생성 테이블 행 기본 스타일 (버그 수정 추가) */
@layer base { tbody td, tbody tr ... }

/* ④ JS classList로 토글되는 상태 클래스 */
.tab-button.active { ... }
.content-section / .content-section.active { ... }
.alert / .alert.show { ... }
.loading { ... }
```

---

## 3. HTML 변경 상세 비교

### 3-1. body / 컨테이너

```html
<!-- 변경 전 -->
<body>
<div class="container">

<!-- 변경 후 -->
<body class="bg-slate-100 text-slate-700 min-h-screen p-5">
<div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
```

| 속성 | 기존 CSS | TailwindCSS 유틸리티 |
|------|---------|---------------------|
| 배경색 | `background-color: #f4f7f6` | `bg-slate-100` |
| 최대 너비 | `max-width: 1000px` | `max-w-5xl` (1024px) |
| 여백 | `margin: 0 auto` | `mx-auto` |
| 안쪽 여백 | `padding: 30px` | `p-8` (32px) |
| 모서리 | `border-radius: 12px` | `rounded-2xl` |
| 그림자 | `box-shadow: 0 4px 20px rgba(0,0,0,0.08)` | `shadow-md` |

### 3-2. 탭 버튼

```html
<!-- 변경 전 -->
<button class="tab-button active" onclick="showTab('dept-section')">

<!-- 변경 후 -->
<button class="tab-button active
               px-6 py-3 font-semibold text-slate-400
               border-b-4 border-transparent -mb-0.5
               hover:bg-slate-50 hover:text-slate-600
               transition-all duration-300"
        onclick="showTab('dept-section')">
```

> `active` 클래스는 JS가 toggle하므로 커스텀 CSS로 유지:
> ```css
> .tab-button.active { @apply text-blue-500 border-blue-500; }
> ```

### 3-3. 카드 (섹션 구분 박스)

```html
<!-- 변경 전 -->
<div class="card">
    <h3 id="dept-form-title">부서 등록</h3>

<!-- 변경 후 -->
<div class="border border-slate-200 rounded-xl p-6 mb-6">
    <h3 id="dept-form-title"
        class="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">
        부서 등록
    </h3>
```

| 속성 | 기존 `.card` CSS | TailwindCSS 유틸리티 |
|------|----------------|---------------------|
| 테두리 | `border: 1px solid #e1e4e8` | `border border-slate-200` |
| 모서리 | `border-radius: 8px` | `rounded-xl` |
| 안쪽 여백 | `padding: 25px` | `p-6` (24px) |
| 아래 여백 | `margin-bottom: 25px` | `mb-6` (24px) |
| h3 왼쪽 강조선 | `border-left: 4px solid #3498db` | `border-l-4 border-blue-400` |

### 3-4. 입력 필드

```html
<!-- 변경 전 -->
<input type="text" id="dept-name" placeholder="예: HR" required>
<!-- CSS에서 input[type="text"] { width: 100%; padding: 12px; ... } -->

<!-- 변경 후 -->
<input type="text" id="dept-name" placeholder="예: HR" required
       class="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white
              focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
              transition-all">
```

| 속성 | 기존 CSS | TailwindCSS 유틸리티 |
|------|---------|---------------------|
| 너비 | `width: 100%` | `w-full` |
| 안쪽 여백 | `padding: 12px` | `px-3 py-2.5` |
| 테두리 | `border: 1px solid #ccc` | `border border-slate-300` |
| 포커스 테두리 | `border-color: #3498db` | `focus:border-blue-400` |
| 포커스 링 | `box-shadow: 0 0 0 3px rgba(...)` | `focus:ring-2 focus:ring-blue-100` |
| 포커스 아웃라인 제거 | `outline: none` | `focus:outline-none` |

### 3-5. 버튼

```html
<!-- 변경 전 — CSS 클래스 조합 -->
<button class="btn btn-primary">부서 생성</button>
<button class="btn btn-warning btn-sm" data-action="edit">수정</button>
<!-- CSS:
  .btn { padding: 12px 22px; border: none; ... }
  .btn-primary { background-color: #3498db; }
-->

<!-- 변경 후 — @layer components 로 동일한 클래스 유지 -->
<button class="btn btn-primary">부서 생성</button>
<button class="btn btn-warning btn-sm" data-action="edit">수정</button>
<!-- src/style.css:
  @layer components {
    .btn { @apply inline-block px-5 py-2.5 font-semibold ... }
    .btn-primary { @apply bg-blue-500 hover:bg-blue-600; }
  }
-->
```

**왜 버튼은 유틸리티 클래스 대신 컴포넌트 클래스를 유지했나요?**

```
dept_runner_v2.js / emp_runner_v2.js 의 innerHTML 템플릿:

  `<button class="btn btn-warning btn-sm"
           data-id="${dept.id}"
           data-action="edit">수정</button>`

JS 파일 안의 HTML 문자열에도 클래스가 들어갑니다.
Tailwind 유틸리티 클래스를 사용하면:
  - 클래스 문자열이 매우 길어져 JS 코드 가독성이 떨어집니다.
  - @layer components 로 컴포넌트 클래스를 정의하면
    JS 코드를 그대로 유지하면서 Tailwind @apply 로 스타일링 가능합니다.
```

### 3-6. 테이블 ⚠️ 버그 수정 포함

#### 문제 현상

JS가 `innerHTML`로 동적 생성하는 `<tr><td>` 에 Tailwind 클래스가 없어서,
Tailwind v4 Preflight의 기본 스타일이 적용되어 **텍스트가 파란색**으로 표시되었습니다.

```
부서명    부서 설명
──────────────────────────────────────────────────
HR        performs human resource management...    ← 텍스트가 파란색으로 표시됨
Marketing creates strategies for selling...        ← 텍스트가 파란색으로 표시됨
```

#### 원인

```
정적 HTML 행 (placeholder)         JS 동적 생성 행 (실제 API 데이터)
──────────────────────────         ──────────────────────────────────
<tr class="hover:bg-slate-50       <tr>
           transition-colors">         <td>HR</td>       ← 클래스 없음
  <td class="px-4 py-3              <td>Marketing</td>  ← 클래스 없음
             border-b ...">        </tr>
    HR
  </td>
</tr>
↑ 클래스 있음 → 스타일 적용         ↑ 클래스 없음 → Preflight 기본 색 적용
```

#### 해결 — `@layer base` 추가 (src/style.css)

```css
@layer base {
    /* 클래스 없는 JS 생성 <td> 에도 자동 적용 */
    tbody td {
        @apply text-slate-700 px-4 py-3 border-b border-slate-100 align-middle;
    }
    tbody tr {
        @apply transition-colors;
    }
    tbody tr:hover {
        @apply bg-slate-50;
    }
}
```

**`@layer base`를 사용한 이유:**

```
Tailwind 레이어 우선순위: base < components < utilities

① JS 생성 <td> (클래스 없음)
   → base 스타일 적용 ✅ text-slate-700, px-4, border-b 등

② <td class="actions"> (.actions 는 @layer components)
   → components 가 base 보다 우선
   → flex, gap-2, items-center 유지 + base의 padding/border도 적용 ✅

③ 정적 HTML <td class="px-4 py-3 ..."> (유틸리티 클래스)
   → utilities 가 base 보다 우선
   → 명시적 클래스가 base를 덮어씀 ✅
```

#### 결과 — HTML 단순화

`@layer base` 가 `tbody td`를 자동으로 스타일링하므로,
**정적 플레이스홀더 행의 중복 클래스를 제거**했습니다.

```html
<!-- 변경 전 — <td> 마다 클래스 반복 -->
<tbody id="dept-list">
    <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 border-b border-slate-100">1</td>
        <td class="px-4 py-3 border-b border-slate-100">HR</td>
        <td class="px-4 py-3 border-b border-slate-100">performs...</td>
        <td class="px-4 py-3 border-b border-slate-100">
            <div class="actions">...</div>
        </td>
    </tr>
</tbody>

<!-- 변경 후 — @layer base 가 자동 적용, 클래스 불필요 -->
<tbody id="dept-list">
    <!-- tbody td 기본 스타일은 src/style.css @layer base 에서 적용됩니다 -->
    <tr>
        <td>1</td>
        <td>HR</td>
        <td>performs...</td>
        <td>
            <div class="actions">...</div>
        </td>
    </tr>
</tbody>
```

#### thead 는 유틸리티 클래스 유지

`<thead>` 의 `<th>` 는 `@layer base` 범위(tbody) 밖이므로 유틸리티 클래스를 그대로 씁니다.

```html
<thead>
    <tr class="bg-slate-50">
        <th class="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">
            ID
        </th>
    </tr>
</thead>
```

### 3-7. 상세 조회 결과 ⚠️ 버그 수정 포함

JS(`renderDepartmentDetail`, `renderEmployeeDetail`)가 동적으로 `<p>` 태그를 생성하여
결과 div 안에 삽입합니다. 결과 div에 텍스트 색상 클래스가 없으면 파란색으로 표시됩니다.

```html
<!-- 변경 전 — text 색상 미지정 -->
<div id="dept-detail-result" style="display:none;"
     class="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm leading-7">
</div>

<!-- 변경 후 — text-slate-700 추가 → 동적 생성 <p> 가 색상 상속 -->
<div id="dept-detail-result" style="display:none;"
     class="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200
            text-sm text-slate-700 leading-7">
</div>
```

### 3-8. 알림 메시지

```html
<!-- 변경 전 -->
<div id="message-area">
    <div id="alert-success" class="alert alert-success">성공 메시지</div>
    <div id="alert-error"   class="alert alert-error">오류 메시지</div>
</div>
<!-- CSS:
  #message-area { position: fixed; top: 20px; right: 20px; width: 300px; }
  .alert-success { background-color: #2ecc71; }
  .alert { display: none; transition: all 0.5s cubic-bezier(...); }
  .alert.show { display: block; opacity: 1; }
-->

<!-- 변경 후 -->
<div id="message-area" class="fixed top-5 right-5 z-50 w-72 space-y-2">
    <div id="alert-success" class="alert rounded-lg px-5 py-4 text-white bg-emerald-500 shadow-lg">성공 메시지</div>
    <div id="alert-error"   class="alert rounded-lg px-5 py-4 text-white bg-red-500   shadow-lg">오류 메시지</div>
</div>
<!-- style.css: .alert { ... animation ... } .alert.show { ... } 유지 -->
```

> `alert` 클래스의 슬라이드 애니메이션 (`cubic-bezier`, opacity/transform transition)은
> JS 상태 제어(`show` 클래스 toggle)와 결합되므로 커스텀 CSS 로 유지합니다.

---

## 4. CSS 파일 크기 변화

| 항목 | 기존 `style.css` | `src/style.css` (Tailwind 적용) |
|------|----------------|--------------------------------|
| 줄 수 | 283줄 | 120줄 |
| 직접 작성 코드 | 283줄 전부 | ~90줄 (컴포넌트 + base + 상태 클래스) |
| 프로덕션 빌드 CSS | 6.2 kB | 19.01 kB (원본) / gzip **4.33 kB** |
| 관리 포인트 | CSS 파일 1곳 | HTML + style.css (분산되지만 직관적) |

> **gzip 기준으로는 오히려 작거나 비슷합니다.**
> Tailwind는 사용된 클래스만 포함(트리쉐이킹)하므로 실제 전송 크기는 효율적입니다.

---

## 5. Tailwind 핵심 개념 정리

### 5-1. 유틸리티 우선 (Utility-First)

```
기존 방식: 이름을 붙인 클래스 → CSS에서 스타일 정의
  HTML: <div class="card">
  CSS:  .card { border: 1px solid #e1e4e8; border-radius: 8px; ... }

Tailwind 방식: HTML에서 직접 유틸리티 클래스 조합
  HTML: <div class="border border-slate-200 rounded-xl p-6">
  CSS:  없음 (이미 Tailwind에 정의됨)
```

### 5-2. 주요 유틸리티 클래스 패턴

| 카테고리 | 예시 클래스 | 의미 |
|---------|-----------|------|
| 색상 | `bg-blue-500`, `text-slate-700` | 배경/글자 색상 (숫자: 50~950) |
| 간격 | `p-4`, `px-3`, `py-2.5`, `m-auto`, `mb-6` | padding/margin (숫자 × 4px) |
| 크기 | `w-full`, `max-w-5xl`, `min-w-48` | width |
| 플렉스 | `flex`, `gap-4`, `items-center`, `justify-between` | flexbox |
| 테두리 | `border`, `border-slate-200`, `rounded-xl` | 테두리/모서리 |
| 그림자 | `shadow-md`, `shadow-lg` | 박스 그림자 |
| 호버 | `hover:bg-blue-600`, `hover:-translate-y-0.5` | 마우스 올릴 때 |
| 포커스 | `focus:ring-2`, `focus:border-blue-400` | 포커스 상태 |
| 전환 | `transition-all`, `duration-300` | 애니메이션 전환 |

### 5-3. 3가지 레이어와 우선순위

Tailwind는 CSS를 3개의 레이어로 관리하며, 우선순위는 아래와 같습니다.

```
낮음 ──────────────────────────────── 높음
  @layer base  <  @layer components  <  utilities(클래스)
```

| 레이어 | 용도 | 이 프로젝트 사용 예시 |
|--------|------|---------------------|
| `@layer base` | 클래스 없는 HTML 요소의 기본 스타일 | `tbody td { @apply text-slate-700 px-4 ... }` |
| `@layer components` | 재사용 컴포넌트 클래스 정의 | `.btn`, `.btn-primary`, `.actions` |
| utilities (클래스) | HTML에서 직접 사용하는 유틸리티 | `class="flex gap-4 rounded-xl ..."` |

```css
/* 예시: <td class="actions"> 에 모두 적용되는 경우 */

@layer base {
    tbody td { @apply text-slate-700 px-4 py-3 ... }  /* 낮은 우선순위 */
}
@layer components {
    .actions { @apply flex gap-2 items-center; }       /* 중간 우선순위 → base 덮어씀 */
}
/* 결과: <td class="actions"> 는 flex + gap-2 + text-slate-700 + px-4 모두 적용 */
```

### 5-4. `@layer components` — 컴포넌트 클래스 정의

```css
/* JS 생성 HTML이나 반복 패턴에 사용하는 방법 */
@layer components {
    .btn {
        @apply inline-block px-5 py-2.5 font-semibold rounded-md text-sm text-white
               transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md;
    }
    .btn-primary { @apply bg-blue-500 hover:bg-blue-600; }
}
/* @apply: Tailwind 유틸리티 클래스를 커스텀 CSS 클래스 안에서 사용 */
```

### 5-5. v3 vs v4 문법 차이

```css
/* v3 방식 */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* + tailwind.config.js 파일 필수 */

/* v4 방식 (현재) */
@import "tailwindcss";
/* 설정 파일 없이 동작, CSS 변수로 커스터마이징 */
```

---

## 6. 커스텀 CSS를 유지해야 하는 경우

Tailwind를 적용해도 아래 4가지는 커스텀 CSS 로 유지합니다.

| 케이스 | 이유 | 현재 적용 예시 |
|--------|------|--------------|
| JS `classList.add/remove` 로 토글되는 클래스 | Tailwind는 정적 HTML 분석 기반이라 동적 클래스 생성 불가 | `.tab-button.active`, `.content-section.active`, `.alert.show` |
| 복잡한 `cubic-bezier` 애니메이션 | Tailwind 기본 easing으로 표현 불가 | `.alert` transition |
| `style.display` 로 제어되는 초기 숨김 상태 | JS가 inline style로 덮어씀 | `.loading { display: none; }` |
| **JS 동적 생성 HTML 요소의 기본 스타일** ⭐ | JS 템플릿 리터럴의 클래스 없는 요소는 Tailwind 스캔 대상 외 | `@layer base { tbody td { ... } }` |

---

## 7. 파일 구조 변화

```
변경 전                          변경 후
────────────────────────         ────────────────────────────────
css/                             css/
  style.css (283줄)                style.css (그대로 유지 — 백업)
                                 src/
                                   style.css (120줄)
                                     ├── @import "tailwindcss"
                                     ├── @layer components { .btn ... }
                                     ├── @layer base { tbody td ... }  ← 추가
                                     └── 커스텀 상태 클래스 4개

index.html                       index.html
  <link href="css/style.css">      <!-- CSS는 main.js 에서 import -->
  class="card"                     class="border border-slate-200 ..."
  class="btn btn-primary"          class="btn btn-primary" (동일)
  class="form-inline"              class="flex gap-4 flex-wrap"
  class="tab-button active"        class="tab-button active px-6 py-3 ..."
  <td class="px-4 py-3 ...">       <td> (클래스 불필요 — base 자동 적용)
  detail result div                detail result div + text-slate-700
```

---

## 8. 빌드 결과 비교

| 항목 | Vite (Tailwind 적용 전) | Vite + TailwindCSS | Vite + Tailwind (버그 수정 후) |
|------|------------------------|-------------------|-------------------------------|
| HTML | 11.27 kB | 17.85 kB | 17.63 kB |
| CSS | 4.22 kB (gzip 1.62 kB) | 17.15 kB (gzip 4.08 kB) | 19.01 kB (gzip 4.33 kB) |
| JS | 13.75 kB (gzip 4.05 kB) | 13.75 kB (gzip 4.05 kB) | 13.75 kB (gzip 4.05 kB) |
| 빌드 시간 | 322 ms | 330 ms | 302 ms |

> CSS가 커진 이유: `@layer base`에 tbody 스타일이 추가되어 해당 CSS 규칙이 포함됩니다.
> 사용하지 않는 클래스는 트리쉐이킹으로 자동 제거됩니다.
