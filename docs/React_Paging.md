# React 페이징(Paging) 기능 구현 정리

> **프로젝트**: Employee & Department Manager
> **서버 API 문서**: `docs/SpringBoot_Paging.md` 참고

---

## 1. 개요

**페이징(Paging)** 이란 전체 데이터를 한 번에 가져오는 대신, 한 화면에 보여줄 만큼만 나눠서 가져오는 기법입니다.

| 방식 | API 호출 | 데이터 양 |
|------|----------|-----------|
| 기존 (페이징 없음) | `GET /api/employees` | 전체 직원 목록 (N개) |
| 변경 (페이징 적용) | `GET /api/employees/page?pageNo=0&pageSize=5` | 5개씩 나눠서 |

### 구현 범위

- 직원 목록 (`EmpSection` / `EmpList`) — 페이지당 5개, 정렬 지원
- 부서 목록 (`DeptSection` / `DeptList`) — 페이지당 5개, 정렬 지원
- 공통 페이지 버튼 컴포넌트 (`Pagination.jsx`) 신규 생성

---

## 2. 추가/수정된 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/common/Pagination.jsx` | **신규 생성** — 이전/번호/다음 버튼 공통 컴포넌트 |
| `src/api/employeeApi.js` | `getPage()` 메서드 추가 |
| `src/api/departmentApi.js` | `getPage()` 메서드 추가 |
| `src/components/employee/EmpSection.jsx` | 페이징 상태 + 로직 추가 |
| `src/components/employee/EmpList.jsx` | `<Pagination>` 렌더링 추가 |
| `src/components/department/DeptSection.jsx` | 페이징 상태 + 로직 추가 |
| `src/components/department/DeptList.jsx` | `<Pagination>` 렌더링 추가 |

---

## 3. 핵심 React 개념: useEffect 의존성 배열

페이징의 핵심은 "페이지 번호가 바뀌면 자동으로 API를 다시 호출하는 것"입니다.
React에서는 `useEffect`의 **의존성 배열(dependency array)** 로 이를 구현합니다.

```jsx
useEffect(() => {
    loadEmployeesPage(currentPage);
}, [currentPage, sortBy, sortDir]);
//  ↑ 이 배열 안의 값이 바뀔 때마다 {} 안의 코드가 실행됩니다.
```

### 의존성 배열 동작 비교

| 의존성 배열 | 실행 시점 |
|------------|-----------|
| `[]` (빈 배열) | 컴포넌트가 처음 화면에 나타날 때 1번만 |
| `[currentPage]` | 처음 + `currentPage`가 바뀔 때마다 |
| `[currentPage, sortBy, sortDir]` | 처음 + 세 값 중 하나라도 바뀔 때마다 |

### 페이징에서의 흐름

```
버튼 클릭
  │
  ▼
setCurrentPage(2)        ← 상태 변경
  │
  ▼
React가 변경 감지
  │
  ▼
useEffect 재실행         ← 의존성 [currentPage, ...]가 바뀌었으니
  │
  ▼
loadEmployeesPage(2)     ← API 호출
  │
  ▼
setEmployees(data.content)  ← 상태 업데이트
  │
  ▼
화면 자동 갱신           ← React가 다시 렌더링
```

---

## 4. API 레이어 — getPage() 메서드

### employeeApi.js / departmentApi.js 공통 패턴

```js
// GET /api/employees/page?pageNo=0&pageSize=5&sortBy=id&sortDir=asc
async getPage({ pageNo = 0, pageSize = 5, sortBy = 'id', sortDir = 'asc' } = {}) {
    const params = new URLSearchParams({ pageNo, pageSize, sortBy, sortDir });
    const response = await fetch(`${this.#baseUrl}/page?${params}`);
    await checkResponse(response);
    return response.json();
}
```

### URLSearchParams 란?

쿼리 파라미터(`?key=value&key=value`)를 직접 문자열로 만들지 않아도 되는 브라우저 내장 API입니다.

```js
// 직접 쓰면 → 실수하기 쉽습니다
`/page?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`

// URLSearchParams 사용 → 깔끔합니다
const params = new URLSearchParams({ pageNo, pageSize, sortBy, sortDir });
`/page?${params}`
```

### 서버 응답 구조 (PageResponse)

```json
{
  "content":       [...],   ← 현재 페이지 데이터 배열 (React에서 테이블에 표시)
  "pageNo":        0,       ← 현재 페이지 번호 (0부터 시작)
  "pageSize":      5,       ← 페이지당 데이터 수
  "totalElements": 23,      ← 전체 데이터 수
  "totalPages":    5,       ← 전체 페이지 수 (React에서 버튼 개수 계산에 사용)
  "last":          false    ← 마지막 페이지 여부
}
```

> React에서 실제로 사용하는 필드: `content`, `totalPages`

---

## 5. Pagination.jsx — 공통 페이지 버튼 컴포넌트

```
src/components/common/Pagination.jsx
```

### props

| prop | 타입 | 설명 |
|------|------|------|
| `currentPage` | number | 현재 페이지 번호 (0부터, 서버 기준) |
| `totalPages` | number | 전체 페이지 수 |
| `onPageChange` | function | 페이지 버튼 클릭 시 호출 — `(pageNo) => void` |

### 핵심 코드 해설

```jsx
// totalPages가 1 이하면 버튼을 표시하지 않습니다.
if (totalPages <= 1) return null;

// [...Array(totalPages)].map((_, index) => ...)
// → 길이가 totalPages인 배열을 만들고 index(0, 1, 2...)로 순회합니다.
// → 서버의 pageNo(0부터)와 index가 일치합니다.
// → UI에는 index + 1 로 표시 (사람은 1페이지부터 읽으므로)
{[...Array(totalPages)].map((_, index) => (
    <button
        key={index}
        onClick={() => onPageChange(index)}
        className={currentPage === index ? '활성 스타일' : '기본 스타일'}
    >
        {index + 1}
    </button>
))}
```

### 이전 / 다음 버튼 비활성화 조건

```jsx
// 이전 버튼: 첫 페이지(0)이면 더 이상 이전이 없습니다.
disabled={currentPage === 0}

// 다음 버튼: 마지막 페이지이면 더 이상 다음이 없습니다.
disabled={currentPage === totalPages - 1}
```

---

## 6. EmpSection.jsx — 직원 페이징 상태 및 로직

### 페이징 상태 4개

```jsx
const [currentPage, setCurrentPage] = useState(0);     // 현재 페이지 (0부터)
const [totalPages,  setTotalPages]  = useState(1);     // 전체 페이지 수
const [sortBy,      setSortBy]      = useState('id');  // 정렬 컬럼
const [sortDir,     setSortDir]     = useState('asc'); // 정렬 방향
```

### useEffect 두 개의 역할 비교

```jsx
// [1] 마운트 시 딱 1번: EmpForm의 select 드롭다운용 부서 목록 로드
useEffect(() => {
    loadDepartments();
}, []);

// [2] 페이지·정렬이 바뀔 때마다: 직원 목록 재조회
useEffect(() => {
    if (withDept) return; // 직원+부서 전체 조회 모드이면 건너뜀
    loadEmployeesPage(currentPage);
}, [currentPage, sortBy, sortDir]);
```

### loadEmployeesPage 함수

```jsx
const loadEmployeesPage = async (pageNo = 0) => {
    setLoading(true);
    setWithDept(false);
    try {
        // getPage() 호출 — sortBy, sortDir은 컴포넌트 상태에서 읽습니다.
        const data = await employeeApi.getPage({ pageNo, pageSize: 5, sortBy, sortDir });
        setEmployees(data.content);     // ← 테이블에 표시할 데이터
        setTotalPages(data.totalPages); // ← 페이지 버튼 개수
    } catch (err) {
        showToast(err.message || '직원 목록 로드 실패', true);
    } finally {
        setLoading(false);
    }
};
```

### CRUD 후 페이지 처리

```jsx
// 생성/수정 후 → 1페이지(0)로 이동
// (이미 0페이지이면 useEffect가 재실행되지 않으므로 직접 호출)
if (currentPage === 0) {
    await loadEmployeesPage(0);
} else {
    setCurrentPage(0); // useEffect가 자동으로 loadEmployeesPage 호출
}

// 삭제 후 → 현재 페이지 새로고침 (페이지 이동 없이)
await loadEmployeesPage(currentPage);
```

### handlePageChange

```jsx
// Pagination 컴포넌트에서 버튼 클릭 시 호출됩니다.
// setCurrentPage()만 호출하면 useEffect가 알아서 API를 재호출합니다.
const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
};
```

---

## 7. EmpList.jsx — Pagination 컴포넌트 연결

### 변경된 props 목록

```jsx
// 기존 props (변경 없음)
employees, loading, withDept, onEdit, onDelete, onRefresh, onRefreshWithDept

// 새로 추가된 props
currentPage,   // 현재 페이지 (Pagination에 전달)
totalPages,    // 전체 페이지 수 (Pagination에 전달)
onPageChange,  // 페이지 클릭 핸들러 (Pagination에 전달)
```

### 테이블 아래 Pagination 렌더링

```jsx
{/*
    withDept=true(직원+부서 전체 조회)일 때는 페이징 숨김
    withDept=false(일반 페이징 조회)일 때만 페이징 표시
*/}
{!withDept && (
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
    />
)}
```

> `withDept=true` 모드는 `getAllWithDepartments()`로 전체 목록을 한 번에 가져오므로
> 페이징이 필요 없습니다.

---

## 8. DeptSection.jsx — 부서 페이징 특이사항

### allDepartments vs pagedDepts 분리

부서 섹션에는 **드롭다운(DeptSearch)** 과 **테이블(DeptList)** 이 함께 있습니다.

| 상태 | API | 사용처 |
|------|-----|--------|
| `allDepartments` | `getAll()` → 전체 목록 | DeptSearch의 select 드롭다운 |
| `pagedDepts` | `getPage()` → 현재 페이지 | DeptList의 테이블 |

```jsx
// 왜 두 개로 나눌까요?
// pagedDepts만 쓰면 현재 페이지에 있는 5개 부서만 드롭다운에 나타납니다.
// DeptSearch select에는 전체 부서가 모두 나와야 합니다.

const [allDepartments, setAllDepartments] = useState([]); // 드롭다운용
const [pagedDepts,     setPagedDepts]     = useState([]); // 테이블용
```

```jsx
// DeptSearch → allDepartments (전체 목록)
<DeptSearch departments={allDepartments} showToast={showToast} />

// DeptList → pagedDepts (현재 페이지만)
<DeptList departments={pagedDepts} ... />
```

---

## 9. 전체 데이터 흐름

```
[사용자: 페이지 2 버튼 클릭]
  │
  ▼
Pagination.jsx
  onPageChange(1)  ← index=1 (서버 기준 2페이지)
  │
  ▼
EmpSection.jsx
  handlePageChange(1) → setCurrentPage(1)
  │
  ▼
useEffect([currentPage, sortBy, sortDir]) 재실행
  │
  ▼
loadEmployeesPage(1)
  → employeeApi.getPage({ pageNo: 1, pageSize: 5, ... })
  → GET /api/employees/page?pageNo=1&pageSize=5&sortBy=id&sortDir=asc
  │
  ▼
서버 응답 { content: [...5개], totalPages: 5, ... }
  │
  ├─ setEmployees(data.content)   → EmpList 테이블 갱신
  └─ setTotalPages(data.totalPages) → Pagination 버튼 유지
  │
  ▼
[화면: 2페이지 직원 5명 표시, 2번 버튼 강조]
```

---

## 10. 컴포넌트 props 전달 구조

```
App.jsx
  └─ EmpSection.jsx  (페이징 상태 보관: currentPage, totalPages)
       ├─ EmpForm.jsx
       ├─ EmpSearch.jsx
       └─ EmpList.jsx  (props로 페이징 상태 수신)
            └─ Pagination.jsx  (props: currentPage, totalPages, onPageChange)

App.jsx
  └─ DeptSection.jsx  (페이징 상태 보관: currentPage, totalPages)
       ├─ DeptForm.jsx
       ├─ DeptSearch.jsx  (allDepartments 수신)
       └─ DeptList.jsx    (pagedDepts 수신)
            └─ Pagination.jsx
```

> **규칙**: 상태(state)는 항상 `Section` 컴포넌트에 있고, `List` 컴포넌트는 받은 props를 표시하기만 합니다.

---

## 11. 주의사항

| 항목 | 설명 |
|------|------|
| **pageNo는 0부터** | 서버와 React 모두 0부터 시작. UI에는 `index + 1`로 표시 |
| **useEffect 무한루프 주의** | `useEffect` 안에서 의존성 배열에 있는 상태를 바꾸면 무한 루프가 됩니다 |
| **이미 0페이지일 때 새로고침** | `setCurrentPage(0)`은 값이 안 바뀌므로 useEffect가 실행되지 않습니다. 이 경우 `loadEmployeesPage(0)` 직접 호출이 필요합니다 |
| **DeptSearch 드롭다운** | 페이징하면 드롭다운 옵션도 5개만 나옵니다. `allDepartments`(전체 목록)를 별도로 관리해야 합니다 |
| **withDept 모드** | "직원+부서 조회" 버튼은 전체를 한 번에 가져오므로 페이징 적용 대상이 아닙니다 |

---

## 12. 학습 포인트 요약

```
1. useState   → 페이지 번호·전체 페이지 수를 상태로 관리
2. useEffect  → 상태가 바뀌면 자동으로 API 재호출 (의존성 배열 핵심)
3. props      → Section이 가진 상태를 List → Pagination으로 내려줌
4. 조건부 렌더링 → {!withDept && <Pagination />}
```

```
상태 변경(setState) → useEffect 재실행 → API 호출 → setState → 화면 갱신
     ↑_______________________________________________|
                    (React의 자동 반응 사이클)
```
