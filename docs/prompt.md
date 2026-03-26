* @PRD_Employee_Department_Client.md 를 분석하여 "8. 구현 우선순위" 에서 첫번째로 "P1-1 (필수) 부서 CRUD 전체" html과 css 파일만 작성해 주세요.

* @PRD_Employee_Department_Client.md 를 분석하여 "8. 구현 우선순위" 에서 첫번째로 "P1-1 (필수) 부서 CRUD 전체" Javascript 파일을 작성해 주세요.


* @PRD_Employee_Department_Client.md 를 분석하여 "8. 구현 우선순위" 에서 두번째로 "P1-2 (필수) 직원 CRUD 전체" html과 css 파일만 수정해 주세요.

* @PRD_Employee_Department_Client.md 를 분석하여 "8. 구현 우선순위" 에서 첫번째로 "P1-2 (필수) 직원 CRUD 전체" Javascript 파일을 작성해 주세요.


* @index.html에서 직원등록 할때 부서의 ID가 아니라 부서이름 목록을 <select> 태그로 출력하면 부서이름을 선택하고 value는 부서Id값 유지하도록 수정해 주세요.

* @index.html의 <select id="emp-dept-id" required> 하위에 동적으로 생성되는 <option>엘리먼트의 스타일을 기존 필드들의 스타일과 비슷하게 수정해 주세요.

* @index.html의 직원등록 부서선택을 스타일을 수정한 이후에 모든 input 필드의 스타일이 <select> 엘리먼트로 보여집니다. Input 엘리먼트의 스타일과 Select의 스타일을 구분해서 다시 변경해 주세요

* @index.html의 부서조회(ID)에서 <input type="number" id="search-dept-id">도 <select>로 변경해주세요.
####
* @PRD_Employee_Department_Client_ECMA.md 를 분석하여 "10.구현 우선순위" 에서 첫번째로 "P1-1 utils.js 공통 모듈 구현"을 작성해 주세요. 이해하기 쉽도록 주석을 잘 추가해주세요.

* js/utils.js에 대하여 정리해 준 주요 내용을 js\util.md 정리해서 작성해 줘


* @PRD_Employee_Department_Client_ECMA.md 를 분석하여 "10.구현 우선순위" 에서 첫번째로 "P1-2 departmentApi.js 클래스 구현 + 부서 CRUD 전체"을 작성해 주세요. 이해하기 쉽도록 주석을 잘 추가하고 구현후에 내용을 정리한 departmentApi.md 문서도 작성해 줘. departmentApi.js를 클래스로 구현하면 초보자에게 어려우니까 쉬운 버전의 departmentApi를 먼저 작성하고 두번째 버전으로 클래스 형태의 departmentApi를 작성해 주세요.

* @index.html 이 departmentApi.js(버전 1)를 호출해서 ajax통신을 하고 싶어요

* js/dept_runner_v1.js 작업 결과 요약한 내용을 dept_runner_v1.md로 자세하게 작성해 줘

* @PRD_Employee_Department_Client_ECMA.md 를 분석하여 "10.구현 우선순위" 에서 첫번째로 "P1-3 employeeApi.js 클래스 구현 + 직원 CRUD 전체 + 이메일 조회"를 작성해 주세요. 이해하기 쉽도록 주석을 잘 추가하고 구현후에 내용을 정리한 employeeApi.md 문서도 작성해  
  줘. employeeApi.js를 클래스로 구현하면 초보자에게 어려우니까 쉬운(함수) 버전의 employeeApi를 먼저 작성하고 두번째 버전으로 클래스 버전의 employeeApi를 작성해 주세요.

* @index.html 에서 employeeApi.js(버전 1)를 호출해서 ajax통신을 하고 싶어요

*   js/emp_runner_v1.js 작업 결과 요약한 내용을 emp_runner_v1.md로 자세하게 작성해 줘

*   departmentApi.js 와 employeeApi.js의 클래스 형태인(버전2)를 호출하는 dept_runner_v2.js 와 emp_runner_v2.js를 작성해 줘 . 설명하는 runner.md 파일도 같이 작성해 줘. 그리고 index.html 에도 runner_v2 를 호출하도록 수정해 줘. v1 호출하는 부분은 주석으로  처리해 주세요.

* 현재 작성된 html / css / ecmascript로 작성한 js를 Vite(https://vite.dev/) Build 도구를 사용하여 작성하고 싶어요. 현재의 폴더에 Vite 프로젝트를 만들어서 정리해 주세요. Vite 기반으로 프로젝트로 변경하고 난 이후에 달라진 점들을 markdown으로 작성해 주세요.

* Css 스타일을 개선하고 싶어요. TailwindCSS(https://tailwindcss.com/) 를 적용하여 스타일을 개선해 주세요. 기존의 CSS와 tailwindcss 적용했을 때를 비교해서 markdown으로 작성해 주세요.

* @ui_error/dept_table_btn_bad.png와 @ui_error/emp_table_btn_bad.png 스크린 샷을 확인하고 스타일을 변경해 줘

* 수정된 스타일을 TAILWIND_MIGRATION.md 문서에 업데이트 해주세요.

* 부서조회(ID) 조회할 부서를 선택하세요. <select><option></option></select> 동적으로 렌더링이 되지 않습니다. 

* 직원관리목록에서 수정버튼을 클릭하면 FirstName,LastName,Email 필드의 값은 수정 Form으로 전달이 되지만 부서Id와 일치하는 부서(<select><option></option></select>)가 선택되어 있지 않습니다. 

* 직원 조회 (ID로 조회 또는 이메일로 조회) 에서 예를 들어 ID 1번으로 조회 후 결과가 나온 후에  이메일로 조회 필드에 포커스를 주면 ID 조회 입력필드가 1로 되어 있는 부분을 1이 아니라 초기 상태로 되도록 수정해야 할것 같습니다. 

* 현재 프로젝트를 Vite 기반 ECMAScript로 작성하는 ReactJS 프로젝트로 변경하고 싶어요. PRD_Employee_Department_Client_React_v3_Level1.md 문서를 생성하고 사용하지 않는 js 파일들은 src/org_js 폴더에 정리하고 싶어요 삭제하지는 마세요. 저는 ReactJS를 처음 사용합니다. 이해하기 쉽도록 작성해 주세요.

* ECMAScript 프로젝트를 쉬운 버전의 ReactJS 프로젝트로 변환한 내용을 정리해서 markdown 문서로 작성해 주세요.

* 저는 React 초보자입니다. 현재 프로젝트에 페이징 처리기능과 상태관리 라이브러리(Zustand)를 추가하고 싶어요. 어떤 기능을 먼저 추가하는 것이 더 이해하기 쉬울까요?

* 저는 React 초보자입니다. @docs/paging.md 기반으로 페이징 기능을 구현해주세요. 서버는 준비된 상태입니다. 

* 저는 React 초보자입니다. 추가한 React 페이징 기능을 docs/React_Paging.md 문서로 작성해 주세요. 

* 직원+부서 조회(부서명 출력)에는 페이징 기능이 포함되어 있지 않습니다. 백엔드 SpringBoot를 먼저 수정해야 하나요?

* 직원+부서 조회(부서명 출력)에는 페이징 기능이 포함되어 있지 않습니다. 백엔드 SpringBoot를 먼저 수정해야 하나요?

* 'A. 프론트엔드 클라이언트 조인' 난이도 쉬운 방법으로 구현해 줘

* @docs/React_Paging.md 문서에도 변경된 내용을 갱신해 줘 특히 핵심코드 (옵셔널 체이닝과 Null 병합)에 대하여 쉽게 설명해 줘

* 저는 React 초보자입니다. Zustand 적용을 진행해 주세요.

* Zustand를 적용한 정리해서 docs 아래에 markdown 문서로 작성해 주세요. Zustand 튜토리얼 문서도 md로 작성해 주세요.

* 현재 React 프로젝트에 React Router를 적용하여 구현하고 싶어요. docs 아래에 React Router에 대한 markdown 문서를 작성해 주세요. Router를 적용에 구현 문서와 React Router 튜토리얼로 나누어서 문서를 작성해 주세요.

* fetch() 함수 대신 axios 라이브러리를 사용하여 코드를 수정해 주세요. 수정후 에 axios 대한 markdown 문서를 작성해 주세요.

* @src/api/axiosinstance.js 의 interceptor 에 대한 내용을 @docs/Axios_Tutorial.md 문서에 추가적인 설명을 포함하고, axiosinstance.js 코드에도 추가 설명을 포함해 주세요. 저는 interceptor를 처음 사용하는 개발자입니다. 

* .env.development 파일과 .env.production 파일을 작성하여 개발과 운영환경을 위한 설정파일을 작성해 주세요.

* VITE_APP_ENV

* @React_Router_Tutorial.md 문서에 replace: true — 히스토리 교체 내용을 좀 더 쉽게 갱신해 주세요.

* @Axios_Tutorial.md 에 Promise 객체에 대한 기초적인 설명도 interceptor 전에 추가해 주세요.