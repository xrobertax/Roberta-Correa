import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Investment, View, User, Budget, Notification, TransactionType, Account } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import InvestmentsPage from './components/InvestmentsPage';
import BudgetsPage from './components/BudgetsPage';
import ReportsPage from './components/ReportsPage';
import { Header } from './components/Header';
import { AppContext } from './AppContext';
import Login from './components/Login';
import { getFinancialData, updateFinancialData } from './auth';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.Dashboard);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Load user from session on initial render
    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('currentUser');
        const loggedInAccount = sessionStorage.getItem('currentAccount');
        if (loggedInUser && loggedInAccount) {
            const user = JSON.parse(loggedInUser);
            const account = JSON.parse(loggedInAccount);
            setCurrentUser(user);
            setCurrentAccount(account);
            
            // Load financial data for the logged-in account
            const data = getFinancialData(account.id);
            setTransactions(data.transactions);
            setInvestments(data.investments);
            setBudgets(data.budgets);
        }
    }, []);

    // Update financial data in our mock backend whenever it changes
    useEffect(() => {
        if (currentAccount) {
            updateFinancialData(currentAccount.id, { transactions, investments, budgets });
        }
    }, [transactions, investments, budgets, currentAccount]);


     useEffect(() => {
        const newNotifications: Notification[] = [];
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

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
    }, [transactions, budgets, currentDate]);

    const handleLogin = ({ user, account }: { user: User; account: Account }) => {
        setCurrentUser(user);
        setCurrentAccount(account);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('currentAccount', JSON.stringify(account));
        
        // Load data for the new account
        const data = getFinancialData(account.id);
        setTransactions(data.transactions);
        setInvestments(data.investments);
        setBudgets(data.budgets);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentAccount(null);
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentAccount');
        // Clear data
        setTransactions([]);
        setInvestments([]);
        setBudgets([]);
    };

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString() }]);
    };
    
    const updateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    const addInvestment = (investment: Omit<Investment, 'id'>) => {
        setInvestments(prev => [...prev, { ...investment, id: Date.now().toString() }]);
    };
    
    const updateInvestment = (updatedInvestment: Investment) => {
        setInvestments(prev => prev.map(i => i.id === updatedInvestment.id ? updatedInvestment : i));
    };
    
    const addBudget = (budget: Omit<Budget, 'id'>) => {
        setBudgets(prev => [...prev, { ...budget, id: Date.now().toString() }]);
    };

    const updateBudget = (updatedBudget: Budget) => {
        setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
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
        updateTransaction,
        addInvestment,
        updateInvestment,
        addBudget,
        updateBudget,
        deleteBudget,
        currentDate,
        setCurrentDate,
    }), [transactions, investments, budgets, currentDate]);

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
            case View.Reports:
                return <ReportsPage />;
            default:
                return <Dashboard />;
        }
    };

    if (!currentUser || !currentAccount) {
        return <Login onLoginSuccess={handleLogin} />;
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div className="flex h-screen bg-gradient-to-br from-background to-gray-100 text-text-primary">
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
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
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