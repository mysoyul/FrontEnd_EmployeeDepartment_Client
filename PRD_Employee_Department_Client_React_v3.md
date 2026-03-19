# PRD: Employee & Department Manager — React v3

## 버전 이력

| 버전 | 날짜 | 주요 변경 내용 |
|------|------|--------------|
| v1.0 | - | Vanilla JS + 전역 함수 + CDN CSS |
| v2.0 | - | Vite + ECMAScript (ES Module, Class) + TailwindCSS v4 |
| **v3.0** | **2026-03-19** | **Vite + React 18 + TailwindCSS v4 — 컴포넌트 기반 전환** |

---

## 1. 프로젝트 개요

Spring Boot REST API(`http://localhost:8080`)와 통신하는 **부서/직원 관리 SPA**입니다.
v3에서는 Vanilla JS의 DOM 직접 조작 방식에서 **React 컴포넌트 + Props 패턴**으로 전환합니다.

### 지원 기능

| 도메인 | 기능 |
|--------|------|
| 부서 (Department) | 전체 조회, ID 조회, 생성, 수정, 삭제 |
| 직원 (Employee) | 전체 조회, 부서 포함 조회, ID 조회, 이메일 조회, 생성, 수정, 삭제 |

---

## 2. 기술 스택 변경 (v2 → v3)

| 항목 | v2 (ECMAScript) | v3 (React) |
|------|-----------------|------------|
| UI 렌더링 | `innerHTML` 직접 조작 | React JSX 컴포넌트 |
| 상태 관리 | 변수 + DOM 업데이트 | `useState` 훅 |
| 사이드 이펙트 | DOMContentLoaded 이벤트 | `useEffect` 훅 |
| 알림 메시지 | `showMessage()` → DOM 조작 | `Toast` 컴포넌트 + state |
| 탭 전환 | `showTab()` 전역 함수 | `activeTab` state |
| 이벤트 바인딩 | `addEventListener` | JSX `onClick`, `onSubmit` |
| UI 프레임워크 | 없음 (Vanilla JS) | React 18 |
| 빌드 도구 | Vite 6 + TailwindCSS v4 | Vite 6 + `@vitejs/plugin-react` + TailwindCSS v4 |

---

## 3. 디렉토리 구조 변경

### v2 (ECMAScript)

```
level1_html_css_js/
├── index.html                  # 전체 UI HTML + 탭 전환 인라인 스크립트
├── src/
│   ├── main.js                 # 엔트리 포인트 (CSS + JS import)
│   ├── style.css               # TailwindCSS v4
│   └── js/
│       ├── dept_runner_v2.js   # 부서 UI 이벤트 + DOM 렌더링
│       ├── emp_runner_v2.js    # 직원 UI 이벤트 + DOM 렌더링
│       ├── utils.js            # escapeHTML, showMessage, handleApiError
│       └── api/
│           ├── departmentApi.js
│           └── employeeApi.js
├── js/                         # [레거시] 비Vite 학습용 파일들
└── css/                        # [레거시] 비Vite CSS
```

### v3 (React) — 변경 후

```
level1_html_css_js/
├── index.html                  # React 마운트 포인트만 포함 (<div id="root">)
├── src/
│   ├── main.jsx                # React 엔트리 포인트 (createRoot)
│   ├── App.jsx                 # 루트 컴포넌트 (탭 + Toast 상태 관리)
│   ├── style.css               # TailwindCSS v4 (유지)
│   ├── api/                    # API 클래스 (v2에서 이동, DOM 의존성 제거)
│   │   ├── departmentApi.js
│   │   └── employeeApi.js
│   └── components/
│       ├── common/
│       │   └── Toast.jsx       # 알림 메시지 컴포넌트
│       ├── department/
│       │   ├── DeptSection.jsx # 부서 섹션 컨테이너 (상태 + API 호출)
│       │   ├── DeptForm.jsx    # 부서 생성/수정 폼
│       │   ├── DeptSearch.jsx  # 부서 단건 조회 (select)
│       │   └── DeptList.jsx    # 부서 목록 테이블
│       └── employee/
│           ├── EmpSection.jsx  # 직원 섹션 컨테이너
│           ├── EmpForm.jsx     # 직원 생성/수정 폼
│           ├── EmpSearch.jsx   # 직원 단건 조회 (ID/이메일)
│           └── EmpList.jsx     # 직원 목록 테이블
└── vite.config.js              # @vitejs/plugin-react 추가
```

---

## 4. 삭제된 파일 목록

| 파일/디렉토리 | 삭제 이유 |
|--------------|----------|
| `js/` (루트) | 비Vite 레거시 학습용 파일. Vite 빌드에 포함되지 않음 |
| `css/` (루트) | 레거시 CSS. `src/style.css`(TailwindCSS)로 대체됨 |
| `src/main.js` | `src/main.jsx`로 대체 |
| `src/js/dept_runner_v2.js` | DeptSection, DeptForm, DeptList 컴포넌트로 분리 |
| `src/js/emp_runner_v2.js` | EmpSection, EmpForm, EmpList 컴포넌트로 분리 |
| `src/js/utils.js` | `escapeHTML` → React가 자동 이스케이프 처리 / `showMessage` → Toast 컴포넌트 / `handleApiError` → try-catch로 컴포넌트에서 직접 처리 |
| `src/js/api/` | `src/api/`로 이동 (경로 정리) |

---

## 5. React 컴포넌트 아키텍처

```
App
├── Toast                   # 고정 위치 알림 (prop: message, type, visible)
├── TabNav (인라인)          # 탭 버튼 2개
├── DeptSection             # activeTab === 'dept' 일 때만 렌더
│   ├── DeptForm            # 생성/수정 폼
│   ├── DeptSearch          # ID(select)로 단건 조회
│   └── DeptList            # 전체 목록 테이블
└── EmpSection              # activeTab === 'emp' 일 때만 렌더
    ├── EmpForm             # 생성/수정 폼 (부서 select 포함)
    ├── EmpSearch           # ID/이메일로 단건 조회
    └── EmpList             # 전체 목록 테이블 (일반/부서포함 토글)
```

---

## 6. 데이터 흐름 (Props Drilling)

```
App
│  state: activeTab, toast
│  fn: showToast(message, isError)
│
├── DeptSection
│     props: showToast
│     state: departments[], loading, editingDept
│     fn: loadDepartments, handleSubmit, handleDelete
│
│     ├── DeptForm
│     │     props: editingDept, onSubmit, onCancel
│     │     state: name, desc (controlled inputs)
│     │
│     ├── DeptSearch
│     │     props: departments[], showToast
│     │     state: selectedId, result
│     │
│     └── DeptList
│           props: departments[], loading, onEdit, onDelete, onRefresh
│
└── EmpSection
      props: showToast
      state: employees[], departments[], loading, editingEmp, withDept
      fn: loadEmployees, loadEmployeesWithDept, handleSubmit, handleDelete

      ├── EmpForm
      │     props: editingEmp, departments[], onSubmit, onCancel
      │     state: firstName, lastName, email, departmentId
      │
      ├── EmpSearch
      │     props: showToast
      │     state: empId, empEmail, result
      │     (포커스 시 반대 필드 자동 초기화)
      │
      └── EmpList
            props: employees[], loading, withDept, onEdit, onDelete,
                   onRefresh, onRefreshWithDept
```

---

## 7. API 레이어

v2의 클래스 기반 API를 그대로 재사용합니다. 단, **DOM을 직접 조작하는 `handleApiError` 의존성을 제거**하고 에러를 throw하여 컴포넌트의 `try-catch`가 처리하도록 변경합니다.

| 클래스 | 파일 | 메서드 |
|--------|------|--------|
| `DepartmentApi` | `src/api/departmentApi.js` | `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` |
| `EmployeeApi` | `src/api/employeeApi.js` | `getAll()`, `getAllWithDepartments()`, `getById(id)`, `getByEmail(email)`, `create(data)`, `update(id, data)`, `delete(id)` |

```
REST API (Spring Boot :8080)
    ↑↓
src/api/departmentApi.js  (DepartmentApi class)
src/api/employeeApi.js    (EmployeeApi class)
    ↑↓
DeptSection / EmpSection  (API 인스턴스 생성 + 호출)
    ↓ props
하위 컴포넌트들 (폼/검색/목록)
```

---

## 8. 주요 React 패턴

### 8-1. `useState` — 컴포넌트 상태 관리

```jsx
// v2: let departments = [];  → DOM 조작으로 반영
// v3: state 변경 시 React가 자동 리렌더
const [departments, setDepartments] = useState([]);
const [editingDept, setEditingDept] = useState(null); // null = 생성 모드, object = 수정 모드
```

### 8-2. `useEffect` — 마운트 시 데이터 로드

```jsx
// v2: DOMContentLoaded 이벤트 리스너
// v3: useEffect의 빈 의존성 배열 [] = 컴포넌트 마운트 시 1회 실행
useEffect(() => {
    loadDepartments();
}, []);
```

### 8-3. Controlled Input — 폼 입력 제어

```jsx
// v2: document.getElementById('dept-name').value = dept.departmentName
// v3: state와 input이 양방향 바인딩
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
```

### 8-4. 조건부 렌더링 — 수정/생성 모드 전환

```jsx
// v2: empFormTitle.textContent = '직원 수정'; empCancelBtn.style.display = 'inline-block'
// v3: editingDept prop 하나로 폼 전체가 자동 전환
{editingDept ? '부서 수정' : '부서 등록'}
{editingDept && <button onClick={onCancel}>취소</button>}
```

### 8-5. XSS 방지

```jsx
// v2: escapeHTML(str) 함수로 직접 이스케이프 후 innerHTML
// v3: JSX는 기본적으로 모든 값을 자동 이스케이프 처리
//     → escapeHTML 함수 불필요
<td>{emp.firstName}</td>   // React가 자동으로 안전하게 렌더링
```

### 8-6. 수정 시 부서 select 자동 선택

```jsx
// v2: empDeptIdSelect.value = String(deptId ?? '');
// v3: state로 관리되므로 useEffect에서 설정 시 자동 반영
useEffect(() => {
    if (editingEmp) {
        const deptId = editingEmp.departmentId ?? editingEmp.departmentDto?.id;
        setDepartmentId(String(deptId ?? ''));
    }
}, [editingEmp]);
```

---

## 9. CSS 전략 (TailwindCSS v4 유지)

`src/style.css`는 v2와 동일하게 유지됩니다.

- `@layer components` — `.btn`, `.btn-sm`, `.btn-*`, `.actions` 클래스
- `@layer base` — `tbody td` 기본 스타일
- `.tab-button.active` — 탭 활성 스타일
- `.alert` / `.alert.show` — Toast 슬라이드 인/아웃 애니메이션

React에서 `.content-section.active` 와 `.loading` 제어 방식이 변경됩니다:

| 항목 | v2 | v3 |
|------|----|----|
| 탭 섹션 표시 | `classList.add('active')` | `activeTab` state → 조건부 렌더링 |
| 로딩 표시 | `.loading` style.display 제어 | `loading` state → `{loading && <div>}` |

---

## 10. 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (port 3000, 브라우저 자동 오픈)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

> **사전 조건**: Spring Boot 백엔드(`http://localhost:8080`)가 실행 중이어야 합니다.
