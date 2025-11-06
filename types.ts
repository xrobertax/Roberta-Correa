export enum TransactionType {
    Income = 'income',
    Expense = 'expense'
}

export interface Transaction {
    id: string;
    type: TransactionType;
    category: string;
    amount: number;
    currency: string;
    date: string; // ISO string
    description: string;
    source: string; // e.g., 'Salary - John', 'Checking Account'
}

export interface Investment {
    id: string;
    name: string;
    type: string; // e.g., 'Stocks', 'Real Estate', 'Crypto'
    initialValue: number;
    currentValue: number;
    currency: string;
    acquisitionDate: string; // ISO string
}

export enum View {
    Dashboard = 'Dashboard',
    Transactions = 'Transactions',
    Investments = 'Investments',
    Budgets = 'Budgets'
}

export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    currency: string;
}

export interface Notification {
    id: string;
    message: string;
    type: 'warning' | 'danger'; // warning for approaching, danger for exceeding
    date: string;
}