/**
 * departmentApi.js — 부서(Department) API 통신
 *
 * axios → fetch 변경 내용은 employeeApi.js 주석 참고
 * 동일한 패턴으로 변경되었습니다.
 *   checkResponse 추가 / response.json() 직접 호출 / URLSearchParams 사용
 */
import { BASE_URL, checkResponse } from './fetchClient.js';

export class DepartmentApi {
    #base = `${BASE_URL}/api/departments`;

    // 전체 부서 목록 조회 — GET /api/departments
    async getAll() {
        const response = await fetch(this.#base);
        await checkResponse(response);
        return response.json();
    }

    // ID로 부서 단건 조회 — GET /api/departments/{id}
    // 404이면 null 반환, 그 외 에러는 checkResponse에서 throw
    async getById(id) {
        const response = await fetch(`${this.#base}/${id}`);
        if (response.status === 404) return null;
        await checkResponse(response);
        return response.json();
    }

    // 부서 생성 — POST /api/departments
    async create(departmentData) {
        const response = await fetch(this.#base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentData),
        });
        await checkResponse(response);
        return response.json();
    }

    // 부서 수정 — PUT /api/departments/{id}
    async update(id, departmentData) {
        const response = await fetch(`${this.#base}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentData),
        });
        await checkResponse(response);
        return response.json();
    }

    // 페이징 부서 목록 조회 — GET /api/departments/page
    async getPage({ pageNo = 0, pageSize = 5, sortBy = 'id', sortDir = 'asc' } = {}) {
        const params = new URLSearchParams({ pageNo, pageSize, sortBy, sortDir });
        const response = await fetch(`${this.#base}/page?${params}`);
        await checkResponse(response);
        return response.json();
        // 응답 구조: { content, pageNo, pageSize, totalElements, totalPages, last }
    }

    // 부서 삭제 — DELETE /api/departments/{id}
    async delete(id) {
        const response = await fetch(`${this.#base}/${id}`, { method: 'DELETE' });
        await checkResponse(response);
        return true;
    }
}
