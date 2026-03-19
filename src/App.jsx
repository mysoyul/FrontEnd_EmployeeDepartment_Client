import { useState } from 'react';
import Toast from './components/common/Toast.jsx';
import DeptSection from './components/department/DeptSection.jsx';
import EmpSection from './components/employee/EmpSection.jsx';

export default function App() {
    const [activeTab, setActiveTab] = useState('dept');
    const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

    const showToast = (message, isError = false) => {
        setToast({ message, type: isError ? 'error' : 'success', visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const tabClass = (tab) =>
        `tab-button px-6 py-3 font-semibold text-slate-400 border-b-4 border-transparent -mb-0.5
         hover:bg-slate-50 hover:text-slate-600 transition-all duration-300
         ${activeTab === tab ? 'active' : ''}`;

    return (
        <div className="bg-slate-100 text-slate-700 min-h-screen p-5">
            <Toast {...toast} />

            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Employee &amp; Department Manager
                    </h1>
                </header>

                {/* 탭 메뉴 */}
                <nav className="flex border-b-2 border-slate-200 mb-8">
                    <button className={tabClass('dept')} onClick={() => setActiveTab('dept')}>
                        부서 관리 (Department)
                    </button>
                    <button className={tabClass('emp')} onClick={() => setActiveTab('emp')}>
                        직원 관리 (Employee)
                    </button>
                </nav>

                {/* 섹션 — activeTab state로 조건부 렌더링 */}
                {activeTab === 'dept' && <DeptSection showToast={showToast} />}
                {activeTab === 'emp'  && <EmpSection  showToast={showToast} />}
            </div>
        </div>
    );
}
