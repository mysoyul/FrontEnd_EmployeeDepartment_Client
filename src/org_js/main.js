/**
 * @file src/main.js
 * @description
 * Vite 프로젝트의 단일 엔트리 포인트(진입점)입니다.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  기존(v2.0) index.html 의 <script> 태그 2개를              │
 * │  이 파일 하나로 통합합니다.                                 │
 * │                                                             │
 * │  기존:                                                      │
 * │    <link rel="stylesheet" href="css/style.css">             │
 * │    <script type="module" src="js/dept_runner_v2.js">        │
 * │    <script type="module" src="js/emp_runner_v2.js">         │
 * │                                                             │
 * │  Vite 방식:                                                 │
 * │    <script type="module" src="/src/main.js">   ← 이 파일   │
 * │    (CSS import, JS import 모두 이 파일에서 처리)            │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Vite가 이 파일을 읽어서:
 *   1. CSS → <style> 태그로 주입 (개발) / 별도 .css 파일로 추출 (빌드)
 *   2. JS  → 번들링 및 트리쉐이킹(tree-shaking) 처리
 */

// ──────────────────────────────────────────────────────────────
// CSS import
// Vite는 JS에서 CSS를 import 할 수 있습니다.
// - 개발 서버: <style> 태그로 동적 주입 (HMR 지원)
// - 프로덕션 빌드: 별도의 .css 파일로 추출
// ──────────────────────────────────────────────────────────────
import './style.css';

// ──────────────────────────────────────────────────────────────
// 부서 관리 모듈
// - DepartmentApi 클래스 인스턴스 생성
// - DOMContentLoaded 이벤트에 초기화 등록
// - 페이지 로드 시 부서 목록 자동 조회
// ──────────────────────────────────────────────────────────────
import './js/dept_runner_v2.js';

// ──────────────────────────────────────────────────────────────
// 직원 관리 모듈
// - EmployeeApi, DepartmentApi 클래스 인스턴스 생성
// - window.initEmployeeTab 전역 등록
//   → index.html의 showTab('emp-section') 클릭 시 호출됩니다.
// ──────────────────────────────────────────────────────────────
import './js/emp_runner_v2.js';
