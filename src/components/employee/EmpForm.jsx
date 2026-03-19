/**
 * EmpForm — 직원 생성/수정 폼
 *
 * props:
 *   editingEmp   {object|null}  null = 생성 모드, object = 수정 모드
 *   departments  {Array}        부서 select 옵션용
 *   onSubmit     {function}     { firstName, lastName, email, departmentId }
 *   onCancel     {function}     수정 취소
 */
import { useState, useEffect } from 'react';

const inputClass =
    'w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm bg-white ' +
    'focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';

export default function EmpForm({ editingEmp, departments, onSubmit, onCancel }) {
    const [firstName,    setFirstName]    = useState('');
    const [lastName,     setLastName]     = useState('');
    const [email,        setEmail]        = useState('');
    const [departmentId, setDepartmentId] = useState('');

    // 수정 대상이 바뀔 때 폼 필드를 동기화합니다.
    useEffect(() => {
        if (editingEmp) {
            setFirstName(editingEmp.firstName ?? '');
            setLastName(editingEmp.lastName  ?? '');
            setEmail(editingEmp.email        ?? '');
            // 일반 목록: { departmentId: 2 }
            // 직원+부서 조회 목록: { departmentDto: { id: 2 } }
            const deptId = editingEmp.departmentId ?? editingEmp.departmentDto?.id;
            setDepartmentId(String(deptId ?? ''));
        } else {
            setFirstName(''); setLastName(''); setEmail(''); setDepartmentId('');
        }
    }, [editingEmp]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            firstName:    firstName.trim(),
            lastName:     lastName.trim(),
            email:        email.trim(),
            departmentId,
        });
    };

    return (
        <div className="card border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-700 border-l-4 border-blue-400 pl-3 mb-5">
                {editingEmp ? '직원 수정' : '직원 등록'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 flex-wrap mb-4">
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">이름 (First Name)</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="예: John"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">성 (Last Name)</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="예: Doe"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap mb-4">
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="예: john.doe@example.com"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div className="flex-1 min-w-48">
                        <label className="block mb-1.5 font-semibold text-sm text-slate-500">부서</label>
                        <select
                            value={departmentId}
                            onChange={e => setDepartmentId(e.target.value)}
                            required
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="">부서를 선택하세요...</option>
                            {departments.map(d => (
                                <option key={d.id} value={String(d.id)}>
                                    {d.departmentName} (ID: {d.id})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingEmp ? '수정 저장' : '직원 생성'}
                </button>
                {editingEmp && (
                    <button type="button" onClick={onCancel} className="btn btn-info ml-2">
                        취소
                    </button>
                )}
            </form>
        </div>
    );
}
