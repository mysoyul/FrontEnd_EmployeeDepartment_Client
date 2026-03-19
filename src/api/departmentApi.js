/**
 * @file departmentApi.js
 * @description 부서(Department) API 통신 클래스
 *
 * v2(src/js/api/departmentApi.js)에서 이동.
 * DOM을 직접 조작하는 handleApiError 의존성을 제거하고,
 * 에러를 throw하여 컴포넌트의 try-catch가 처리합니다.
 */

const checkResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData?.message ?? `HTTP error! status: ${response.status}`);
    }
    return response;
};

export class DepartmentApi {
    #baseUrl = 'http://localhost:8080/api/departments';

    async getAll() {
        const response = await fetch(this.#baseUrl);
        await checkResponse(response);
        return response.json();
    }

    async getById(id) {
        const response = await fetch(`${this.#baseUrl}/${id}`);
        if (response.status === 404) return null;
        await checkResponse(response);
        return response.json();
    }

    async create(data) {
        const response = await fetch(this.#baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        await checkResponse(response);
        return response.json();
    }

    async update(id, data) {
        const response = await fetch(`${this.#baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        await checkResponse(response);
        return response.json();
    }

    async delete(id) {
        const response = await fetch(`${this.#baseUrl}/${id}`, { method: 'DELETE' });
        await checkResponse(response);
        return true;
    }
}
