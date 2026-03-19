/**
 * DeptSection — 부서 관리 섹션 컨테이너
 *
 * 역할:
 *   - 부서 목록 state 관리 (departments, loading)
 *   - 수정 대상 state 관리 (editingDept)
 *   - DepartmentApi 호출 후 결과를 자식 컴포넌트에 props로 전달
 */
import { useState, useEffect } from 'react';
import { DepartmentApi } from '../../api/departmentApi.js';
import DeptForm from './DeptForm.jsx';
import DeptSearch from './DeptSearch.jsx';
import DeptList from './DeptList.jsx';

const departmentApi = new DepartmentApi();

export default function DeptSection({ showToast }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingDept, setEditingDept] = useState(null); // null = 등록 모드

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (err) {
            showToast(err.message || '부서 목록 로드 실패', true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingDept) {
                await departmentApi.update(editingDept.id, formData);
                showToast('부서가 수정되었습니다.');
            } else {
                await departmentApi.create(formData);
                showToast('부서가 생성되었습니다.');
            }
            setEditingDept(null);
            await loadDepartments();
        } catch (err) {
            showToast(err.message || '저장 실패', true);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`정말로 ID ${id} 부서를 삭제하시겠습니까?`)) return;
        try {
            await departmentApi.delete(id);
            showToast('부서가 삭제되었습니다.');
            await loadDepartments();
        } catch (err) {
            showToast(err.message || '삭제 실패', true);
        }
    };

    return (
        <>
            <DeptForm
                editingDept={editingDept}
                onSubmit={handleSubmit}
                onCancel={() => setEditingDept(null)}
            />
            <DeptSearch departments={departments} showToast={showToast} />
            <DeptList
                departments={departments}
                loading={loading}
                onEdit={setEditingDept}
                onDelete={handleDelete}
                onRefresh={loadDepartments}
            />
        </>
    );
}
