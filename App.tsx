import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Investment, View, User, Budget, Notification, TransactionType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import InvestmentsPage from './components/InvestmentsPage';
import BudgetsPage from './components/BudgetsPage';
import { mockTransactions, mockInvestments, mockBudgets } from './constants';
import { Header } from './components/Header';
import { AppContext } from './AppContext';
import Login from './components/Login';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Dashboard);
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
    const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('currentUser');
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        }
    }, []);

     useEffect(() => {
        const newNotifications: Notification[] = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        budgets.forEach(budget => {
            const spent = transactions
                .filter(t => 
                    t.type === TransactionType.Expense &&
                    t.category === budget.category &&
                    new Date(t.date).getMonth() === currentMonth &&
                    new Date(t.date).getFullYear() === currentYear
                )
                .reduce((sum, t) => sum + t.amount, 0);

            const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

            if (percentage >= 100) {
                newNotifications.push({
                    id: `notif-${budget.id}-danger`,
                    message: `Você ultrapassou seu orçamento de ${budget.category} em ${budget.currency} ${(spent - budget.limit).toFixed(2)}.`,
                    type: 'danger',
                    date: new Date().toISOString()
                });
            } else if (percentage >= 90) {
                newNotifications.push({
                    id: `notif-${budget.id}-warning`,
                    message: `Você já gastou ${percentage.toFixed(0)}% do seu orçamento de ${budget.category}.`,
                    type: 'warning',
                    date: new Date().toISOString()
                });
            }
        });
        setNotifications(newNotifications);
    }, [transactions, budgets]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
    };

    const addInvestment = (investment: Omit<Investment, 'id'>) => {
        setInvestments(prev => [...prev, { ...investment, id: Date.now().toString() }]);
    };
    
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        setBudgets(prev => [...prev, { ...budget, id: Date.now().toString() }]);
    };
    
    const deleteBudget = (budgetId: string) => {
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    };
    
    const dismissNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const contextValue = useMemo(() => ({
        transactions,
        investments,
        budgets,
        addTransaction,
        addInvestment,
        addBudget,
        deleteBudget
    }), [transactions, investments, budgets]);

    const renderView = () => {
        switch (view) {
            case View.Dashboard:
                return <Dashboard />;
            case View.Transactions:
                return <TransactionsPage />;
            case View.Investments:
                return <InvestmentsPage />;
            case View.Budgets:
                return <BudgetsPage />;
            default:
                return <Dashboard />;
        }
    };

    if (!currentUser) {
        return <Login onLoginSuccess={handleLogin} />;
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div className="flex h-screen bg-background text-text-primary">
                <Sidebar 
                    currentView={view} 
                    setView={setView} 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    user={currentUser}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header 
                        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                        currentView={view}
                        user={currentUser}
                        onLogout={handleLogout}
                        notifications={notifications}
                        dismissNotification={dismissNotification}
                    />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App;