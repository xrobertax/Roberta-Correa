import React, { useState, useEffect } from 'react';
import { login, register } from '../auth';
import { User, Account, AccountType } from '../types';

interface LoginProps {
    onLoginSuccess: (data: { user: User; account: Account }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    // Form fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<AccountType>(AccountType.Personal);
    const [accountName, setAccountName] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    
    const [error, setError] = useState('');
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setUsername(rememberedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = login(username, password);
        if (result) {
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            onLoginSuccess(result);
        } else {
            setError('Usuário ou senha inválidos.');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (accountType === AccountType.Shared && !accountName) {
            setError('Por favor, dê um nome para a conta compartilhada.');
            return;
        }

        const result = register(name, username, accountType, accountName);
        
        if (typeof result === 'string') {
            setError(result);
        } else {
            // After successful registration, log the user in with the mock password
            const loginResult = login(username, 'password123');
            if (loginResult) {
                onLoginSuccess(loginResult);
            } else {
                setError('Ocorreu um erro ao fazer login após o registro.')
            }
        }
    };
    
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        // Reset all fields
        setError('');
        setName('');
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        setUsername(rememberedUsername || '');
        setPassword('');
        setConfirmPassword('');
        setAccountType(AccountType.Personal);
        setAccountName('');
    };

    const RecoveryModal = () => (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsRecoveryModalOpen(false)}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-text-primary mb-4">Recuperação de Conta</h2>
                <p className="text-sm text-text-secondary mb-4">
                    Como esta é uma aplicação de demonstração, a recuperação de senha não está habilitada. Você pode usar as seguintes credenciais para acessar a conta de teste:
                </p>
                <div className="text-left bg-gray-100 p-3 rounded-lg text-sm space-y-2">
                    <p><b>Usuário 1:</b> john.doe</p>
                    <p><b>Usuário 2:</b> jane.doe</p>
                    <p><b>Senha (para ambos):</b> password123</p>
                </div>
                <button 
                    onClick={() => setIsRecoveryModalOpen(false)}
                    className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90"
                >
                    Entendi
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
            {isRecoveryModalOpen && <RecoveryModal />}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold text-center text-primary">FinanceApp</h1>
                    <p className="mt-2 text-center text-sm text-text-secondary">
                        {isLoginView ? 'Acesse sua conta' : 'Crie uma nova conta'}
                    </p>
                </div>

                {isLoginView ? (
                    <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input id="username-login" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Usuário (ex: john.doe)" />
                            </div>
                            <div>
                                <input id="password-login" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Senha (ex: password123)" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                                    Lembrar-me
                                </label>
                            </div>
                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => setIsRecoveryModalOpen(true)}
                                    className="font-medium text-primary hover:text-primary/80"
                                >
                                    Esqueceu seu usuário ou senha?
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Entrar
                            </button>
                        </div>
                    </form>
                ) : (
                     <form className="mt-8 space-y-4" onSubmit={handleRegisterSubmit}>
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-medium text-text-secondary">Tipo de Conta</label>
                                <div className="flex border border-gray-200 rounded-lg p-1 mt-1">
                                    <button type="button" onClick={() => setAccountType(AccountType.Personal)}
                                        className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-colors ${accountType === AccountType.Personal ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                                        Pessoal
                                    </button>
                                     <button type="button" onClick={() => setAccountType(AccountType.Shared)}
                                        className={`w-1/2 p-2 rounded-md font-semibold text-sm transition-colors ${accountType === AccountType.Shared ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                                        Compartilhada
                                    </button>
                                </div>
                            </div>
                            {accountType === AccountType.Shared && (
                                <div>
                                    <label htmlFor="account-name-register" className="sr-only">Nome da Conta</label>
                                    <input id="account-name-register" name="accountName" type="text" required value={accountName} onChange={(e) => setAccountName(e.target.value)}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="Nome da Conta (ex: Família Silva)" />
                                </div>
                            )}
                            <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Seu Nome Completo" />
                             <input name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Nome de Usuário" />
                            <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Senha" />
                             <input name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Confirmar Senha" />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}
                        <div className="pt-2">
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Cadastrar
                            </button>
                        </div>
                    </form>
                )}

                <p className="mt-2 text-center text-sm text-text-secondary">
                    {isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
                    <button onClick={toggleView} className="font-medium text-primary hover:text-primary/80 ml-1">
                        {isLoginView ? "Cadastre-se" : "Faça o login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;