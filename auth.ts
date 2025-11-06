import { User, Account, AccountType, FinancialData, Transaction, Investment, Budget } from './types';
import { mockTransactions, mockInvestments, mockBudgets } from './constants';

const DOE_FAMILY_ACCOUNT_ID = 'acc_doe_family';

// --- MOCK DATABASE ---

let MOCK_USERS: User[] = [
    { id: 'user1', name: 'John Doe', username: 'john.doe', avatar: 'https://picsum.photos/seed/john/40/40', accountId: DOE_FAMILY_ACCOUNT_ID },
    { id: 'user2', name: 'Jane Doe', username: 'jane.doe', avatar: 'https://picsum.photos/seed/jane/40/40', accountId: DOE_FAMILY_ACCOUNT_ID }
];

let MOCK_ACCOUNTS: Account[] = [
    { id: DOE_FAMILY_ACCOUNT_ID, name: 'Família Doe', type: AccountType.Shared, userIds: ['user1', 'user2'] }
];

// Data is now keyed by accountId
let MOCK_FINANCIAL_DATA: Record<string, FinancialData> = {
    [DOE_FAMILY_ACCOUNT_ID]: {
        transactions: mockTransactions,
        investments: mockInvestments,
        budgets: mockBudgets
    }
};

// --- API FUNCTIONS ---

export const login = (username: string, password: string): { user: User; account: Account } | null => {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user && password === 'password123') {
        const account = MOCK_ACCOUNTS.find(a => a.id === user.accountId);
        if (account) {
            return { user, account };
        }
    }
    return null;
};

export const register = (name: string, username: string, accountType: AccountType, accountName?: string): { user: User; account: Account } | string => {
    if (MOCK_USERS.find(u => u.username === username)) {
        return "Este nome de usuário já está em uso.";
    }

    // Create new Account
    const newAccountId = `acc_${Date.now()}`;
    const newAccount: Account = {
        id: newAccountId,
        name: accountType === AccountType.Shared ? accountName || `${name}'s Account` : `${name}'s Account`,
        type: accountType,
        userIds: []
    };
    
    // Create new User
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
        id: newUserId,
        name,
        username,
        avatar: `https://picsum.photos/seed/${username}/40/40`,
        accountId: newAccountId
    };

    // Update state
    newAccount.userIds.push(newUserId);
    MOCK_ACCOUNTS.push(newAccount);
    MOCK_USERS.push(newUser);
    
    // Initialize empty financial data for the new account
    MOCK_FINANCIAL_DATA[newAccountId] = {
        transactions: [],
        investments: [],
        budgets: []
    };

    return { user: newUser, account: newAccount };
};


export const getFinancialData = (accountId: string): FinancialData => {
    return MOCK_FINANCIAL_DATA[accountId] || { transactions: [], investments: [], budgets: [] };
};

export const updateFinancialData = (accountId: string, data: FinancialData) => {
    MOCK_FINANCIAL_DATA[accountId] = data;
};
