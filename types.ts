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
    Budgets = 'Budgets',
    Reports = 'Reports'
}

export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    accountId: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    currency: string;
    notes?: string;
}

export interface Notification {
    id: string;
    message: string;
    type: 'warning' | 'danger'; // warning for approaching, danger for exceeding
    date: string;
}

export enum AccountType {
    Personal = 'personal',
    Shared = 'shared'
}

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    userIds: string[];
}

export interface FinancialData {
    transactions: Transaction[];
    investments: Investment[];
    budgets: Budget[];
}