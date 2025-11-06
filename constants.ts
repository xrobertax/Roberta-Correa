import { Transaction, Investment, TransactionType, Budget } from './types';

// Helper para obter datas em meses diferentes
const getDateInMonth = (monthOffset: number, day: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    date.setDate(day);
    return date.toISOString();
}


export const mockTransactions: Transaction[] = [
    // Transações do Mês Atual
    { id: '1', type: TransactionType.Income, category: 'Salary', amount: 5000, currency: 'BRL', date: getDateInMonth(0, 1), description: 'John monthly salary', source: 'Company A' },
    { id: '2', type: TransactionType.Income, category: 'Freelance', amount: 1200, currency: 'USD', date: getDateInMonth(0, 5), description: 'Jane design project', source: 'Client B' },
    { id: '3', type: TransactionType.Expense, category: 'Groceries', amount: 450, currency: 'BRL', date: getDateInMonth(0, 3), description: 'Weekly groceries', source: 'Credit Card' },
    { id: '4', type: TransactionType.Expense, category: 'Rent', amount: 1500, currency: 'BRL', date: getDateInMonth(0, 5), description: 'Apartment rent', source: 'Checking Account' },
    { id: '5', type: TransactionType.Expense, category: 'Utilities', amount: 250, currency: 'BRL', date: getDateInMonth(0, 10), description: 'Electricity and Internet', source: 'Checking Account' },
    { id: '6', type: TransactionType.Expense, category: 'Entertainment', amount: 150, currency: 'BRL', date: getDateInMonth(0, 12), description: 'Movie tickets', source: 'Credit Card' },
    { id: '7', type: TransactionType.Expense, category: 'Transport', amount: 100, currency: 'BRL', date: getDateInMonth(0, 15), description: 'Gasoline', source: 'Debit Card' },
    { id: '8', type: TransactionType.Income, category: 'Dividends', amount: 300, currency: 'USD', date: getDateInMonth(0, 18), description: 'Stock dividends', source: 'Brokerage Account' },
    { id: '9', type: TransactionType.Expense, category: 'Dining Out', amount: 200, currency: 'BRL', date: getDateInMonth(0, 20), description: 'Family dinner', source: 'Credit Card' },
    
    // Transações do Mês Passado
    { id: '10', type: TransactionType.Income, category: 'Salary', amount: 5000, currency: 'BRL', date: getDateInMonth(-1, 1), description: 'John monthly salary', source: 'Company A' },
    { id: '11', type: TransactionType.Expense, category: 'Groceries', amount: 520, currency: 'BRL', date: getDateInMonth(-1, 4), description: 'Weekly groceries', source: 'Credit Card' },
    { id: '12', type: TransactionType.Expense, category: 'Rent', amount: 1500, currency: 'BRL', date: getDateInMonth(-1, 5), description: 'Apartment rent', source: 'Checking Account' },
    { id: '13', type: TransactionType.Expense, category: 'Travel', amount: 800, currency: 'EUR', date: getDateInMonth(-1, 15), description: 'Weekend trip', source: 'Credit Card' },
    { id: '14', type: TransactionType.Expense, category: 'Dining Out', amount: 250, currency: 'BRL', date: getDateInMonth(-1, 22), description: 'Anniversary dinner', source: 'Credit Card' },

    // Transações de 2 Meses Atrás
    { id: '15', type: TransactionType.Income, category: 'Salary', amount: 4800, currency: 'BRL', date: getDateInMonth(-2, 1), description: 'John monthly salary', source: 'Company A' },
    { id: '16', type: TransactionType.Expense, category: 'Groceries', amount: 480, currency: 'BRL', date: getDateInMonth(-2, 3), description: 'Weekly groceries', source: 'Credit Card' },
    { id: '17', type: TransactionType.Expense, category: 'Health', amount: 300, currency: 'BRL', date: getDateInMonth(-2, 18), description: 'Pharmacy', source: 'Debit Card' },
];

export const mockInvestments: Investment[] = [
    { id: '1', name: 'AAPL Stock', type: 'Stocks', initialValue: 10000, currentValue: 15000, currency: 'USD', acquisitionDate: '2022-01-15T00:00:00.000Z' },
    { id: '2', name: 'São Paulo Apartment', type: 'Real Estate', initialValue: 500000, currentValue: 550000, currency: 'BRL', acquisitionDate: '2020-05-20T00:00:00.000Z' },
    { id: '3', name: 'Bitcoin', type: 'Crypto', initialValue: 5000, currentValue: 8500, currency: 'USD', acquisitionDate: '2023-03-10T00:00:00.000Z' },
    { id: '4', name: 'Tesouro Selic', type: 'Fixed Income', initialValue: 20000, currentValue: 22500, currency: 'BRL', acquisitionDate: '2023-01-01T00:00:00.000Z' },
];

export const mockBudgets: Budget[] = [
    { id: '1', category: 'Groceries', limit: 500, currency: 'BRL', notes: 'Compras da semana no supermercado.' },
    { id: '2', category: 'Entertainment', limit: 200, currency: 'BRL', notes: 'Streaming, cinema e passeios.' },
    { id: '3', category: 'Dining Out', limit: 300, currency: 'BRL', notes: 'Restaurantes e lanches nos fins de semana.' },
    { id: '4', category: 'Transport', limit: 250, currency: 'BRL', notes: 'Gasolina e eventuais corridas de app.' },
]

export const CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP', 'JPY'];
export const TRANSACTION_CATEGORIES = {
    [TransactionType.Income]: ['Salary', 'Freelance', 'Dividends', 'Rental Income', 'Gift', 'Other'],
    [TransactionType.Expense]: ['Groceries', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Education', 'Travel', 'Other']
};
export const INVESTMENT_TYPES = ['Stocks', 'Real Estate', 'Crypto', 'Fixed Income', 'Mutual Fund', 'Other'];