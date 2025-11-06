import React, { useState } from 'react';
import { login } from '../auth';
import { User } from '../types';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = login(username, password);
        if (user) {
            onLoginSuccess(user);
        } else {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold text-center text-primary">FinanceApp</h1>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        Acesse sua conta compartilhada
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Usuário</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Usuário (ex: john.doe)"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-login" className="sr-only">Senha</label>
                            <input
                                id="password-login"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Senha (ex: password123)"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
                 <div className="text-center text-xs text-gray-500">
                    <p><b>Usuários de teste:</b></p>
                    <p>john.doe / password123</p>
                    <p>jane.doe / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
