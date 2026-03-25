# Axios 가이드 — fetch에서 axios로

> **프로젝트**: Employee & Department Manager
> **대상**: React 초보자, fetch API를 사용해본 분

---

## 1. axios란

axios는 브라우저와 Node.js에서 HTTP 요청을 보내는 라이브러리입니다.
브라우저 내장 `fetch`보다 더 적은 코드로 같은 기능을 구현할 수 있습니다.

```bash
npm install axios
```

---

## 2. fetch vs axios 핵심 비교

같은 GET 요청을 두 가지 방식으로 작성해 보겠습니다.

### fetch 방식

```js
// 1. 요청
const response = await fetch('http://localhost:8080/api/employees');

// 2. 에러 확인 (fetch는 4xx/5xx도 성공으로 처리하므로 수동 확인 필요)
if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message ?? `HTTP 오류: ${response.status}`);
}

// 3. JSON 파싱 (별도 호출 필요)
const data = await response.json();
```

### axios 방식

```js
// 한 줄로 끝납니다.
const { data } = await axios.get('http://localhost:8080/api/employees');
// 4xx/5xx → 자동으로 에러 throw
// JSON 파싱 → 자동으로 response.data에 담김
```

---

## 3. fetch vs axios 기능 비교표

| 항목 | fetch | axios |
|------|-------|-------|
| 설치 | 불필요 (브라우저 내장) | `npm install axios` |
| 4xx/5xx 에러 throw | 직접 확인 필요 (`response.ok`) | **자동** |
| JSON 파싱 | `.json()` 별도 호출 | **자동** (`response.data`) |
| JSON 직렬화 (POST body) | `JSON.stringify()` 직접 호출 | **자동** |
| Content-Type 헤더 | 매 요청마다 직접 설정 | 인스턴스에서 한 번만 |
| 쿼리 파라미터 | `URLSearchParams` 직접 생성 | `params` 옵션으로 간결하게 |
| 요청/응답 가로채기 | 없음 | **인터셉터** 지원 |
| 요청 취소 | AbortController (복잡) | 간단하게 지원 |

---

## 4. 기본 사용법

### GET

```js
import axios from 'axios';

// 기본 GET
const { data } = await axios.get('http://localhost:8080/api/employees');

// 쿼리 파라미터 포함 GET
// → http://localhost:8080/api/employees/page?pageNo=0&pageSize=5
const { data } = await axios.get('http://localhost:8080/api/employees/page', {
    params: { pageNo: 0, pageSize: 5, sortBy: 'id', sortDir: 'asc' },
});
```

### POST

```js
// fetch: JSON.stringify + headers 직접 설정
const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName: 'Alice', lastName: 'Kim' }),
});

// axios: 객체를 그대로 전달 (자동 직렬화)
const { data } = await axios.post(url, { firstName: 'Alice', lastName: 'Kim' });
```

### PUT

```js
const { data } = await axios.put(`${url}/${id}`, { firstName: 'Bob' });
```

### DELETE

```js
await axios.delete(`${url}/${id}`);
```

---

## 5. 응답 구조 — response.data

axios의 응답 객체는 아래 구조를 가집니다.

```js
const response = await axios.get('/api/employees');

response.data    // 서버가 보낸 실제 데이터 (JSON 파싱 완료)
response.status  // HTTP 상태 코드 (200, 201 ...)
response.headers // 응답 헤더
```

보통은 구조분해 할당으로 `data`만 꺼내서 사용합니다.

```js
const { data } = await axios.get('/api/employees');
// data = [{ id: 1, firstName: 'Alice', ... }, ...]
```

---

## 6. 에러 처리

axios는 4xx/5xx 응답에서 자동으로 에러를 throw합니다.
에러 객체에서 다음 정보를 꺼낼 수 있습니다.

```js
try {
    const { data } = await axios.get('/api/employees/999');
} catch (err) {
    err.message           // 에러 메시지 (기본: "Request failed with status code 404")
    err.response.status   // HTTP 상태 코드: 404
    err.response.data     // 서버가 보낸 에러 응답 본문: { message: "직원을 찾을 수 없습니다" }
}
```

### 특정 상태 코드만 따로 처리하기

```js
async getById(id) {
    try {
        const { data } = await axios.get(`/api/employees/${id}`);
        return data;
    } catch (err) {
        if (err.response?.status === 404) return null; // 404이면 null 반환
        throw err;                                      // 나머지 에러는 그대로 throw
    }
}
```

---

## 7. axios 인스턴스 — 공통 설정 분리

매 요청마다 baseURL이나 헤더를 반복하지 않도록 `axios.create()`로 인스턴스를 만듭니다.

```js
// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',           // 모든 요청에 자동으로 붙는 기본 URL
    headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
```

```js
// 사용 시: baseURL이 자동으로 붙습니다.
import axios from './axiosInstance.js';

// http://localhost:8080/api/employees 로 요청됩니다.
const { data } = await axios.get('/api/employees');
```

---

## 8. 인터셉터 — 요청/응답 가로채기

인터셉터는 **모든 요청 또는 응답을 가로채서 공통 처리**를 추가하는 기능입니다.

```
요청 흐름:
컴포넌트 → [요청 인터셉터] → 서버 → [응답 인터셉터] → 컴포넌트

인터셉터에서 할 수 있는 것:
  요청 인터셉터: 토큰 자동 추가, 로딩 시작
  응답 인터셉터: 에러 메시지 변환, 토큰 만료 처리, 로딩 종료
```

### 응답 에러 인터셉터 — 서버 에러 메시지 적용

이 프로젝트에서 사용하는 패턴입니다.

```js
axiosInstance.interceptors.response.use(
    // 성공 응답 (2xx): 그대로 통과
    response => response,

    // 에러 응답 (4xx, 5xx): 서버 메시지로 err.message 교체
    error => {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
            error.message = serverMessage;
        }
        return Promise.reject(error);
    }
);
```

**인터셉터 적용 효과:**

```
서버 응답: { "message": "이미 사용 중인 이메일입니다" }

인터셉터 없음: err.message = "Request failed with status code 400"
인터셉터 적용: err.message = "이미 사용 중인 이메일입니다"

컴포넌트: showToast(err.message, true)
결과: 토스트 메시지에 "이미 사용 중인 이메일입니다" 표시
```

---

## 9. 이 프로젝트 적용 내용

### 추가/수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/api/axiosInstance.js` | **신규 생성** — 공통 인스턴스 + 에러 인터셉터 |
| `src/api/employeeApi.js` | fetch → axios 교체, checkResponse 제거 |
| `src/api/departmentApi.js` | fetch → axios 교체, checkResponse 제거 |

### 코드 변경 전/후 비교

**전체 직원 조회**
```js
// fetch (변경 전)
async getAll() {
    const response = await fetch(this.#baseUrl);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message ?? `HTTP 오류: ${response.status}`);
    }
    return response.json();
}

// axios (변경 후)
async getAll() {
    const { data } = await axios.get(this.#base);
    return data;
}
```

**페이징 조회**
```js
// fetch (변경 전)
async getPage({ pageNo = 0, pageSize = 5, sortBy = 'id', sortDir = 'asc' } = {}) {
    const params = new URLSearchParams({ pageNo, pageSize, sortBy, sortDir });
    const response = await fetch(`${this.#baseUrl}/page?${params}`);
    await checkResponse(response);
    return response.json();
}

// axios (변경 후)
async getPage({ pageNo = 0, pageSize = 5, sortBy = 'id', sortDir = 'asc' } = {}) {
    const { data } = await axios.get(`${this.#base}/page`, {
        params: { pageNo, pageSize, sortBy, sortDir },
    });
    return data;
}
```

**직원 생성**
```js
// fetch (변경 전)
async create(employeeData) {
    const response = await fetch(this.#baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employeeData }),
    });
    await checkResponse(response);
    return response.json();
}

// axios (변경 후)
async create(employeeData) {
    const { data } = await axios.post(this.#base, employeeData);
    return data;
}
```

### 제거된 코드

```js
// checkResponse 함수 완전 제거 (axios가 자동 처리)
const checkResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `HTTP 오류! 상태 코드: ${response.status}`,
        }));
        throw new Error(errorData?.message ?? `HTTP 오류! 상태 코드: ${response.status}`);
    }
    return response;
};
```

---

## 10. axios 인스턴스 + 인터셉터 전체 흐름

```
컴포넌트
  await loadEmployeesPage()
      │
      ▼
employeeStore.js
  await employeeApi.getPage({ pageNo: 1, ... })
      │
      ▼
employeeApi.js
  axios.get('/api/employees/page', { params: {...} })
      │
      ▼
[요청 인터셉터] → baseURL 자동 결합
      │            http://localhost:8080/api/employees/page?pageNo=1&...
      ▼
Spring Boot 서버
      │
      ▼
[응답 인터셉터]
  성공(200): response 그대로 통과
  실패(4xx): error.message = 서버 메시지로 교체 후 throw
      │
      ▼
employeeApi.js
  return response.data  ← { content: [...], totalPages: 5 }
      │
      ▼
employeeStore.js
  set({ employees: data.content, totalPages: data.totalPages })
      │
      ▼
EmpList.jsx (자동 리렌더링)
```

---

## 11. 주의사항

| 항목 | 설명 |
|------|------|
| **baseURL 끝 슬래시** | `baseURL: 'http://localhost:8080'` (끝에 `/` 없이), 경로는 `/api/...`로 시작 |
| **response.data** | axios는 `response.data`에 파싱된 데이터가 있습니다. `response.json()`을 쓰면 에러 납니다 |
| **404 처리** | axios는 404도 에러로 throw합니다. `getById()`처럼 null을 반환해야 할 때는 `catch`에서 처리합니다 |
| **인터셉터 순서** | 응답 인터셉터 이후 `error.response`는 여전히 접근 가능합니다 (`err.response?.status === 404`) |
| **params vs URL 직접 작성** | `params` 옵션을 쓰면 axios가 인코딩을 처리합니다. 직접 쿼리 문자열을 붙이지 않습니다 |
