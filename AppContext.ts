import { createContext } from 'react';
import { Transaction, Investment, Budget } from './types';

interface AppContextType {
    transactions: Transaction[];
    investments: Investment[];
    budgets: Budget[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (transaction: Transaction) => void;
    addInvestment: (investment: Omit<Investment, 'id'>) => void;
    updateInvestment: (investment: Investment) => void;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (budget: Budget) => void;
    deleteBudget: (budgetId: string) => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);