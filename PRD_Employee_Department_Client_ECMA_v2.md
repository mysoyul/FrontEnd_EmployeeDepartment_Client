# PRD: Employee & Department Management Web Client

**문서 버전:** 2.0  
**변경 이력:**  
| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-03-16 | 최초 작성 (Vanilla JS 기반) |
| 2.0 | 2026-03-17 | ECMAScript 모던 문법 적용 (빌드 도구 미사용) |

**작성 대상:** Gemini-CLI (AI 코드 생성 요청용)  
**기술 스택:** HTML / CSS / JavaScript (ECMAScript Modules, Ajax)

---

## 1. 프로젝트 개요 (Project Overview)

### 1.1 배경
Spring Boot 기반의 Employee & Department REST API가 `http://localhost:8080`에서 실행 중입니다.  
이 API와 Ajax 통신하는 **다중 파일 구조의 ECMAScript 모듈 기반 웹 클라이언트**를 구현합니다.

**v1.0(Vanilla JS)에서 v2.0(ECMAScript)으로의 핵심 변경:**
- 전역 함수/변수 남발 → **ES Module(`import`/`export`)** 로 파일 간 의존성 명확화
- `var` → **`const` / `let`** 으로 스코프 안전성 확보
- 일반 객체 전달 → **클래스(Class)** 로 API 서비스 계층 구조화
- 공통 로직의 중복 제거 → **모듈 분리** 를 통한 재사용성 향상
- Vite 등 빌드 도구는 **미사용** (브라우저 네이티브 ES Module로 직접 실행)

### 1.2 목표
- Backend API의 모든 엔드포인트를 UI에서 호출할 수 있어야 함
- 브라우저 네이티브 ES Module(`type="module"`)로 빌드 도구 없이 실행 가능
- ECMAScript 모던 문법을 학습하면서 코드 구조 개선
- **다음 단계(Vite 빌드 도구 적용)를 위한 모듈 구조를 미리 준비**

---

## 2. 기술 스펙 (Technical Specification)

### 2.1 Backend API 베이스 URL
```
http://localhost:8080
```

### 2.2 ECMAScript 적용 문법 목록

아래 문법을 **반드시 사용**하고 각 문법에 **한글 주석으로 설명**을 달아야 합니다.

| ES 문법 | 사용 목적 | v1.0 대비 변경 |
|---------|-----------|--------------|
| `const` / `let` | 변수 선언 (블록 스코프) | `var` 완전 제거 |
| Arrow Function `() => {}` | 콜백 함수 간결화 | `function` 키워드 대체 |
| Template Literal `` `${}` `` | 문자열 내 변수 삽입 | 문자열 연결(`+`) 대체 |
| Destructuring `{ }` / `[ ]` | 객체/배열에서 값 추출 | 개별 프로퍼티 접근 대체 |
| Spread Operator `...` | 객체 병합/복사 | `Object.assign()` 대체 |
| Optional Chaining `?.` | null/undefined 안전 접근 | 조건문으로 null 체크 대체 |
| Nullish Coalescing `??` | 기본값 처리 | `\|\|` 로직 대체 |
| `class` | API 서비스 계층 구조화 | 일반 함수 모음 대체 |
| `import` / `export` | 모듈 간 의존성 명확화 | 전역 함수 공유 대체 |
| `async` / `await` | 비동기 처리 (유지) | v1.0과 동일 |
| Array 고차 함수 `map`, `forEach`, `filter` | 배열 데이터 처리 | for 루프 대체 |
| `Promise.all()` | 복수 API 병렬 호출 | 순차 호출 최적화 |

### 2.3 파일 구조

```
project/
├── index.html              ← 진입점 HTML (ES Module 스크립트 태그 포함)
├── style.css               ← 전체 스타일 (v1.0과 동일하게 유지)
└── js/
    ├── api/
    │   ├── departmentApi.js  ← 부서 API 통신 클래스 (class DepartmentApi)
    │   └── employeeApi.js    ← 직원 API 통신 클래스 (class EmployeeApi)
    ├── ui/
    │   ├── departmentUI.js   ← 부서 DOM 렌더링 함수
    │   └── employeeUI.js     ← 직원 DOM 렌더링 함수
    ├── utils.js              ← 공통 유틸리티 함수 (escapeHTML, showMessage 등)
    └── main.js               ← 앱 진입점, 이벤트 초기화
```

> **⚠️ 실행 방법 변경:**  
> ES Module은 `file://` 프로토콜(파일을 직접 더블클릭)로 실행하면 CORS 오류가 발생합니다.  
> 반드시 **VS Code Live Server** 또는 `npx serve .` 명령어로 로컬 웹 서버를 통해 실행해야 합니다.

### 2.4 index.html의 스크립트 태그 방식

```html
<!-- ECMAScript Module 방식 - type="module" 필수 -->
<script type="module" src="js/main.js"></script>

<!-- v1.0 방식 - 더 이상 사용하지 않음 -->
<!-- <script src="department.js"></script> -->
<!-- <script src="employee.js"></script> -->
```

---

## 3. ECMAScript 모듈별 상세 명세

### 3.1 `js/utils.js` — 공통 유틸리티 모듈

**역할:** 여러 모듈에서 공통으로 사용하는 함수 모음. `export`로 외부에 공개.

```javascript
//  export 키워드: 이 함수를 다른 파일에서 import해서 사용할 수 있게 합니다.

// XSS 방지용 HTML 이스케이프
export const escapeHTML = (str) => { ... };

// 성공/오류 메시지 표시 (기존 showMessage와 동일한 역할)
export const showMessage = (message, isError = false) => { ... };

// API 에러를 사용자 메시지로 변환
export const handleApiError = (error) => { ... };
```

**v1.0 대비 변경점:**
- `department.js`에 있던 `escapeHTML`, `showMessage`, `handleApiError`를 이 파일로 이동
- `employee.js`에서 `department.js`의 전역 함수를 의존하던 구조 → `import`로 명확화

---

### 3.2 `js/api/departmentApi.js` — 부서 API 서비스 클래스

**역할:** 부서 관련 모든 HTTP 통신을 클래스로 캡슐화.

```javascript
//  import: utils.js에서 공통 함수를 가져옵니다.
import { handleApiError } from '../utils.js';

//  class: 관련 함수들을 하나의 설계도(클래스)로 묶습니다.
export class DepartmentApi {
    //  #baseUrl: 클래스 private 필드 (외부에서 직접 접근 불가)
    #baseUrl = 'http://localhost:8080/api/departments';

    // 전체 부서 조회
    async getAll() { ... }

    // ID로 단건 조회
    async getById(id) { ... }

    // 부서 생성
    //  Destructuring: 파라미터에서 필요한 값만 추출
    async create({ departmentName, departmentDescription }) { ... }

    // 부서 수정
    async update(id, { departmentName, departmentDescription }) { ... }

    // 부서 삭제
    async delete(id) { ... }
}
```

**v1.0 대비 변경점:**

| v1.0 (Vanilla) | v2.0 (ECMAScript) |
|---------------|-------------------|
| `async function fetchAllDepartments()` | `class DepartmentApi { async getAll() }` |
| `async function createDepartment(data)` | `async create({ departmentName, departmentDescription })` — Destructuring 적용 |
| `const API_BASE_URL = '...'` (전역) | `#baseUrl = '...'` — 클래스 private 필드 |
| 파일 상단에 전역 선언 | `export class` 로 외부 노출 |

---

### 3.3 `js/api/employeeApi.js` — 직원 API 서비스 클래스

**역할:** 직원 관련 모든 HTTP 통신을 클래스로 캡슐화.

```javascript
import { handleApiError } from '../utils.js';

export class EmployeeApi {
    #baseUrl = 'http://localhost:8080/api/employees';

    async getAll() { ... }
    async getAllWithDepartments() { ... }
    async getById(id) { ... }
    async getByEmail(email) { ... }

    //  Spread Operator: 기존 객체를 복사하면서 새 속성 추가
    async create(employeeData) { ... }
    async update(id, employeeData) { ... }
    async delete(id) { ... }
}
```

**v1.0 대비 변경점:**

| v1.0 (Vanilla) | v2.0 (ECMAScript) |
|---------------|-------------------|
| `async function fetchAllEmployees()` | `class EmployeeApi { async getAll() }` |
| `async function fetchEmployeeByEmail(email)` | `async getByEmail(email)` |
| `department.js`의 전역 `handleApiError` 직접 사용 | `import { handleApiError } from '../utils.js'` |

---

### 3.4 `js/ui/departmentUI.js` — 부서 렌더링 모듈

**역할:** 부서 관련 DOM 조작 및 이벤트 처리.

```javascript
//  named import: 필요한 함수만 선택해서 가져옵니다.
import { escapeHTML, showMessage } from '../utils.js';
import { DepartmentApi } from '../api/departmentApi.js';

//  인스턴스 생성: 클래스로부터 실제 사용할 객체를 만듭니다.
const departmentApi = new DepartmentApi();

// 부서 목록 렌더링
//  Array.map(): 배열의 각 요소를 변환하여 새 배열 생성
export const renderDepartmentList = (departments) => {
    const rows = departments.map(dept => `
        <tr>
            <td>${dept.id}</td>
            <td>${escapeHTML(dept.departmentName)}</td>
            <td>${escapeHTML(dept.departmentDescription)}</td>
            <td class="actions">
                <button data-id="${dept.id}" data-action="edit"
                        data-department='${JSON.stringify(dept)}'>수정</button>
                <button data-id="${dept.id}" data-action="delete">삭제</button>
            </td>
        </tr>
    `).join('');
    // ...
};

// 단건 조회 결과 렌더링
export const renderDepartmentDetail = (department) => { ... };

// 폼 초기화
export const resetDeptForm = () => { ... };

// 수정 모드 폼 설정
export const setupDeptEditForm = (department) => { ... };

// 부서 목록으로 드롭다운 채우기 (직원 폼용)
export const populateDeptDropdown = (departments, selectElement) => { ... };

// 초기화 함수 (이벤트 리스너 등록)
export const initDepartmentTab = async () => { ... };
```

**v1.0 대비 변경점:**

| v1.0 (Vanilla) | v2.0 (ECMAScript) |
|---------------|-------------------|
| `departments.forEach(dept => { ... })` | `departments.map(dept => \`...\`).join('')` — innerHTML 한번에 설정 |
| `escapeHTML`는 같은 파일 내 전역 함수 | `import { escapeHTML } from '../utils.js'` |
| `DOMContentLoaded`에서 직접 이벤트 등록 | `export const initDepartmentTab = async () => {}` 로 외부에서 호출 |

---

### 3.5 `js/ui/employeeUI.js` — 직원 렌더링 모듈

**역할:** 직원 관련 DOM 조작 및 이벤트 처리.

```javascript
import { escapeHTML, showMessage } from '../utils.js';
import { EmployeeApi } from '../api/employeeApi.js';
import { DepartmentApi } from '../api/departmentApi.js';

const employeeApi = new EmployeeApi();
const departmentApi = new DepartmentApi();

// 직원 목록 렌더링 (부서 정보 포함 여부 파라미터)
export const renderEmployeeList = (employees, withDept = false) => {
    //  Optional Chaining: emp.departmentDto가 null이어도 오류 없이 처리
    //  Nullish Coalescing: null/undefined일 때 기본값 'N/A' 사용
    const deptInfo = withDept
        ? (emp.departmentDto?.departmentName ?? 'N/A')
        : emp.departmentId;
    // ...
};

export const renderEmployeeDetail = (employee) => { ... };
export const resetEmpForm = () => { ... };
export const setupEmpEditForm = (employee) => { ... };
export const initEmployeeTab = async () => { ... };
```

**v1.0 대비 변경점:**

| v1.0 (Vanilla) | v2.0 (ECMAScript) |
|---------------|-------------------|
| `emp.departmentDto?.departmentName \|\| 'N/A'` | `emp.departmentDto?.departmentName ?? 'N/A'` — `??` (Nullish Coalescing) 명확히 사용 |
| `if (initEmployeeTab.initialized) return;` (함수 프로퍼티로 플래그 관리) | `main.js`에서 이벤트 리스너 한 번만 등록하도록 구조 개선 |
| `employee.js`에서 `department.js`의 전역 `fetchAllDepartments` 암묵적 의존 | `import { DepartmentApi } from '../api/departmentApi.js'` 로 명시적 의존 |

---

### 3.6 `js/main.js` — 앱 진입점

**역할:** 모듈 조합, 탭 전환 초기화. 앱의 시작점.

```javascript
//  import: 각 모듈에서 필요한 함수만 가져옵니다.
import { initDepartmentTab } from './ui/departmentUI.js';
import { initEmployeeTab } from './ui/employeeUI.js';

// 탭 전환 로직
const showTab = (sectionId) => { ... };

// DOMContentLoaded: HTML이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    //  Promise.all(): 부서와 직원 탭 초기화를 병렬로 실행
    // (순차 실행보다 빠름)
    initDepartmentTab();

    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-button').forEach(btn => {
        //  Arrow Function: 이벤트 리스너를 간결하게 작성
        btn.addEventListener('click', (e) => {
            showTab(e.currentTarget.dataset.tab);
        });
    });
});
```

**v1.0 대비 변경점:**

| v1.0 (Vanilla) | v2.0 (ECMAScript) |
|---------------|-------------------|
| `department.js`의 `DOMContentLoaded` 내에서 모든 초기화 | `main.js`가 전체 앱 초기화를 담당 |
| HTML의 `onclick="showTab('...')"` 인라인 이벤트 | JS에서 `addEventListener`로 이벤트 등록 (관심사 분리) |
| 직원 탭은 첫 클릭 시 `initEmployeeTab()` 호출 | 동일 패턴 유지, 단 플래그 로직은 `main.js`에서 관리 |

---

## 4. Department API 엔드포인트 명세 (v1.0과 동일)

| 기능 | Method | URL | Request Body | Response |
|------|--------|-----|--------------|----------|
| 부서 생성 | POST | `/api/departments` | `{ departmentName, departmentDescription }` | 201 Created |
| 부서 전체 조회 | GET | `/api/departments` | 없음 | 200 OK, DepartmentDto[] |
| 부서 단건 조회 | GET | `/api/departments/{id}` | 없음 | 200 OK, DepartmentDto |
| 부서 수정 | PUT | `/api/departments/{id}` | `{ departmentName, departmentDescription }` | 200 OK |
| 부서 삭제 | DELETE | `/api/departments/{id}` | 없음 | 200 OK, 문자열 |

#### DepartmentDto
```json
{ "id": 1, "departmentName": "HR", "departmentDescription": "performs human resource management functions" }
```

---

## 5. Employee API 엔드포인트 명세 (v1.0과 동일)

| 기능 | Method | URL | Request Body | Response |
|------|--------|-----|--------------|----------|
| 직원 생성 | POST | `/api/employees` | `{ firstName, lastName, email, departmentId }` | 201 Created |
| 직원 전체 조회 | GET | `/api/employees` | 없음 | 200 OK, EmployeeDto[] |
| 직원 단건 조회 (ID) | GET | `/api/employees/{id}` | 없음 | 200 OK |
| 직원 단건 조회 (이메일) | GET | `/api/employees/email/{email}` | 없음 | 200 OK |
| 직원 + 부서 전체 조회 | GET | `/api/employees/departments` | 없음 | 200 OK (departmentDto 포함) |
| 직원 수정 | PUT | `/api/employees/{id}` | `{ firstName, lastName, email, departmentId }` | 200 OK |
| 직원 삭제 | DELETE | `/api/employees/{id}` | 없음 | 200 OK, 문자열 |

#### EmployeeDto (기본 조회)
```json
{ "id": 1, "firstName": "John", "lastName": "Smith", "email": "John@company.com", "departmentId": 1, "departmentDto": null }
```

#### EmployeeDto (부서 포함 조회)
```json
{
  "id": 1, "firstName": "John", "lastName": "Smith", "email": "John@company.com",
  "departmentId": null,
  "departmentDto": { "id": 1, "departmentName": "HR", "departmentDescription": "performs human resource management functions" }
}
```

---

## 6. 기능 요구사항 (v1.0과 동일, 구현 방식만 변경)

### 6.1 부서 관리 탭
- 부서 생성 폼 → `POST /api/departments`
- 드롭다운으로 부서 단건 조회 → `GET /api/departments/{id}`
- 전체 부서 목록 테이블 (수정/삭제 버튼 포함)
- 수정 모드: 폼 자동 채움 → `PUT /api/departments/{id}`
- 삭제: `confirm()` 후 → `DELETE /api/departments/{id}`

### 6.2 직원 관리 탭
- 직원 생성 폼 (부서 드롭다운 포함) → `POST /api/employees`
- ID 조회 → `GET /api/employees/{id}`
- 이메일 조회 → `GET /api/employees/email/{email}`
- 전체 직원 목록 + [직원+부서 조회] 버튼
- 수정/삭제 (부서 탭과 동일 패턴)

---

## 7. 비기능 요구사항

### 7.1 ECMAScript 코드 작성 규칙

```javascript
//  v2.0에서 사용하는 문법 패턴 예시

// 1. const/let (var 금지)
const API_URL = 'http://localhost:8080/api';   // 변하지 않는 값
let currentMode = 'create';                     // 변할 수 있는 값

// 2. Arrow Function
const escapeHTML = (str) => str.replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;' }[c]));

// 3. Template Literal
const url = `${API_URL}/departments/${id}`;

// 4. Destructuring
const { departmentName, departmentDescription } = formData;
const [first, ...rest] = departments;

// 5. Optional Chaining + Nullish Coalescing
const deptName = employee.departmentDto?.departmentName ?? '부서 없음';

// 6. Spread Operator
const updatedEmployee = { ...originalEmployee, departmentId: newDeptId };

// 7. Array 고차 함수
const rows = departments.map(dept => `<tr><td>${dept.id}</td></tr>`).join('');
const activeDepts = departments.filter(dept => dept.id > 0);

// 8. Class
class DepartmentApi {
    #baseUrl = 'http://localhost:8080/api/departments';
    async getAll() {
        const response = await fetch(this.#baseUrl);
        return response.json();
    }
}

// 9. import / export
export { DepartmentApi };
import { DepartmentApi } from './api/departmentApi.js';
```

### 7.2 주석 규칙
- **ES 문법 첫 사용 위치마다** 해당 문법이 무엇인지 한글 주석으로 설명
- 예: `//  Destructuring: 객체에서 필요한 값만 골라 변수에 할당합니다.`
- 클래스의 각 메서드에 JSDoc 형식의 주석 유지

### 7.3 Ajax 통신 방식 (v1.0과 동일)
- `fetch API` + `async/await` 유지
- `Content-Type: application/json` 헤더
- `try/catch`로 오류 처리

### 7.4 실행 환경
- **브라우저:** Chrome, Edge 최신 버전 (ES Module 네이티브 지원)
- **서버:** VS Code Live Server 또는 `npx serve .`  
  ⚠️ `file://`로 직접 열기 **불가** (ES Module CORS 제한)

---

## 8. API 응답 오류 처리 규칙 (v1.0과 동일)

| HTTP 상태 코드 | 상황 | 처리 방법 |
|---------------|------|-----------|
| 200 OK | 성공 (조회, 수정, 삭제) | 결과 표시 |
| 201 Created | 성공 (생성) | 성공 메시지 + 목록 갱신 |
| 400 Bad Request | 유효성 검사 실패 | 서버 오류 메시지 표시 |
| 404 Not Found | 리소스 없음 | "해당 ID가 존재하지 않습니다" 표시 |
| 500 Internal Server Error | 서버 오류 | "서버 오류가 발생했습니다" 표시 |
| Network Error | 서버 연결 불가 | "서버에 연결할 수 없습니다. localhost:8080 확인 필요" 표시 |

---

## 9. 구현 시 주의사항

1. **ES Module 실행 환경:** `type="module"` 스크립트는 반드시 HTTP(S) 서버에서 실행 (Live Server 필수)
2. **import 경로:** 상대 경로 + `.js` 확장자를 반드시 포함 (`'./utils.js'` ← `.js` 생략 불가)
3. **`this` 바인딩:** 클래스 메서드 내부에서 Arrow Function 사용 시 `this`가 의도치 않게 동작할 수 있으므로 주의
4. **CORS:** 백엔드에 `@CrossOrigin("*")`이 설정되어 있어 별도 처리 불필요
5. **이메일 경로 변수:** `GET /api/employees/email/{email}` — `@` 기호 그대로 URL에 포함 가능 (v1.0과 동일)
6. **departmentDto null 처리:** `/api/employees` 기본 조회 시 `departmentDto`는 항상 `null`. Optional Chaining(`?.`)으로 안전하게 처리
7. **class private 필드 (`#`):** Chrome 74+, Edge 79+에서 지원. 지원 브라우저 확인 필요
8. **인라인 이벤트 핸들러 제거:** `onclick="showTab(...)"` 같은 HTML 인라인 이벤트는 `main.js`에서 `addEventListener`로 대체

---

## 10. 구현 우선순위 (v1.0과 동일)

| 우선순위 | 기능 |
|---------|------|
| P1-1 (필수) | `utils.js` 공통 모듈 구현 |
| P1-2 (필수) | `departmentApi.js` 클래스 구현 + 부서 CRUD 전체 |
| P1-3 (필수) | `employeeApi.js` 클래스 구현 + 직원 CRUD 전체 + 이메일 조회 |
| P2-1 (중요) | 직원 + 부서 통합 조회 (`/api/employees/departments`) |
| P2-2 (중요) | 성공/오류 메시지 표시 |
| P3-1 (선택) | 로딩 상태 표시 |
| P3-2 (선택) | `Promise.all()`로 초기 데이터 병렬 로딩 최적화 |

---

## 11. 최종 산출물 요구사항

**파일 목록:**
```
project/
├── index.html
├── style.css
└── js/
    ├── api/
    │   ├── departmentApi.js
    │   └── employeeApi.js
    ├── ui/
    │   ├── departmentUI.js
    │   └── employeeUI.js
    ├── utils.js
    └── main.js
```

**실행 방법:** VS Code Live Server 또는 `npx serve .` 후 `http://localhost:5500` 접속  
**브라우저 지원:** Chrome, Edge 최신 버전

---

## 12. v1.0 → v2.0 마이그레이션 대조표

| 항목 | v1.0 (Vanilla JS) | v2.0 (ECMAScript) |
|------|-------------------|-------------------|
| 파일 수 | 4개 (index.html, style.css, department.js, employee.js) | 8개 (모듈 분리) |
| 변수 선언 | `var` / `const` / `let` 혼용 | `const` / `let` 만 사용 |
| 함수 스타일 | `function` 키워드 중심 | Arrow Function 중심 |
| 파일 간 공유 | 전역 변수/함수 (암묵적 의존) | `import/export` (명시적 의존) |
| API 계층 | 개별 함수 모음 (`fetchAllDepartments` 등) | `class DepartmentApi`, `class EmployeeApi` |
| DOM 조작 | `forEach` + `innerHTML` 개별 설정 | `map().join('')` + `innerHTML` 한 번에 설정 |
| null 안전 처리 | `\|\|` 연산자 | `?.` + `??` 연산자 |
| HTML 이벤트 | `onclick="showTab(...)"` 인라인 | `addEventListener` (JS에서 등록) |
| 스크립트 로드 | `<script src="...">` (일반) | `<script type="module" src="...">` |
| 다음 단계 준비 | Vite 적용 불편 (전역 변수 충돌) | Vite 적용 용이 (모듈 구조 동일) |

---

*이 PRD를 Gemini-CLI에 전달하여 ECMAScript 모듈 기반의 클라이언트를 구현 요청하세요.*  
*v1.0 소스(department.js, employee.js, index.html, style.css)를 참고 자료로 함께 제공하면 더 정확한 결과를 얻을 수 있습니다.*
