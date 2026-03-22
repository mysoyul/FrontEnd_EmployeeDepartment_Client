# PRD: Employee & Department Manager — React v3 (입문자 가이드)

## 버전 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | - | Vanilla JS + 전역 함수 + CDN CSS |
| v2.0 | - | Vite + ECMAScript (ES Module, Class) + TailwindCSS v4 |
| **v3.0** | **2026-03-19** | **Vite + React 18 + TailwindCSS v4** |

---

## 1. React란? (처음 배우는 분을 위해)

### 1-1. 왜 React를 사용하나요?

기존 ECMAScript 방식은 HTML을 JavaScript가 직접 수정합니다:

```javascript
// 기존 방식: DOM을 직접 조작
document.getElementById('dept-list').innerHTML = rows.join('');
document.getElementById('dept-name').value = dept.departmentName;
document.getElementById('dept-cancel-btn').style.display = 'inline-block';
```

데이터가 바뀔 때마다 화면 여러 곳을 직접 찾아서 고쳐야 합니다.
코드가 많아질수록 관리가 어렵습니다.

**React 방식:** 데이터(State)만 바꾸면 화면이 자동으로 다시 그려집니다.

```jsx
// React 방식: 데이터만 바꾸면 화면이 알아서 업데이트됨
setDepartments(data);       // 목록이 자동으로 테이블에 반영됨
setEditingDept(dept);       // 폼이 자동으로 수정 모드로 전환됨
```

---

### 1-2. React 3가지 핵심 개념

#### ① 컴포넌트 (Component)

화면을 작은 부품으로 쪼갠 것입니다.
레고 블록처럼 조립해서 전체 화면을 만듭니다.

```
App (전체 앱)
├── Toast (알림 메시지)
├── DeptSection (부서 섹션 전체)
│   ├── DeptForm   (부서 등록/수정 폼)
│   ├── DeptSearch (부서 조회)
│   └── DeptList   (부서 목록 테이블)
└── EmpSection (직원 섹션 전체)
    ├── EmpForm   (직원 등록/수정 폼)
    ├── EmpSearch (직원 조회)
    └── EmpList   (직원 목록 테이블)
```

컴포넌트는 이렇게 생겼습니다:

```jsx
// 컴포넌트 = 화면을 반환하는 함수
function DeptList({ departments }) {
    return (
        <table>
            {departments.map(dept => (
                <tr key={dept.id}>
                    <td>{dept.departmentName}</td>
                </tr>
            ))}
        </table>
    );
}
```

#### ② 상태 (State)

컴포넌트가 기억하는 데이터입니다.
State가 바뀌면 화면이 자동으로 다시 그려집니다.

```jsx
// useState 사용법
const [값, 값을바꾸는함수] = useState(초기값);

// 예시
const [departments, setDepartments] = useState([]); // 처음에는 빈 배열
const [loading, setLoading]         = useState(false);

// setDepartments를 호출하면 화면이 자동으로 업데이트됩니다.
setDepartments([{ id: 1, departmentName: 'HR' }]); // → 테이블에 바로 반영
```

#### ③ Props (속성)

부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터입니다.
함수의 매개변수와 같은 역할입니다.

```jsx
// 부모 (DeptSection)가 자식 (DeptList)에게 데이터를 전달
<DeptList
    departments={departments}    // 부서 목록 데이터
    onEdit={setEditingDept}      // 수정 버튼 클릭 시 실행할 함수
    onDelete={handleDelete}      // 삭제 버튼 클릭 시 실행할 함수
/>

// 자식 (DeptList)이 props를 받아서 사용
function DeptList({ departments, onEdit, onDelete }) {
    // departments, onEdit, onDelete를 여기서 사용합니다.
}
```

---

## 2. 프로젝트 구조 변경

### 2-1. 파일 구조 비교

**이전 (ECMAScript v2)**

```
src/
├── main.js                  ← 진입점
├── style.css                ← TailwindCSS
└── js/
    ├── dept_runner_v2.js    ← 부서 관련 모든 코드 (폼+목록+API 호출)
    ├── emp_runner_v2.js     ← 직원 관련 모든 코드
    ├── utils.js             ← 공통 함수 (showMessage, escapeHTML 등)
    └── api/
        ├── departmentApi.js
        └── employeeApi.js
```

**이후 (React v3)**

```
src/
├── main.jsx                 ← React 진입점 (createRoot)
├── App.jsx                  ← 루트 컴포넌트 (탭 + Toast 관리)
├── style.css                ← TailwindCSS (그대로 유지)
├── api/                     ← API 클래스 (구조 동일, DOM 의존성 제거)
│   ├── departmentApi.js
│   └── employeeApi.js
├── components/              ← React 컴포넌트들
│   ├── common/
│   │   └── Toast.jsx        ← 알림 메시지 (utils.js showMessage 대체)
│   ├── department/
│   │   ├── DeptSection.jsx  ← 부서 섹션 컨테이너 (데이터 관리)
│   │   ├── DeptForm.jsx     ← 부서 등록/수정 폼
│   │   ├── DeptSearch.jsx   ← 부서 단건 조회
│   │   └── DeptList.jsx     ← 부서 목록 테이블
│   └── employee/
│       ├── EmpSection.jsx   ← 직원 섹션 컨테이너
│       ├── EmpForm.jsx      ← 직원 등록/수정 폼
│       ├── EmpSearch.jsx    ← 직원 단건 조회 (ID/이메일)
│       └── EmpList.jsx      ← 직원 목록 테이블
└── org_js/                  ← 기존 ECMAScript 파일 보관 (참고용)
    ├── main.js
    ├── dept_runner_v2.js
    ├── emp_runner_v2.js
    ├── utils.js
    └── api/
        ├── departmentApi.js
        └── employeeApi.js
```

### 2-2. index.html 변화

**이전:** UI 전체를 HTML에 직접 작성 (수백 줄의 HTML)

```html
<section id="dept-section" class="content-section active">
    <div class="card ..."> ... </div>
    <div class="card ..."> ... </div>
</section>
```

**이후:** 단 한 줄만 남깁니다

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

React가 `<div id="root">` 안에 전체 UI를 JavaScript로 그립니다.

---

## 3. 컴포넌트 데이터 흐름

데이터는 항상 **부모 → 자식** 방향으로 흐릅니다.
자식이 부모에게 신호를 보낼 때는 부모가 전달한 **함수(callback)**를 호출합니다.

```
App
│  [state] activeTab, toast
│  [fn]    showToast
│
├── Toast             ← props: message, type, visible
│
├── DeptSection       ← props: showToast
│   │ [state] departments[], loading, editingDept
│   │ [fn]    loadDepartments, handleSubmit, handleDelete
│   │
│   ├── DeptForm      ← props: editingDept, onSubmit, onCancel
│   │   [state] name, desc
│   │
│   ├── DeptSearch    ← props: departments[], showToast
│   │   [state] selectedId, result
│   │
│   └── DeptList      ← props: departments[], loading, onEdit, onDelete, onRefresh
│
└── EmpSection        ← props: showToast
    │ [state] employees[], departments[], loading, editingEmp, withDept
    │
    ├── EmpForm       ← props: editingEmp, departments[], onSubmit, onCancel
    │   [state] firstName, lastName, email, departmentId
    │
    ├── EmpSearch     ← props: showToast
    │   [state] empId, empEmail, result
    │
    └── EmpList       ← props: employees[], loading, withDept, onEdit, onDelete,
                                onRefresh, onRefreshWithDept
```

---

## 4. 주요 변환 패턴 (ECMAScript → React)

### 4-1. DOM 직접 조작 → State 업데이트

| 기존 ECMAScript | React |
|-----------------|-------|
| `tbody.innerHTML = rows.join('')` | `setEmployees(data)` → map으로 자동 렌더링 |
| `input.value = dept.name` | `setName(dept.name)` → controlled input |
| `btn.style.display = 'none'` | `{editingDept && <button>}` → 조건부 렌더링 |
| `title.textContent = '수정'` | `{editingDept ? '수정' : '등록'}` → 삼항 연산자 |

### 4-2. 이벤트 리스너 → JSX 이벤트 핸들러

| 기존 ECMAScript | React |
|-----------------|-------|
| `form.addEventListener('submit', fn)` | `<form onSubmit={fn}>` |
| `btn.addEventListener('click', fn)` | `<button onClick={fn}>` |
| `input.addEventListener('focus', fn)` | `<input onFocus={fn}>` |

### 4-3. DOMContentLoaded → useEffect

| 기존 ECMAScript | React |
|-----------------|-------|
| 파일 로드 시 자동 실행 | `useEffect(() => { ... }, [])` |

### 4-4. innerHTML XSS 방지 → 자동 보호

| 기존 ECMAScript | React |
|-----------------|-------|
| `escapeHTML(str)` 함수 필요 | JSX가 자동으로 이스케이프 처리 |
| `<td>${escapeHTML(emp.firstName)}</td>` | `<td>{emp.firstName}</td>` |

### 4-5. 탭 전환 방식

| 기존 ECMAScript | React |
|-----------------|-------|
| `showTab()` 전역 함수 | `activeTab` state로 조건부 렌더링 |
| CSS `display: block/none` | `{activeTab === 'dept' && <DeptSection />}` |

---

## 5. 설정 파일 변경

### 5-1. package.json 변경

```json
// 추가된 항목
"dependencies": {
    "react": "^18.3.1",          // React 라이브러리
    "react-dom": "^18.3.1"       // React를 브라우저 DOM에 연결
},
"devDependencies": {
    "@vitejs/plugin-react": "^4.3.4"  // Vite에서 React JSX를 처리하는 플러그인
}
```

### 5-2. vite.config.js 변경

```javascript
import react from '@vitejs/plugin-react'; // 추가

plugins: [
    react(),        // React JSX 변환 + 저장 시 즉시 반영(Fast Refresh)
    tailwindcss(),  // TailwindCSS (유지)
]
```

### 5-3. .jsx 파일 확장자

React 컴포넌트는 JSX(HTML을 JavaScript 안에 쓰는 문법)를 사용하므로
`.js` 대신 `.jsx` 확장자를 사용합니다.

---

## 6. 보존된 기존 파일 (src/org_js/)

아래 파일들은 **삭제하지 않고** `src/org_js/`에 보관합니다.
React 버전의 Vite 빌드에는 포함되지 않으며, 학습 참고용으로 유지합니다.

| 파일 | 설명 |
|------|------|
| `org_js/main.js` | ECMAScript 진입점 |
| `org_js/dept_runner_v2.js` | 부서 UI 컨트롤러 |
| `org_js/emp_runner_v2.js` | 직원 UI 컨트롤러 |
| `org_js/utils.js` | 공통 유틸리티 함수 |
| `org_js/api/departmentApi.js` | 부서 API 클래스 |
| `org_js/api/employeeApi.js` | 직원 API 클래스 |

---

## 7. 실행 방법

```bash
# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행 (http://localhost:3000 자동 오픈)
npm run dev

# 배포용 빌드 생성
npm run build

# 빌드 결과 미리보기
npm run preview
```

> **사전 조건:** Spring Boot 백엔드(`http://localhost:8080`)가 실행 중이어야 합니다.

---

## 8. 빌드 결과 요약

| 항목 | 크기 |
|------|------|
| HTML | 0.90 kB |
| CSS (TailwindCSS) | 19.03 kB (gzip: 4.34 kB) |
| JS (React + 컴포넌트) | 162.08 kB (gzip: 50.30 kB) |
