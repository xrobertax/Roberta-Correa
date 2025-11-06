import { Transaction, Investment, TransactionType, Budget } from './types';

export const mockTransactions: Transaction[] = [
    { id: '1', type: TransactionType.Income, category: 'Salary', amount: 5000, currency: 'BRL', date: new Date(new Date().setDate(1)).toISOString(), description: 'John monthly salary', source: 'Company A' },
    { id: '2', type: TransactionType.Income, category: 'Freelance', amount: 1200, currency: 'USD', date: new Date(new Date().setDate(5)).toISOString(), description: 'Jane design project', source: 'Client B' },
    { id: '3', type: TransactionType.Expense, category: 'Groceries', amount: 450, currency: 'BRL', date: new Date(new Date().setDate(3)).toISOString(), description: 'Weekly groceries', source: 'Credit Card' },
    { id: '4', type: TransactionType.Expense, category: 'Rent', amount: 1500, currency: 'BRL', date: new Date(new Date().setDate(5)).toISOString(), description: 'Apartment rent', source: 'Checking Account' },
    { id: '5', type: TransactionType.Expense, category: 'Utilities', amount: 250, currency: 'BRL', date: new Date(new Date().setDate(10)).toISOString(), description: 'Electricity and Internet', source: 'Checking Account' },
    { id: '6', type: TransactionType.Expense, category: 'Entertainment', amount: 150, currency: 'BRL', date: new Date(new Date().setDate(12)).toISOString(), description: 'Movie tickets', source: 'Credit Card' },
    { id: '7', type: TransactionType.Expense, category: 'Transport', amount: 100, currency: 'BRL', date: new Date(new Date().setDate(15)).toISOString(), description: 'Gasoline', source: 'Debit Card' },
    { id: '8', type: TransactionType.Income, category: 'Dividends', amount: 300, currency: 'USD', date: new Date(new Date().setDate(18)).toISOString(), description: 'Stock dividends', source: 'Brokerage Account' },
    { id: '9', type: TransactionType.Expense, category: 'Dining Out', amount: 200, currency: 'BRL', date: new Date(new Date().setDate(20)).toISOString(), description: 'Family dinner', source: 'Credit Card' },
];

export const mockInvestments: Investment[] = [
    { id: '1', name: 'AAPL Stock', type: 'Stocks', initialValue: 10000, currentValue: 15000, currency: 'USD', acquisitionDate: '2022-01-15T00:00:00.000Z' },
    { id: '2', name: 'São Paulo Apartment', type: 'Real Estate', initialValue: 500000, currentValue: 550000, currency: 'BRL', acquisitionDate: '2020-05-20T00:00:00.000Z' },
    { id: '3', name: 'Bitcoin', type: 'Crypto', initialValue: 5000, currentValue: 8500, currency: 'USD', acquisitionDate: '2023-03-10T00:00:00.000Z' },
    { id: '4', name: 'Tesouro Selic', type: 'Fixed Income', initialValue: 20000, currentValue: 22500, currency: 'BRL', acquisitionDate: '2023-01-01T00:00:00.000Z' },
];

export const mockBudgets: Budget[] = [
    { id: '1', category: 'Groceries', limit: 500, currency: 'BRL' },
    { id: '2', category: 'Entertainment', limit: 120, currency: 'BRL' },
    { id: '3', category: 'Dining Out', limit: 300, currency: 'BRL' },
    { id: '4', category: 'Transport', limit: 250, currency: 'BRL' },
]

export const CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP', 'JPY'];
export const TRANSACTION_CATEGORIES = {
    [TransactionType.Income]: ['Salary', 'Freelance', 'Dividends', 'Rental Income', 'Gift', 'Other'],
    [TransactionType.Expense]: ['Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Education', 'Travel', 'Other']
};
export const INVESTMENT_TYPES = ['Stocks', 'Real Estate', 'Crypto', 'Fixed Income', 'Mutual Fund', 'Other'];