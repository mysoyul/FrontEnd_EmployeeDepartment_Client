# TailwindCSS v4 튜토리얼 — Employee & Department Manager 프로젝트로 배우기

## 목차

1. [TailwindCSS란?](#1-tailwindcss란)
2. [설치 및 설정](#2-설치-및-설정)
3. [유틸리티 클래스란?](#3-유틸리티-클래스란)
4. [자주 쓰는 유틸리티 카테고리](#4-자주-쓰는-유틸리티-카테고리)
5. [CSS 파일 비교: style_old.css → src/style.css](#5-css-파일-비교)
6. [HTML 비교: 기존 클래스 → Tailwind 유틸리티 클래스](#6-html-비교)
7. [@layer: 컴포넌트 클래스 만들기](#7-layer-컴포넌트-클래스-만들기)
8. [JS 상태 제어 CSS 처리 방법](#8-js-상태-제어-css-처리-방법)
9. [자주 하는 실수와 해결 방법](#9-자주-하는-실수와-해결-방법)

---

## 1. TailwindCSS란?

### 기존 CSS 방식 (Semantic CSS)

CSS 클래스에 **의미 있는 이름**을 붙이고, 그 클래스 안에 스타일을 정의합니다.

```css
/* css/style_old.css */
.btn {
    padding: 12px 22px;
    border: none;
    border-radius: 5px;
    font-weight: 600;
}
.btn-primary {
    background-color: #3498db;
    color: white;
}
```

```html
<!-- HTML에서 사용 -->
<button class="btn btn-primary">부서 생성</button>
```

HTML은 짧지만, CSS 파일이 길어집니다. 스타일을 바꾸려면 CSS 파일로 이동해야 합니다.

---

### TailwindCSS 방식 (Utility-first CSS)

**미리 만들어진 작은 CSS 클래스**들을 HTML에 직접 조합합니다.

```html
<!-- HTML에 직접 스타일을 조합 -->
<button class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
    부서 생성
</button>
```

HTML에 클래스가 많아지지만, CSS 파일이 거의 필요 없어집니다.

---

### 비교 요약

| 항목 | 기존 CSS | TailwindCSS |
|------|----------|-------------|
| 스타일 위치 | CSS 파일 | HTML 클래스 |
| CSS 파일 크기 | 크다 (283줄) | 작다 (129줄) |
| 새 스타일 추가 | CSS 파일 수정 필요 | HTML 클래스 추가만으로 해결 |
| 컴포넌트 재사용 | `.btn` 같은 클래스 | `@layer components`로 정의 |
| 빌드 후 크기 | 전체 CSS 포함 | **사용한 클래스만** 포함 (자동 최적화) |

---

## 2. 설치 및 설정

### 이 프로젝트의 설정 (Vite + TailwindCSS v4)

```bash
npm install tailwindcss @tailwindcss/vite
```

**vite.config.js** — 플러그인 추가만 하면 됩니다 (설정 파일 없음)

```javascript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),  // 이것만 추가하면 끝!
    ],
});
```

**src/style.css** — `@import` 한 줄로 TailwindCSS 전체를 활성화합니다

```css
@import "tailwindcss";
```

> **TailwindCSS v3와 다른 점**
> - v3: `@tailwind base; @tailwind components; @tailwind utilities;` (3줄 필요)
> - v4: `@import "tailwindcss";` (1줄로 끝)
> - v4: `tailwind.config.js` 설정 파일 **불필요**

---

## 3. 유틸리티 클래스란?

TailwindCSS의 각 클래스는 **CSS 속성 하나**에 대응합니다.

### 네이밍 규칙

```
[속성 약어] - [크기/값]
```

| Tailwind 클래스 | 실제 CSS |
|-----------------|----------|
| `p-5` | `padding: 1.25rem` |
| `px-4` | `padding-left: 1rem; padding-right: 1rem` |
| `py-2` | `padding-top: 0.5rem; padding-bottom: 0.5rem` |
| `m-4` | `margin: 1rem` |
| `mx-auto` | `margin-left: auto; margin-right: auto` |
| `w-full` | `width: 100%` |
| `max-w-5xl` | `max-width: 64rem` |
| `text-sm` | `font-size: 0.875rem` |
| `font-semibold` | `font-weight: 600` |
| `bg-blue-500` | `background-color: rgb(59 130 246)` |
| `text-white` | `color: rgb(255 255 255)` |
| `rounded-md` | `border-radius: 0.375rem` |
| `border` | `border-width: 1px` |
| `shadow-md` | `box-shadow: ...` |

### 크기 스케일 (0 ~ 96)

TailwindCSS의 숫자는 `0.25rem` 단위입니다.

| 클래스 | 실제 값 |
|--------|---------|
| `p-1` | `0.25rem (4px)` |
| `p-2` | `0.5rem (8px)` |
| `p-4` | `1rem (16px)` |
| `p-5` | `1.25rem (20px)` |
| `p-8` | `2rem (32px)` |

---

## 4. 자주 쓰는 유틸리티 카테고리

### 4-1. 색상 (Colors)

TailwindCSS는 색상 팔레트를 제공합니다:

```
[색상이름]-[농도(50~950)]
```

| 클래스 | 색상 |
|--------|------|
| `bg-blue-500` | 파란색 배경 |
| `bg-emerald-500` | 초록색 배경 |
| `bg-red-500` | 빨간색 배경 |
| `bg-amber-400` | 노란색 배경 |
| `bg-sky-500` | 하늘색 배경 |
| `bg-slate-500` | 회색 배경 |
| `text-slate-700` | 어두운 회색 텍스트 |
| `border-slate-200` | 연한 회색 테두리 |

```html
<!-- 이 프로젝트의 버튼 색상들 -->
<button class="bg-blue-500 text-white">Primary</button>
<button class="bg-emerald-500 text-white">Success</button>
<button class="bg-red-500 text-white">Danger</button>
<button class="bg-amber-400 text-white">Warning</button>
```

---

### 4-2. 레이아웃 (Layout)

**Flexbox**

```html
<!-- display: flex + gap: 1rem + flex-wrap: wrap + align-items: flex-end -->
<div class="flex gap-4 flex-wrap items-end">
    <input class="flex-1 min-w-48" ...>  <!-- flex: 1 1 0; min-width: 12rem -->
    <button>조회</button>
</div>
```

**중앙 정렬 컨테이너**

```html
<!-- max-width: 64rem + margin: auto + background: white + padding + border-radius + shadow -->
<div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
```

---

### 4-3. 상태 변형 (State Variants)

`: (콜론)` 뒤에 상태를 붙입니다:

```html
<!-- hover: 마우스를 올렸을 때 -->
<button class="bg-blue-500 hover:bg-blue-600">
    버튼
</button>

<!-- focus: 포커스 상태 -->
<input class="border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
```

**이 프로젝트에서 사용한 상태 변형들:**

| 클래스 | 의미 |
|--------|------|
| `hover:bg-blue-600` | 마우스 오버 시 배경색 변경 |
| `hover:-translate-y-0.5` | 마우스 오버 시 0.125rem 위로 이동 |
| `hover:shadow-md` | 마우스 오버 시 그림자 추가 |
| `focus:outline-none` | 포커스 시 기본 아웃라인 제거 |
| `focus:border-blue-400` | 포커스 시 테두리 색 변경 |
| `focus:ring-2 focus:ring-blue-100` | 포커스 시 파란 링 표시 |

---

### 4-4. 반응형 (Responsive)

화면 크기에 따라 다른 스타일을 적용합니다:

```html
<!-- 기본: 세로 배치 / md(768px) 이상: 가로 배치 -->
<div class="flex flex-col md:flex-row">
```

| 접두사 | 화면 크기 |
|--------|----------|
| (없음) | 모든 크기 (모바일 우선) |
| `sm:` | 640px 이상 |
| `md:` | 768px 이상 |
| `lg:` | 1024px 이상 |
| `xl:` | 1280px 이상 |

---

## 5. CSS 파일 비교

### 5-1. 전체 파일 크기 비교

| 항목 | css/style_old.css | src/style.css |
|------|-------------------|---------------|
| 줄 수 | 283줄 | 129줄 |
| 감소 | - | **-54%** |
| 역할 | 모든 스타일 직접 작성 | 재사용 컴포넌트만 정의 |

---

### 5-2. 기본 리셋 (Reset)

**이전 (css/style_old.css)**

```css
/* 기본 스타일 초기화 — 직접 작성 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

**이후 (src/style.css)**

```css
/* TailwindCSS의 Preflight가 자동으로 처리 */
@import "tailwindcss";
```

> **Preflight란?**
> TailwindCSS에 내장된 CSS 리셋입니다. `@import "tailwindcss"` 한 줄로
> 브라우저 기본 스타일을 정리하고 일관성 있는 기반을 만들어줍니다.

---

### 5-3. 레이아웃 클래스 (body, container)

**이전 — CSS 파일에 정의**

```css
body {
    background-color: #f4f7f6;
    color: #333;
    line-height: 1.6;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
```

**이후 — CSS 파일에서 삭제, HTML에 직접 작성**

```html
<!-- CSS 파일 불필요 → HTML 클래스로 직접 표현 -->
<body class="bg-slate-100 text-slate-700 min-h-screen p-5">
<div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
```

| 기존 CSS 속성 | Tailwind 클래스 |
|---------------|-----------------|
| `background-color: #f4f7f6` | `bg-slate-100` |
| `color: #333` | `text-slate-700` |
| `padding: 20px` | `p-5` |
| `max-width: 1000px` | `max-w-5xl` |
| `margin: 0 auto` | `mx-auto` |
| `background: #fff` | `bg-white` |
| `padding: 30px` | `p-8` |
| `border-radius: 12px` | `rounded-2xl` |
| `box-shadow: 0 4px 20px ...` | `shadow-md` |

---

### 5-4. 버튼 스타일

**이전 — CSS 파일 (55줄)**

```css
.btn {
    padding: 12px 22px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    white-space: nowrap;
}
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.btn-primary { background-color: #3498db; color: white; }
.btn-primary:hover { background-color: #2980b9; }
.btn-success { background-color: #27ae60; color: white; }
.btn-success:hover { background-color: #219150; }
.btn-danger  { background-color: #e74c3c; color: white; padding: 7px 14px; }
.btn-warning { background-color: #f39c12; color: white; padding: 7px 14px; }
.btn-info    { background-color: #17a2b8; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
/* ...더 많음 */
```

**이후 — src/style.css (@layer components, 21줄)**

```css
@layer components {
    .btn {
        @apply inline-block px-5 py-2.5 font-semibold rounded-md text-sm text-white
               border-none cursor-pointer transition-all duration-300
               hover:-translate-y-0.5 hover:shadow-md;
    }
    .btn-sm      { @apply px-3 py-1.5 text-xs rounded; }

    .btn-primary   { @apply bg-blue-500    hover:bg-blue-600; }
    .btn-success   { @apply bg-emerald-500 hover:bg-emerald-600; }
    .btn-danger    { @apply bg-red-500     hover:bg-red-600; }
    .btn-warning   { @apply bg-amber-400   hover:bg-amber-500; }
    .btn-info      { @apply bg-sky-500     hover:bg-sky-600; }
    .btn-secondary { @apply bg-slate-500   hover:bg-slate-600; }
}
```

`@apply`는 Tailwind 유틸리티 클래스를 커스텀 CSS 클래스 안에 포함시키는 문법입니다.

---

### 5-5. 테이블 스타일

**이전 — CSS 파일 (28줄)**

```css
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { text-align: left; padding: 14px 16px; border-bottom: 1px solid #eee; vertical-align: middle; }
th { background-color: #f8f9fa; color: #2c3e50; font-weight: 600; font-size: 0.9rem; }
tr:hover { background-color: #f9f9f9; }
.actions { display: flex; gap: 8px; }
```

**이후 — HTML + @layer base (14줄)**

```css
/* src/style.css — JS가 동적으로 생성하는 <tr><td>에 기본 스타일을 적용 */
@layer base {
    tbody td { @apply text-slate-700 px-4 py-3 border-b border-slate-100 align-middle; }
    tbody tr { @apply transition-colors; }
    tbody tr:hover { @apply bg-slate-50; }
}
```

```html
<!-- th는 HTML에 직접 클래스 작성 -->
<th class="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">ID</th>
```

> **왜 td는 @layer base에 정의하나요?**
> JavaScript가 `innerHTML`로 동적 생성하는 `<td>`에는 클래스를 붙이기 어렵습니다.
> `@layer base`에 정의하면 클래스 없는 `<td>`에도 스타일이 자동으로 적용됩니다.

---

### 5-6. 삭제된 CSS

TailwindCSS 적용으로 **직접 작성할 필요가 없어진** 스타일들:

| 삭제된 CSS 규칙 | 대체 방법 |
|-----------------|----------|
| `body { background-color, color, padding }` | HTML `class` 직접 작성 |
| `.container { max-width, margin, padding, border-radius, box-shadow }` | HTML `class` 직접 작성 |
| `header { text-align, margin-bottom }` | HTML `class` 직접 작성 |
| `h1 { color, font-size, font-weight }` | HTML `class` 직접 작성 |
| `.tabs { display: flex, border-bottom }` | HTML `class` 직접 작성 |
| `.card { border, border-radius, padding, margin-bottom }` | HTML `class` 직접 작성 |
| `input, select { 모든 폼 스타일 }` | HTML `class` 직접 작성 |
| `table, th, td { 기본 테이블 스타일 }` | `@layer base` + HTML `class` |
| `#message-area { position, top, right, z-index, width }` | HTML `class` 직접 작성 |

---

## 6. HTML 비교

### 6-1. body 및 메인 컨테이너

**이전 — 기존 CSS 클래스 사용**

```html
<body>
<div class="container">
    <header>
        <h1>Employee & Department Manager</h1>
    </header>
```

**이후 — Tailwind 유틸리티 클래스 직접 작성**

```html
<body class="bg-slate-100 text-slate-700 min-h-screen p-5">
<div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
    <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Employee &amp; Department Manager</h1>
    </header>
```

---

### 6-2. 탭 내비게이션

**이전 — `.tabs`, `.tab-button` 클래스**

```html
<nav class="tabs">
    <button class="tab-button active" onclick="showTab('dept-section')">부서 관리</button>
    <button class="tab-button"        onclick="showTab('emp-section')">직원 관리</button>
</nav>
```

```css
/* css/style_old.css */
.tabs { display: flex; border-bottom: 2px solid #eee; margin-bottom: 30px; }
.tab-button { padding: 12px 24px; font-weight: 600; color: #7f8c8d; ... }
.tab-button.active { color: #3498db; border-bottom: 3px solid #3498db; }
```

**이후 — Tailwind 클래스 직접, .tab-button.active만 CSS에 유지**

```html
<nav class="flex border-b-2 border-slate-200 mb-8">
    <button class="tab-button active
                   px-6 py-3 font-semibold text-slate-400
                   border-b-4 border-transparent -mb-0.5
                   hover:bg-slate-50 hover:text-slate-600
                   transition-all duration-300"
            onclick="showTab('dept-section')">부서 관리 (Department)</button>
```

```css
/* src/style.css — JS가 .active 클래스를 toggle하므로 CSS에서만 정의 가능 */
.tab-button.active {
    @apply text-blue-500 border-blue-500;
}
```

> **왜 .tab-button.active는 여전히 CSS에 남아있나요?**
> JavaScript가 `classList.add('active')`로 동적으로 추가하는 클래스이기 때문입니다.
> Tailwind는 HTML에 이미 쓰여있는 클래스만 빌드에 포함하므로,
> JS로 동적으로 추가되는 클래스는 CSS 파일에 직접 정의해야 합니다.

---

### 6-3. 카드(card) 컨테이너

**이전 — `.card` 클래스**

```html
<div class="card">
    <h3 class="...">부서 등록</h3>
    <form>...</form>
</div>
```

```css
.card { background: #fff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; margin-bottom: 25px; }
.card h3 { margin-bottom: 20px; color: #2c3e50; border-left: 4px solid #3498db; padding-left: 12px; }
```

**이후 — Tailwind 유틸리티 클래스 직접 (`.card`는 JS querySelector용으로만 유지)**

```html
<div class="card border border-slate-200 rounded-xl p-6 mb-6">
    <h3 class="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">
        부서 등록
    </h3>
    <form>...</form>
</div>
```

> **`.card` 클래스가 아직 남아있는 이유**
> JavaScript에서 `querySelector('.card:nth-child(2)')` 형태로 DOM 요소를 찾기 때문입니다.
> Tailwind 클래스로 바꿔도 이 선택자는 작동하지 않으므로, 의미 없는 클래스라도 유지해야 합니다.

---

### 6-4. 폼 입력 필드

**이전**

```html
<div class="form-inline">
    <div class="form-group">
        <label for="dept-name">부서명</label>
        <input type="text" id="dept-name" placeholder="예: HR" required>
    </div>
</div>
```

```css
.form-inline { display: flex; gap: 15px; align-items: baseline; flex-wrap: wrap; }
.form-group { margin-bottom: 15px; flex: 1; }
label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: #555; }
input[type="text"] { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px; ... }
input:focus { border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); outline: none; }
```

**이후**

```html
<div class="flex gap-4 flex-wrap mb-4">
    <div class="flex-1 min-w-48">
        <label class="block mb-1.5 font-semibold text-sm text-slate-500">부서명</label>
        <input type="text" id="dept-name" placeholder="예: HR" required
               class="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white
                      focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                      transition-all">
    </div>
</div>
```

| 기존 CSS | Tailwind 클래스 |
|----------|-----------------|
| `.form-inline { display: flex; gap: 15px; flex-wrap: wrap }` | `flex gap-4 flex-wrap` |
| `.form-group { flex: 1; margin-bottom: 15px }` | `flex-1 min-w-48` (div에) |
| `label { display: block; margin-bottom: 6px; font-weight: 600 }` | `block mb-1.5 font-semibold text-sm text-slate-500` |
| `input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 5px }` | `w-full px-3 py-2.5 border border-slate-300 rounded-md` |
| `input:focus { border-color: #3498db; box-shadow: ...; outline: none }` | `focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100` |

---

### 6-5. 알림 메시지 영역

**이전**

```html
<div id="message-area">
    <div id="alert-success" class="alert">성공 메시지</div>
    <div id="alert-error"   class="alert">오류 메시지</div>
</div>
```

```css
#message-area { position: fixed; top: 20px; right: 20px; z-index: 1000; width: 300px; }
.alert { padding: 15px 25px; border-radius: 5px; color: white; display: none; opacity: 0;
         transform: translateX(100%); transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
.alert.show { display: block; opacity: 1; transform: translateX(0); }
.alert-success { background-color: #2ecc71; }
.alert-error   { background-color: #e74c3c; }
```

**이후**

```html
<div id="message-area" class="fixed top-5 right-5 z-50 w-72 space-y-2">
    <div id="alert-success" class="alert rounded-lg px-5 py-4 text-white bg-emerald-500 shadow-lg">성공 메시지</div>
    <div id="alert-error"   class="alert rounded-lg px-5 py-4 text-white bg-red-500   shadow-lg">오류 메시지</div>
</div>
```

```css
/* src/style.css — 애니메이션은 CSS transition을 직접 사용 */
.alert {
    display: none; opacity: 0; transform: translateX(100%);
    transition: opacity 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.alert.show { display: block; opacity: 1; transform: translateX(0); }
```

> **왜 `.alert` 애니메이션은 Tailwind로 못 바꾸나요?**
> `cubic-bezier(0.68, -0.55, 0.27, 1.55)` 같은 커스텀 easing은 Tailwind 기본값에 없습니다.
> 이런 경우 CSS를 직접 작성합니다. Tailwind와 일반 CSS를 함께 사용할 수 있습니다.

---

## 7. @layer: 컴포넌트 클래스 만들기

TailwindCSS에는 3개의 레이어가 있습니다:

```
base < components < utilities
(낮은 우선순위)          (높은 우선순위)
```

### 7-1. @layer base

**가장 낮은 우선순위**. 클래스가 없는 HTML 요소에 기본 스타일을 적용합니다.

```css
/* src/style.css */
@layer base {
    /* JavaScript가 innerHTML로 생성하는 <td>에 자동 적용 */
    tbody td {
        @apply text-slate-700 px-4 py-3 border-b border-slate-100 align-middle;
    }
    tbody tr:hover {
        @apply bg-slate-50;
    }
}
```

### 7-2. @layer components

**중간 우선순위**. 반복 사용되는 UI 패턴을 클래스로 정의합니다.

```css
/* src/style.css */
@layer components {
    .btn {
        @apply inline-block px-5 py-2.5 font-semibold rounded-md text-sm text-white
               border-none cursor-pointer transition-all duration-300
               hover:-translate-y-0.5 hover:shadow-md;
    }
}
```

### 7-3. utilities (Tailwind 기본)

**가장 높은 우선순위**. HTML에 직접 쓰는 `px-5`, `bg-blue-500` 같은 클래스들입니다.
나중에 추가해도 항상 components와 base를 덮어씁니다.

**실제 예시:**

```html
<!-- .btn (components)이 기본 스타일을 정의하고,
     btn-primary (components)가 색상을 추가하고,
     HTML의 ml-2 (utilities)가 margin을 추가합니다 -->
<button class="btn btn-primary ml-2">수정 저장</button>
```

---

## 8. JS 상태 제어 CSS 처리 방법

Tailwind는 빌드 시점에 HTML에 있는 클래스만 분석합니다.
JavaScript로 동적으로 추가되는 클래스는 CSS 파일에 직접 정의해야 합니다.

```css
/* src/style.css — JS가 동적으로 제어하는 클래스들 */

/* showTab()이 classList.add('active')로 추가 */
.tab-button.active { @apply text-blue-500 border-blue-500; }

/* showTab()이 classList.add('active')로 추가 */
.content-section        { display: none; }
.content-section.active { display: block; animation: fadeIn 0.4s ease; }

/* showMessage()가 classList.add('show')로 추가 */
.alert.show { display: block; opacity: 1; transform: translateX(0); }

/* showLoading()이 style.display로 직접 제어 */
.loading { display: none; }
```

---

## 9. 자주 하는 실수와 해결 방법

### 실수 1: JS로 동적 추가하는 클래스가 적용 안 됨

```javascript
// 이렇게 하면 안 됩니다!
element.classList.add('bg-red-500'); // 빌드에 포함 안 될 수 있음
```

**해결:** CSS 파일에 정의하거나, HTML에 미리 클래스를 작성합니다.

```css
/* src/style.css에 직접 작성 */
.my-error-state { @apply bg-red-500 text-white; }
```

---

### 실수 2: 테이블 텍스트가 파란색으로 표시됨

Tailwind의 Preflight가 `<a>` 태그 스타일을 리셋하면서 `<td>` 안의 텍스트가 영향받을 수 있습니다.

**해결:** `@layer base`에서 `tbody td`에 명시적으로 색상을 지정합니다.

```css
@layer base {
    tbody td { @apply text-slate-700; }
}
```

---

### 실수 3: querySelector가 동작하지 않음

Tailwind로 마이그레이션 시 기존 CSS 클래스를 제거하면,
JS의 `querySelector('.card')`, `querySelector('.form-inline')` 등이 실패합니다.

**해결:** JS가 참조하는 클래스는 CSS 역할이 없어도 HTML에서 제거하지 않습니다.

```html
<!-- .card는 CSS 스타일 없이도 JS querySelector용으로 유지 -->
<div class="card border border-slate-200 rounded-xl p-6 mb-6">
```

---

### 실수 4: select 커스텀 화살표가 사라짐

Tailwind Preflight가 `<select>`의 기본 화살표를 제거합니다.

**해결:** `appearance-none` 클래스를 추가하고 필요하면 SVG 화살표를 별도 추가합니다.

```html
<select class="appearance-none ...">
```

> 이 프로젝트에서는 화살표 없이 `appearance-none`만 사용합니다.

---

## 빠른 참조 카드

### 이 프로젝트에서 자주 쓰인 Tailwind 클래스 모음

```html
<!-- 페이지 배경 + 패딩 -->
<body class="bg-slate-100 text-slate-700 min-h-screen p-5">

<!-- 메인 컨테이너 -->
<div class="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">

<!-- 카드 -->
<div class="card border border-slate-200 rounded-xl p-6 mb-6">

<!-- 섹션 제목 (파란 왼쪽 테두리) -->
<h3 class="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">

<!-- 가로 배열 폼 행 -->
<div class="flex gap-4 flex-wrap mb-4">

<!-- 입력 필드 -->
<input class="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white
              focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
              transition-all">

<!-- 알림 영역 (우상단 고정) -->
<div class="fixed top-5 right-5 z-50 w-72">

<!-- 테이블 헤더 셀 -->
<th class="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">
```
