/**
 * DeptSearch — 부서 단건 조회 (select 드롭다운)
 *
 * props:
 *   departments  {Array}     부서 목록 (select 옵션 생성용)
 *   showToast    {function}  오류 알림
 */
import { useState } from 'react';
import { DepartmentApi } from '../../api/departmentApi.js';

const departmentApi = new DepartmentApi();

export default function DeptSearch({ departments, showToast }) {
    const [selectedId, setSelectedId] = useState('');
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        if (!selectedId) {
            showToast('조회할 부서를 선택하세요.', true);
            return;
        }
        try {
            const dept = await departmentApi.getById(selectedId);
            if (!dept) {
                showToast('해당 부서가 존재하지 않습니다.', true);
                setResult(null);
                return;
            }
            setResult(dept);
        } catch (err) {
            showToast(err.message || '조회 실패', true);
        }
    };

    return (
        <div className="card border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">
                부서 조회 (ID)
            </h3>
            <div className="flex gap-4 flex-wrap items-end">
                <select
                    value={selectedId}
                    onChange={e => { setSelectedId(e.target.value); setResult(null); }}
                    className="flex-1 min-w-48 px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white
                               focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                               transition-all appearance-none"
                >
                    <option value="">조회할 부서를 선택하세요...</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.departmentName}</option>
                    ))}
                </select>
                <button onClick={handleSearch} className="btn btn-success">조회</button>
            </div>

            {result && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 leading-7">
                    <p><strong>ID:</strong> {result.id}</p>
                    <p><strong>부서명:</strong> {result.departmentName}</p>
                    <p><strong>설명:</strong> {result.departmentDescription}</p>
                </div>
            )}
        </div>
    );
}
