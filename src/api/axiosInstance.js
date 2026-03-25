/**
 * axiosInstance.js — 공통 axios 인스턴스
 *
 * ─── 왜 axios 인스턴스를 만들까요? ───────────────────────────────────
 *  axios를 그냥 사용하면 모든 요청마다 baseURL, 헤더를 반복해서 써야 합니다.
 *  axios.create()로 인스턴스를 만들면 공통 설정을 한 번만 정의합니다.
 *
 * ─── 인터셉터(Interceptor)란? ─────────────────────────────────────────
 *  모든 요청/응답을 가로채서 공통 처리를 추가하는 기능입니다.
 *  여기서는 응답 에러 인터셉터를 사용합니다.
 *
 *  서버가 에러 응답(4xx, 5xx)을 보낼 때:
 *    axios 기본 동작 : err.message = "Request failed with status code 404"
 *    인터셉터 적용 후: err.message = 서버가 보낸 메시지 (예: "직원을 찾을 수 없습니다")
 *
 *  → 컴포넌트에서 showToast(err.message, true)를 호출하면
 *    서버의 실제 에러 메시지가 그대로 표시됩니다.
 */
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',           // 모든 요청의 기본 URL
    headers: { 'Content-Type': 'application/json' }, // POST/PUT 공통 헤더
});

// ── 응답 에러 인터셉터 ────────────────────────────────────────────────
// 성공(2xx) 응답은 그대로 통과시키고,
// 에러(4xx, 5xx) 응답은 서버 메시지로 err.message를 교체합니다.
axiosInstance.interceptors.response.use(
    // 성공 응답: 그대로 반환
    response => response,

    // 에러 응답: 서버 메시지로 err.message를 교체한 뒤 다시 throw
    error => {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
            error.message = serverMessage; // 컴포넌트에서 err.message로 사용
        }
        return Promise.reject(error); // error.response.status는 그대로 유지
    }
);

export default axiosInstance;
