import { createContext } from 'react';
import { Transaction, Investment, Budget } from './types';

interface AppContextType {
    transactions: Transaction[];
    investments: Investment[];
    budgets: Budget[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    addInvestment: (investment: Omit<Investment, 'id'>) => void;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    deleteBudget: (budgetId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);