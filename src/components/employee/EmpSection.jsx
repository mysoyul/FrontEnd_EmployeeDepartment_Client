/**
 * EmpSection — 직원 관리 섹션 컨테이너
 *
 * 역할:
 *   - 직원 목록 state 관리 (employees, loading, withDept)
 *   - 부서 목록 state 관리 (departments) — EmpForm select 옵션용
 *   - 수정 대상 state 관리 (editingEmp)
 *   - EmployeeApi / DepartmentApi 호출 후 결과를 자식 컴포넌트에 props로 전달
 */
import { useState, useEffect } from 'react';
import { EmployeeApi } from '../../api/employeeApi.js';
import { DepartmentApi } from '../../api/departmentApi.js';
import EmpForm from './EmpForm.jsx';
import EmpSearch from './EmpSearch.jsx';
import EmpList from './EmpList.jsx';

const employeeApi   = new EmployeeApi();
const departmentApi = new DepartmentApi();

export default function EmpSection({ showToast }) {
    const [employees, setEmployees]     = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading]         = useState(false);
    const [editingEmp, setEditingEmp]   = useState(null); // null = 등록 모드
    const [withDept, setWithDept]       = useState(false);

    useEffect(() => {
        loadDepartments();
        loadEmployees();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (err) {
            showToast(err.message || '부서 목록 로드 실패', true);
        }
    };

    const loadEmployees = async () => {
        setLoading(true);
        setWithDept(false);
        try {
            const data = await employeeApi.getAll();
            setEmployees(data);
        } catch (err) {
            showToast(err.message || '직원 목록 로드 실패', true);
        } finally {
            setLoading(false);
        }
    };

    const loadEmployeesWithDept = async () => {
        setLoading(true);
        setWithDept(true);
        try {
            const data = await employeeApi.getAllWithDepartments();
            setEmployees(data);
        } catch (err) {
            showToast(err.message || '직원+부서 목록 로드 실패', true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingEmp) {
                await employeeApi.update(editingEmp.id, formData);
                showToast('직원 정보가 수정되었습니다.');
            } else {
                await employeeApi.create(formData);
                showToast('직원이 생성되었습니다.');
            }
            setEditingEmp(null);
            await loadEmployees();
        } catch (err) {
            showToast(err.message || '저장 실패', true);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(`정말로 ID ${id} 직원을 삭제하시겠습니까?`)) return;
        try {
            await employeeApi.delete(id);
            showToast('직원이 삭제되었습니다.');
            await loadEmployees();
        } catch (err) {
            showToast(err.message || '삭제 실패', true);
        }
    };

    return (
        <>
            <EmpForm
                editingEmp={editingEmp}
                departments={departments}
                onSubmit={handleSubmit}
                onCancel={() => setEditingEmp(null)}
            />
            <EmpSearch showToast={showToast} />
            <EmpList
                employees={employees}
                loading={loading}
                withDept={withDept}
                onEdit={setEditingEmp}
                onDelete={handleDelete}
                onRefresh={loadEmployees}
                onRefreshWithDept={loadEmployeesWithDept}
            />
        </>
    );
}
