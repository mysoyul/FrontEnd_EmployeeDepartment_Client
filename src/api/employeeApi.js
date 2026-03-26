/**
 * employeeApi.js — 직원(Employee) API 통신
 *
 * ─── axios → fetch 변경 후 달라진 점 ─────────────────────────────────
 *
 *  1. checkResponse() 함수 추가
 *     fetch는 4xx/5xx 응답도 성공으로 처리합니다.
 *     checkResponse()로 수동으로 확인하고 에러를 throw합니다.
 *
 *  2. response.data → response.json()
 *     fetch는 응답 본문을 자동으로 파싱하지 않습니다.
 *     .json()을 직접 호출해야 JavaScript 객체로 변환됩니다.
 *
 *  3. POST/PUT 요청에 headers + JSON.stringify 직접 설정
 *     fetch는 객체를 자동으로 JSON으로 변환하지 않습니다.
 *     headers: { 'Content-Type': 'application/json' }
 *     body: JSON.stringify(data)  를 직접 작성해야 합니다.
 *
 *  4. 쿼리 파라미터: params 옵션 → URLSearchParams
 *     fetch에는 params 옵션이 없습니다.
 *     URLSearchParams로 쿼리 문자열을 만들어 URL에 직접 붙입니다.
 *
 *  5. 404 처리: catch → response.status 직접 확인
 *     fetch는 404를 에러로 throw하지 않습니다.
 *     checkResponse() 호출 전에 response.status === 404를 먼저 확인합니다.
 */
import { BASE_URL, checkResponse } from './fetchClient.js';

export class EmployeeApi {
    #base = `${BASE_URL}/api/employees`;

    // 전체 직원 목록 조회 — GET /api/employees
    async getAll() {
        const response = await fetch(this.#base);
        await checkResponse(response);
        return response.json();
    }

    // 직원 + 부서 정보 함께 조회 — GET /api/employees/departments
    async getAllWithDepartments() {
        const response = await fetch(`${this.#base}/departments`);
        await checkResponse(response);
        return response.json();
    }

    // ID로 직원 단건 조회 — GET /api/employees/{id}
    // 404이면 null 반환, 그 외 에러는 checkResponse에서 throw
    async getById(id) {
        const response = await fetch(`${this.#base}/${id}`);
        if (response.status === 404) return null;
        await checkResponse(response);
        return response.json();
    }

    // 이메일로 직원 조회 — GET /api/employees/email/{email}
    async getByEmail(email) {
        const response = await fetch(`${this.#base}/email/${email}`);
        if (response.status === 404) return null;
        await checkResponse(response);
        return response.json();
    }

    // 직원 생성 — POST /api/employees
    async create(employeeData) {
        const response = await fetch(this.#base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData),
        });
        await checkResponse(response);
        return response.json();
    }

    // 직원 수정 — PUT /api/employees/{id}
    async update(id, employeeData) {
        const response = await fetch(`${this.#base}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData),
        });
        await checkResponse(response);
        return response.json();
    }

    // 페이징 직원 목록 조회 — GET /api/employees/page
    // URLSearchParams: ?pageNo=0&pageSize=5&sortBy=id&sortDir=asc 쿼리 문자열 생성
    async getPage({ pageNo = 0, pageSize = 5, sortBy = 'id', sortDir = 'asc' } = {}) {
        const params = new URLSearchParams({ pageNo, pageSize, sortBy, sortDir });
        const response = await fetch(`${this.#base}/page?${params}`);
        await checkResponse(response);
        return response.json();
        // 응답 구조: { content, pageNo, pageSize, totalElements, totalPages, last }
    }

    // 직원 삭제 — DELETE /api/employees/{id}
    async delete(id) {
        const response = await fetch(`${this.#base}/${id}`, { method: 'DELETE' });
        await checkResponse(response);
        return true;
    }
}
