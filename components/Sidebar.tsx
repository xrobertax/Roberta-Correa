import React from 'react';
import { View, User } from '../types';
import { DashboardIcon, TransactionsIcon, InvestmentsIcon, CloseIcon, BudgetIcon, ReportsIcon } from './Icons';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    user: User | null;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <li
            onClick={onClick}
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
        >
            {icon}
            <span className="ml-4 font-semibold">{label}</span>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isSidebarOpen, setSidebarOpen, user }) => {
    
    const handleNavigation = (view: View) => {
        setView(view);
        if (window.innerWidth < 768) { // md breakpoint
            setSidebarOpen(false);
        }
    }

    const navItems = [
        { view: View.Dashboard, icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
        { view: View.Transactions, icon: <TransactionsIcon className="w-6 h-6" />, label: 'Transações' },
        { view: View.Investments, icon: <InvestmentsIcon className="w-6 h-6" />, label: 'Investimentos' },
        { view: View.Budgets, icon: <BudgetIcon className="w-6 h-6" />, label: 'Orçamentos' },
        { view: View.Reports, icon: <ReportsIcon className="w-6 h-6" />, label: 'Relatórios' },
    ];

    return (
       <>
            <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`absolute md:relative flex flex-col flex-shrink-0 w-64 h-full bg-surface shadow-md z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div>
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-primary">FinanceApp</h1>
                         <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-text-secondary hover:text-primary">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="p-4">
                        <ul>
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.view}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={currentView === item.view}
                                    onClick={() => handleNavigation(item.view)}
                                />
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center">
                        <img src={user?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                             <p className="font-semibold text-text-primary">{user?.name}</p>
                             <p className="text-sm text-text-secondary">{user?.username}</p>
                        </div>
                    </div>
                </div>
            </aside>
       </>
    );
};

export default Sidebar;