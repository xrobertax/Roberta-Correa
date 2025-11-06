
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { Transaction, TransactionType } from '../types';
import AddTransactionModal from './AddTransactionModal';

const TransactionsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('');

    if (!context) return <div>Carregando...</div>;

    const filteredTransactions = context.transactions
        .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()) || t.category.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Todas as Transações</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
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
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr>
                                <th className="p-3">Data</th>
                                <th className="p-3">Descrição</th>
                                <th className="p-3">Categoria</th>
                                <th className="p-3">Fonte</th>
                                <th className="p-3 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t: Transaction) => (
                                <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TransactionsPage;
