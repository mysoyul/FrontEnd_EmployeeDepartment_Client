/**
 * EmpSection.jsx — 직원 관리 섹션 (컨테이너 컴포넌트)
 *
 * ─── 이 컴포넌트가 하는 일 ────────────────────────────────────────────
 *  직원 관련 모든 데이터와 API 호출을 한 곳에서 관리하고,
 *  EmpForm, EmpSearch, EmpList에 props로 나눠줍니다.
 *
 * ─── 페이징 추가 후 달라진 점 ─────────────────────────────────────────
 *  기존: loadEmployees() → employeeApi.getAll() → 전체 목록
 *  변경: loadEmployeesPage(pageNo) → employeeApi.getPage() → 현재 페이지 데이터만
 *
 * ─── 페이징 상태 설계 (paging.md 8-1 참고) ───────────────────────────
 *  currentPage : 현재 페이지 번호 (서버 기준 0부터 시작)
 *  totalPages  : 전체 페이지 수 (서버 응답의 totalPages)
 *  sortBy      : 정렬 기준 컬럼 (예: 'id', 'firstName')
 *  sortDir     : 정렬 방향 ('asc' 또는 'desc')
 *
 * ─── useEffect 의존성 배열 (paging.md 8-2 참고) ──────────────────────
 *  useEffect(() => { ... }, [currentPage, sortBy, sortDir])
 *  → currentPage, sortBy, sortDir 중 하나라도 바뀌면 자동으로 목록을 다시 불러옵니다.
 *
 * ─── props ────────────────────────────────────────────────────────────
 *  showToast: App.jsx에서 전달받은 알림 함수
 */
import { useState, useEffect } from 'react';
import { EmployeeApi }   from '../../api/employeeApi.js';
import { DepartmentApi } from '../../api/departmentApi.js';
import EmpForm   from './EmpForm.jsx';
import EmpSearch from './EmpSearch.jsx';
import EmpList   from './EmpList.jsx';

const employeeApi   = new EmployeeApi();
const departmentApi = new DepartmentApi();

export default function EmpSection({ showToast }) {

    // ── 기본 상태 ─────────────────────────────────────────────────────
    const [employees,   setEmployees]   = useState([]);
    const [departments, setDepartments] = useState([]);  // EmpForm select용
    const [loading,     setLoading]     = useState(false);
    const [editingEmp,  setEditingEmp]  = useState(null);
    const [withDept,    setWithDept]    = useState(false);

    // ── 페이징 상태 (paging.md 8-1) ───────────────────────────────────
    const [currentPage, setCurrentPage] = useState(0);    // 현재 페이지 (0부터)
    const [totalPages,  setTotalPages]  = useState(1);    // 전체 페이지 수
    const [sortBy,      setSortBy]      = useState('id'); // 정렬 컬럼
    const [sortDir,     setSortDir]     = useState('asc'); // 정렬 방향

    // ── 마운트 시: 부서 목록(폼용) 1회 로드 ──────────────────────────
    useEffect(() => {
        loadDepartments();
    }, []);

    // ── 페이지·정렬 변경 시: 직원 목록 자동 재조회 (paging.md 8-2) ──
    // currentPage, sortBy, sortDir 중 하나라도 바뀌면 이 effect가 실행됩니다.
    // withDept 모드(직원+부서 전체 조회)일 때는 건너뜁니다.
    useEffect(() => {
        if (withDept) return;
        loadEmployeesPage(currentPage);
    }, [currentPage, sortBy, sortDir]);

    // ── 부서 목록 로드 (EmpForm의 select 옵션용) ──────────────────────
    const loadDepartments = async () => {
        try {
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (err) {
            showToast(err.message || '부서 목록 로드 실패', true);
        }
    };

    // ── 페이징 직원 목록 로드 ─────────────────────────────────────────
    // pageNo를 인자로 받아서 직접 사용합니다.
    // (sortBy, sortDir은 컴포넌트 상태에서 읽습니다)
    const loadEmployeesPage = async (pageNo = 0) => {
        setLoading(true);
        setWithDept(false);
        try {
            // paging.md 8-2: getPage() 호출, 응답에서 content와 totalPages를 꺼냅니다.
            const data = await employeeApi.getPage({ pageNo, pageSize: 5, sortBy, sortDir });
            setEmployees(data.content);     // 현재 페이지의 직원 목록
            setTotalPages(data.totalPages); // 전체 페이지 수
        } catch (err) {
            showToast(err.message || '직원 목록 로드 실패', true);
        } finally {
            setLoading(false);
        }
    };

    // ── 직원 + 부서 통합 목록 로드 (페이징 없음) ─────────────────────
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

    // ── 페이지 변경 핸들러 (paging.md 8-3) ───────────────────────────
    // Pagination 컴포넌트에서 버튼 클릭 시 호출됩니다.
    // setCurrentPage()가 실행되면 위의 useEffect가 자동으로 반응합니다.
    const handlePageChange = (pageNo) => {
        setCurrentPage(pageNo);
    };

    // ── 직원 생성/수정 처리 ───────────────────────────────────────────
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
            // 생성/수정 후에는 1페이지(0)로 돌아갑니다.
            // 이미 0페이지라면 직접 호출, 아니면 setCurrentPage(0)이 useEffect를 트리거합니다.
            if (currentPage === 0) {
                await loadEmployeesPage(0);
            } else {
                setCurrentPage(0);
            }
        } catch (err) {
            showToast(err.message || '저장 실패', true);
        }
    };

    // ── 직원 삭제 처리 ────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm(`정말로 ID ${id} 직원을 삭제하시겠습니까?`)) return;
        try {
            await employeeApi.delete(id);
            showToast('직원이 삭제되었습니다.');
            // 삭제 후 현재 페이지를 다시 불러옵니다.
            await loadEmployeesPage(currentPage);
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
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onEdit={setEditingEmp}
                onDelete={handleDelete}
                onRefresh={() => loadEmployeesPage(currentPage)}
                onRefreshWithDept={loadEmployeesWithDept}
            />
        </>
    );
}
