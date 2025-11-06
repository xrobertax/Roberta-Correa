import { User } from './types';

export const MOCK_USERS: User[] = [
    {
        id: 'user1',
        name: 'John Doe',
        username: 'john.doe',
        avatar: 'https://picsum.photos/seed/john/40/40'
    },
    {
        id: 'user2',
        name: 'Jane Doe',
        username: 'jane.doe',
        avatar: 'https://picsum.photos/seed/jane/40/40'
    }
];

// In a real app, this would be a call to a backend service.
// Here, we simulate it with a hardcoded password.
export const login = (username: string, password: string): User | null => {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user && password === 'password123') {
        return user;
    }
    return null;
};
