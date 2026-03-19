/**
 * Toast — 우상단 알림 메시지 컴포넌트
 *
 * v2의 utils.js showMessage() + index.html #alert-success / #alert-error 를 대체합니다.
 * CSS .alert / .alert.show 슬라이드 애니메이션은 src/style.css에서 그대로 사용합니다.
 *
 * props:
 *   message  {string}  표시할 메시지
 *   type     {string}  'success' | 'error'
 *   visible  {boolean} show 클래스 토글
 */
export default function Toast({ message, type, visible }) {
    const colorClass = type === 'error' ? 'bg-red-500' : 'bg-emerald-500';

    return (
        <div className="fixed top-5 right-5 z-50 w-72">
            <div className={`alert rounded-lg px-5 py-4 text-white shadow-lg ${colorClass} ${visible ? 'show' : ''}`}>
                {message}
            </div>
        </div>
    );
}
