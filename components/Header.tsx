import React, { useState } from 'react';
import { MenuIcon, BellIcon, CloseIcon } from './Icons';
import { View, User, Notification } from '../types';

interface HeaderProps {
    toggleSidebar: () => void;
    currentView: View;
    user: User | null;
    onLogout: () => void;
    notifications: Notification[];
    dismissNotification: (id: string) => void;
}

const NotificationPanel: React.FC<{ notifications: Notification[], dismissNotification: (id: string) => void, onClose: () => void }> = ({ notifications, dismissNotification, onClose }) => {
    return (
        <div className="absolute top-16 right-4 w-80 bg-surface rounded-lg shadow-xl border z-50">
            <div className="p-3 border-b flex justify-between items-center">
                <h4 className="font-semibold">Notificações</h4>
                <button onClick={onClose}><CloseIcon className="w-4 h-4 text-text-secondary"/></button>
            </div>
            {notifications.length === 0 ? (
                <p className="p-4 text-center text-text-secondary text-sm">Nenhuma notificação nova.</p>
            ) : (
                <ul className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                        <li key={n.id} className={`p-3 border-b text-sm ${n.type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                            <div className="flex justify-between items-start">
                                <p className="flex-1">{n.message}</p>
                                <button onClick={() => dismissNotification(n.id)} className="ml-2 text-text-secondary hover:text-text-primary">&times;</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentView, user, onLogout, notifications, dismissNotification }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const viewTitles: Record<View, string> = {
        [View.Dashboard]: "Painel Geral",
        [View.Transactions]: "Minhas Transações",
        [View.Investments]: "Meus Investimentos",
        [View.Budgets]: "Meus Orçamentos"
    }

    return (
        <header className="flex items-center justify-between p-4 bg-surface shadow-sm flex-shrink-0 z-10">
            <div className="flex items-center">
                 <button onClick={toggleSidebar} className="md:hidden mr-4 text-text-secondary hover:text-primary">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-text-primary">{viewTitles[currentView]}</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="text-text-secondary hover:text-primary relative">
                        <BellIcon className="w-6 h-6" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{notifications.length}</span>
                            </span>
                        )}
                    </button>
                    {showNotifications && <NotificationPanel notifications={notifications} dismissNotification={dismissNotification} onClose={() => setShowNotifications(false)}/>}
                </div>
                 <button
                    onClick={onLogout}
                    className="bg-gray-200 text-text-secondary font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                    Sair
                </button>
            </div>
        </header>
    );
};