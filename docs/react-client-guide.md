# React + Zustand 클라이언트 구현 가이드

백엔드 API(Spring Boot + JWT)와 연동하는 ReactJS + Zustand 클라이언트 구현 참조 문서입니다.

---

## 1. 백엔드 API 개요

| 항목 | 값 |
|---|---|
| Base URL | `http://localhost:8080` |
| 인증 방식 | JWT Bearer Token |
| 토큰 유효 시간 | 3600초 (60분) |
| Content-Type | `application/json` |

---

## 2. 전체 API 엔드포인트

### 2-1. 인증 (토큰 불필요)

| Method | URL | 설명 |
|---|---|---|
| POST | `/userinfos/new` | 회원 가입 |
| POST | `/userinfos/login` | 로그인 (JWT 토큰 발급) |

### 2-2. 직원 API

| Method | URL | 필요 권한 | 설명 |
|---|---|---|---|
| GET | `/api/employees/welcome` | 없음 | 공개 경로 |
| GET | `/api/employees` | `ROLE_ADMIN` | 전체 직원 목록 |
| GET | `/api/employees/{id}` | `ROLE_USER` | 직원 단건 조회 |
| GET | `/api/employees/email/{email}` | `ROLE_USER` | 이메일로 직원 조회 |
| GET | `/api/employees/departments` | 인증 | 직원+부서 목록 |
| GET | `/api/employees/page` | 인증 | 직원 페이징 조회 |
| POST | `/api/employees` | 인증 | 직원 등록 |
| PUT | `/api/employees/{id}` | 인증 | 직원 수정 |
| DELETE | `/api/employees/{id}` | 인증 | 직원 삭제 |

### 2-3. 부서 API

| Method | URL | 필요 권한 | 설명 |
|---|---|---|---|
| GET | `/api/departments` | 인증 | 전체 부서 목록 |
| GET | `/api/departments/{id}` | 인증 | 부서 단건 조회 |
| GET | `/api/departments/page` | 인증 | 부서 페이징 조회 |
| POST | `/api/departments` | 인증 | 부서 등록 |
| PUT | `/api/departments/{id}` | 인증 | 부서 수정 |
| DELETE | `/api/departments/{id}` | 인증 | 부서 삭제 |

---

## 3. 요청 / 응답 데이터 형식

### 3-1. 로그인

**요청**
```json
POST /userinfos/login
{
  "email": "admin@aa.com",
  "password": "pwd1"
}
```

**응답** — JWT 토큰 문자열 (plain text)
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbi4uLiIsImlhdCI6...
```

> 응답 `Content-Type`이 `text/plain`입니다. JSON이 아니므로 `response.data`로 바로 사용합니다.

---

### 3-2. 회원 가입

**요청**
```json
POST /userinfos/new
{
  "name": "홍길동",
  "email": "user@aa.com",
  "password": "pwd1",
  "roles": "ROLE_USER"
}
```

> `roles` 값은 반드시 `ROLE_USER` 또는 `ROLE_ADMIN` 형식으로 입력해야 합니다.
> 복수 권한은 `"ROLE_ADMIN,ROLE_USER"` 형식으로 입력합니다.

---

### 3-3. 직원 (EmployeeDto)

```typescript
interface EmployeeDto {
  id?: number;
  firstName: string;   // 필수
  lastName: string;    // 필수
  email: string;       // 필수
  departmentId: number; // 필수 (양수)
  departmentDto?: DepartmentDto; // GET /api/employees/departments 응답에 포함
}
```

### 3-4. 부서 (DepartmentDto)

```typescript
interface DepartmentDto {
  id?: number;
  departmentName: string;        // 필수
  departmentDescription: string; // 필수
}
```

### 3-5. 페이징 응답 (PageResponse)

```typescript
interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

**페이징 요청 파라미터**
```
GET /api/employees/page?pageNo=0&pageSize=10&sortBy=id&sortDir=asc
```

---

## 4. 에러 응답 형식

### 4-1. 표준 에러 (ErrorObject)

```typescript
interface ErrorObject {
  statusCode: number;
  message: string;
  timestamp: string; // "2026-03-25 18:57:05 수 오후"
}
```

### 4-2. 에러 코드별 응답 예시

**401 — 인증 실패 (토큰 없음 / 만료 / 잘못된 자격증명)**
```json
{
  "statusCode": 401,
  "message": "Full authentication is required to access this resource",
  "timestamp": "2026-03-25 18:57:05 수 오후"
}
```

**401 — 만료/위변조 토큰 (필터에서 직접 반환)**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired JWT token"
}
```

**403 — 권한 부족**
```json
{
  "statusCode": 403,
  "message": "Access Denied",
  "timestamp": "2026-03-25 18:57:05 수 오후"
}
```

**400 — 입력값 검증 실패 (ValidationErrorResponse)**
```json
{
  "status": 400,
  "message": "입력항목 검증 오류",
  "timestamp": "2026-03-25T18:57:05",
  "errors": {
    "firstName": "직원 firstName은 필수 입력 항목입니다.",
    "departmentId": "직원의 부서코드는 필수 입력 항목입니다."
  }
}
```

---

## 5. JWT 토큰 구조

로그인 성공 후 발급된 토큰을 `jwt.io`에서 디코딩하면:

```json
// Header
{ "alg": "HS256" }

// Payload
{
  "sub": "admin@aa.com",   // 사용자 이메일 (username)
  "iat": 1742745600,       // 발급 시간 (Unix timestamp)
  "exp": 1742749200        // 만료 시간 (발급 + 3600초)
}
```

> **주의**: 토큰 Payload에 roles 정보가 없습니다.
> 클라이언트에서 역할(role) 정보가 필요하면 로그인 응답과 별도로 관리해야 합니다.

---

## 6. React 클라이언트 구현 파일 구조

```
src/
├── api/
│   ├── axiosInstance.js     # 공통 axios 인스턴스 + 요청/응답 인터셉터
│   ├── authApi.js           # 로그인 / 회원가입 API 호출
│   ├── employeeApi.js       # 직원 API 호출
│   └── departmentApi.js     # 부서 API 호출
│
├── store/
│   ├── authStore.js         # 인증 상태 (token, email) + localStorage 연동
│   ├── employeeStore.js     # 직원 상태 + 페이징
│   └── departmentStore.js   # 부서 상태 + 페이징
│
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx    # 로그인 폼
│   │   └── RegisterPage.jsx # 회원가입 폼
│   ├── employee/            # 직원 관리 컴포넌트
│   └── department/          # 부서 관리 컴포넌트
│
└── App.jsx                  # 라우팅 + ProtectedRoute + 로그아웃
```

---

## 7. 인증 구현 — 파일별 역할

### 7-1. authApi.js

로그인과 회원가입 API를 호출합니다.

```js
// src/api/authApi.js
import axios from './axiosInstance.js';

export class AuthApi {
    // 로그인 — 응답이 plain text (JWT 토큰 문자열)
    async login(email, password) {
        const { data } = await axios.post('/userinfos/login', { email, password });
        return data; // "eyJhbGciOiJIUzI1NiJ9..."
    }

    // 회원 가입
    async register(userData) {
        const { data } = await axios.post('/userinfos/new', userData);
        return data;
    }
}
```

---

### 7-2. authStore.js

토큰과 이메일을 Zustand + localStorage에 함께 저장합니다.

```js
// src/store/authStore.js
import { create } from 'zustand';
import { AuthApi } from '../api/authApi.js';

const authApi = new AuthApi();

export const TOKEN_KEY = 'auth_token';
export const EMAIL_KEY = 'auth_email';

export const useAuthStore = create((set) => ({
    // localStorage에서 초기값 읽기 → 새로고침 후에도 로그인 유지
    token: localStorage.getItem(TOKEN_KEY) ?? null,
    email: localStorage.getItem(EMAIL_KEY) ?? null,

    login: async (email, password) => {
        const token = await authApi.login(email, password);
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EMAIL_KEY, email);
        set({ token, email });
    },

    register: async (userData) => {
        await authApi.register(userData);
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
        set({ token: null, email: null });
    },
}));
```

**localStorage를 사용하는 이유:**

```
Zustand 상태 → 메모리 저장 → 새로고침 시 초기화 (로그인 풀림)
localStorage  → 브라우저 저장 → 새로고침 후에도 유지

두 곳에 함께 저장하면:
  - 앱 실행 중: Zustand 상태로 읽음 (빠름)
  - 새로고침 시: localStorage.getItem()으로 복원
```

---

### 7-3. axiosInstance.js — 인터셉터 2가지 추가

#### 요청 인터셉터 — Bearer 토큰 자동 추가

```js
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // 반드시 반환해야 요청이 계속 진행됩니다.
    },
    error => Promise.reject(error)
);
```

> localStorage를 직접 읽는 이유: authStore를 import하면 순환 참조 발생
> `authStore → authApi → axiosInstance → authStore`

#### 응답 인터셉터 — 401 자동 로그아웃 추가

```js
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // 401: 토큰 없음 / 만료 / 위변조 → 자동 로그아웃
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_email');
            window.location.href = '/login';
            return Promise.reject(error);
        }
        // 그 외 에러: 서버 메시지로 err.message 교체
        const serverMessage = error.response?.data?.message;
        if (serverMessage) error.message = serverMessage;
        return Promise.reject(error);
    }
);
```

---

### 7-4. App.jsx — ProtectedRoute + 라우팅

#### ProtectedRoute 컴포넌트

```jsx
// token이 없으면 /login으로 리다이렉트
function ProtectedRoute({ children }) {
    const { token } = useAuthStore();
    if (!token) return <Navigate to="/login" replace />;
    return children;
}
```

#### 라우트 구성

```jsx
<Routes>
    {/* 공개 경로 — 토큰 없이 접근 가능 */}
    <Route path="/login"    element={<LoginPage    showToast={showToast} />} />
    <Route path="/register" element={<RegisterPage showToast={showToast} />} />

    {/* 보호 경로 — 토큰 없으면 /login으로 이동 */}
    <Route path="/" element={
        <ProtectedRoute><Navigate to="/dept" replace /></ProtectedRoute>
    } />
    <Route path="/dept" element={
        <ProtectedRoute><DeptSection showToast={showToast} /></ProtectedRoute>
    } />
    <Route path="/emp" element={
        <ProtectedRoute><EmpSection showToast={showToast} /></ProtectedRoute>
    } />
</Routes>
```

#### 로그아웃

```jsx
const { token, email, logout } = useAuthStore();
const navigate = useNavigate();

const handleLogout = () => {
    logout();           // localStorage 초기화 + 스토어 상태 초기화
    navigate('/login'); // /login 페이지로 이동
};
```

---

## 8. 전체 인증 흐름

### 8-1. 로그인 흐름

```
LoginPage
  handleSubmit()
      │  await login(email, password)
      ▼
authStore.login()
      │  await authApi.login(email, password)
      ▼
authApi.js
      │  POST /userinfos/login  { email, password }
      ▼
[요청 인터셉터]
      │  localStorage에 토큰 없음 → 헤더 미추가 (로그인은 토큰 불필요)
      ▼
Spring Boot 서버
      │  JWT 토큰 문자열 반환 (text/plain)
      ▼
[응답 인터셉터]
      │  2xx → 그대로 통과
      ▼
authStore.login()
      │  localStorage.setItem('auth_token', token)
      │  set({ token, email })
      ▼
LoginPage
  navigate('/dept')  → 부서 관리 페이지로 이동
```

### 8-2. 인증이 필요한 API 요청 흐름

```
EmpSection (useEffect)
  loadEmployeesPage()
      │
      ▼
employeeStore.js
  employeeApi.getPage(...)
      │
      ▼
employeeApi.js
  axios.get('/api/employees/page', { params })
      │
      ▼
[요청 인터셉터]
  localStorage에서 토큰 읽기
  config.headers.Authorization = 'Bearer eyJhbGci...'
      │
      ▼
Spring Boot 서버 (JWT 검증 성공)
  페이징 데이터 반환
      │
      ▼
[응답 인터셉터]
  2xx → 그대로 통과
      │
      ▼
employeeStore.js
  set({ employees: data.content, totalPages: data.totalPages })
      │
      ▼
EmpList.jsx (자동 리렌더링)
```

### 8-3. 토큰 만료 흐름

```
API 요청 (만료된 토큰 포함)
      │
      ▼
Spring Boot 서버
  401 응답 반환
      │
      ▼
[응답 인터셉터]
  error.response.status === 401 감지
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_email')
  window.location.href = '/login'
      │
      ▼
LoginPage (자동 이동)
```

### 8-4. 새로고침 후 로그인 유지 흐름

```
브라우저 새로고침
      │
      ▼
authStore 초기화
  token: localStorage.getItem('auth_token')  → 토큰 복원
  email: localStorage.getItem('auth_email')  → 이메일 복원
      │
      ▼
App.jsx 렌더링
  token 있음 → ProtectedRoute 통과 → 기존 페이지 유지
  token 없음 → /login 으로 이동
```

---

## 9. 주의사항

| 항목 | 설명 |
|------|------|
| **로그인 응답 형식** | `text/plain` — `response.data`가 바로 토큰 문자열. `response.data.token`이 아님 |
| **토큰에 roles 없음** | Payload에 역할 정보가 없으므로 클라이언트에서 역할 기반 UI 제어 불가 |
| **401 vs 403** | 401 = 인증 실패(토큰 없음/만료) → 자동 로그아웃. 403 = 권한 부족 → 접근 거부 메시지 표시 |
| **localStorage 키** | `auth_token`, `auth_email` — authStore.js와 axiosInstance.js에서 동일하게 사용 |
| **순환 참조 방지** | axiosInstance의 인터셉터는 authStore를 import하지 않고 localStorage를 직접 읽음 |
| **window.location.href** | 401 로그아웃 시 useNavigate 대신 사용. 인터셉터는 React 컴포넌트 밖이므로 훅 사용 불가 |

