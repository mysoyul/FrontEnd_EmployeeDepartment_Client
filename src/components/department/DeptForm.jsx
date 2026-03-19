/**
 * DeptForm — 부서 생성/수정 폼
 *
 * props:
 *   editingDept  {object|null}  null = 생성 모드, object = 수정 모드
 *   onSubmit     {function}     { departmentName, departmentDescription }
 *   onCancel     {function}     수정 취소
 */
import { useState, useEffect } from 'react';

const inputClass =
    'w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white ' +
    'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';

export default function DeptForm({ editingDept, onSubmit, onCancel }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    // 수정 대상이 바뀔 때 폼 필드를 동기화합니다.
    useEffect(() => {
        if (editingDept) {
            setName(editingDept.departmentName ?? '');
            setDesc(editingDept.departmentDescription ?? '');
        } else {
            setName('');
            setDesc('');
        }
    }, [editingDept]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ departmentName: name.trim(), departmentDescription: desc.trim() });
    };

    return (
        <div className="card border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">
                {editingDept ? '부서 수정' : '부서 등록'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 flex-wrap mb-4">
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">부서명</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="예: HR"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">부서 설명</label>
                        <input
                            type="text"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="부서에 대한 설명을 입력하세요"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingDept ? '수정 저장' : '부서 생성'}
                </button>
                {editingDept && (
                    <button type="button" onClick={onCancel} className="btn btn-info ml-2">
                        취소
                    </button>
                )}
            </form>
        </div>
    );
}
