import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../AppContext';
import { Transaction, TransactionType } from '../types';
import AddTransactionModal from './AddTransactionModal';
import { EditIcon } from './Icons';

const TransactionsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    if (!context) return <div>Carregando...</div>;

    const { currentDate, transactions } = context;

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const filteredTransactions = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
        })
        .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const categorySummary = useMemo(() => {
        if (!filteredTransactions.length) return [];
    
        const summary: Record<string, { income: number; expense: number; currency: string }> = {};
    
        filteredTransactions.forEach(t => {
            // Use category + currency as key to prevent summing different currencies
            const key = `${t.category}||${t.currency}`; 
            
            if (!summary[key]) {
                summary[key] = { income: 0, expense: 0, currency: t.currency };
            }
            
            if (t.type === TransactionType.Income) {
                summary[key].income += t.amount;
            } else {
                summary[key].expense += t.amount;
            }
        });
    
        return Object.entries(summary).map(([key, data]) => {
            const [category] = key.split('||');
            return {
                key,
                category,
                ...data,
            }
        }).sort((a,b) => a.category.localeCompare(b.category) || a.currency.localeCompare(b.currency));
    }, [filteredTransactions]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Transações do Mês</h2>
                <button
                    onClick={openAddModal}
                    className="bg-gradient-to-r from-primary to-indigo-500 text-white font-bold py-2 px-5 rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                >
                    Adicionar Transação
                </button>
            </div>

            <div className="bg-surface p-4 rounded-xl shadow-md">
                <input
                    type="text"
                    placeholder="Filtrar por descrição ou categoria..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    {filteredTransactions.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b">
                                <tr>
                                    <th className="p-3">Data</th>
                                    <th className="p-3">Descrição</th>
                                    <th className="p-3">Categoria</th>
                                    <th className="p-3">Fonte</th>
                                    <th className="p-3 text-right">Valor</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t: Transaction) => (
                                    <tr key={t.id} className="border-b last:border-0 hover:bg-primary/5 transition-colors duration-200">
                                        <td className="p-3 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-medium">{t.description}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="p-3 text-text-secondary">{t.source}</td>
                                        <td className={`p-3 text-right font-semibold ${t.type === TransactionType.Income ? 'text-secondary' : 'text-red-500'}`}>
                                            {t.type === TransactionType.Income ? '+' : '-'} {t.currency} {t.amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => openEditModal(t)} className="text-gray-500 hover:text-primary">
                                                <EditIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <p className="text-center text-text-secondary py-8">Nenhuma transação encontrada para este mês.</p>
                    )}
                </div>
            </div>
            
            {categorySummary.length > 0 && (
                <div className="bg-surface p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-text-primary mb-4">Resumo por Categoria no Mês</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide">Categoria</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-right">Total de Receitas</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-right">Total de Despesas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorySummary.map(item => (
                                    <tr key={item.key} className="border-b last:border-0 hover:bg-primary/5 transition-colors duration-200">
                                        <td className="p-3 font-semibold">{item.category}</td>
                                        <td className="p-3 text-right font-medium text-secondary">
                                            {item.currency} {item.income.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-right font-medium text-red-500">
                                            {item.currency} {item.expense.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && <AddTransactionModal onClose={closeModal} transactionToEdit={editingTransaction} />}
        </div>
    );
};

export default TransactionsPage;