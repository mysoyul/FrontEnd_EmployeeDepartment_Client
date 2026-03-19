/**
 * DeptList — 전체 부서 목록 테이블
 *
 * props:
 *   departments  {Array}     부서 배열
 *   loading      {boolean}   로딩 중 여부
 *   onEdit       {function}  수정 버튼 클릭 → editingDept 설정
 *   onDelete     {function}  삭제 버튼 클릭
 *   onRefresh    {function}  새로고침 버튼 클릭
 */
export default function DeptList({ departments, loading, onEdit, onDelete, onRefresh }) {
    return (
        <div className="card border border-slate-200 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3">
                    전체 부서 목록
                </h3>
                <button onClick={onRefresh} className="btn btn-info">새로고침</button>
            </div>

            {loading && (
                <div className="text-center text-blue-500 font-bold my-5">데이터를 불러오는 중...</div>
            )}

            <table className="w-full border-collapse mt-3">
                <thead>
                    <tr className="bg-slate-50">
                        <th className="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">ID</th>
                        <th className="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">부서명</th>
                        <th className="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">부서 설명</th>
                        <th className="text-left px-4 py-3 text-slate-600 font-semibold text-sm border-b border-slate-200">작업</th>
                    </tr>
                </thead>
                <tbody>
                    {!loading && departments.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-4 py-3 text-center text-slate-400">
                                부서 데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        departments.map(dept => (
                            <tr key={dept.id}>
                                <td>{dept.id}</td>
                                <td>{dept.departmentName}</td>
                                <td>{dept.departmentDescription}</td>
                                <td>
                                    <div className="actions">
                                        <button
                                            onClick={() => onEdit(dept)}
                                            className="btn btn-warning btn-sm"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => onDelete(dept.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
