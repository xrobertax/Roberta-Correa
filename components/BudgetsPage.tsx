import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../AppContext';
import { Budget, TransactionType } from '../types';
import AddBudgetModal from './AddBudgetModal';
import { TrashIcon, EditIcon } from './Icons';

const BudgetCard: React.FC<{ budget: Budget, onEdit: (budget: Budget) => void }> = ({ budget, onEdit }) => {
    const context = useContext(AppContext);
    
    const spent = useMemo(() => {
        if (!context) return 0;
        
        const { transactions, currentDate } = context;
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return transactions
            .filter(t => 
                t.type === TransactionType.Expense &&
                t.category === budget.category &&
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }, [context, budget.category]);

    if (!context) return null;

    const { deleteBudget } = context;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    
    let progressBarColor = 'bg-secondary';
    if (percentage >= 90 && percentage < 100) {
        progressBarColor = 'bg-yellow-500';
    } else if (percentage >= 100) {
        progressBarColor = 'bg-red-500';
    }
    
    const remaining = budget.limit - spent;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="bg-surface p-4 rounded-xl shadow-md flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-text-primary">{budget.category}</h3>
                    <p className="text-sm text-text-secondary">Orçamento Mensal</p>
                    {budget.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic truncate" title={budget.notes}>
                            {budget.notes}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onEdit(budget)}
                        className="text-gray-400 hover:text-primary"
                        aria-label={`Editar orçamento ${budget.category}`}
                    >
                        <EditIcon className="w-5 h-5"/>
                    </button>
                    <button 
                        onClick={() => deleteBudget(budget.id)} 
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Excluir orçamento ${budget.category}`}
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
            </div>

            <div className="text-sm flex justify-between">
                <span className="font-semibold text-text-primary">
                    {budget.currency} {formatCurrency(spent)}
                </span>
                <span className="text-text-secondary">
                    de {budget.currency} {formatCurrency(budget.limit)}
                </span>
            </div>

             <div className="text-sm text-center pt-2 border-t mt-2">
                {remaining >= 0 ? (
                    <p><span className="font-semibold text-text-primary">{budget.currency} {formatCurrency(remaining)}</span> restantes</p>
                ) : (
                     <p className="text-red-500 font-semibold">{budget.currency} {formatCurrency(Math.abs(remaining))} acima do limite</p>
                )}
            </div>
        </div>
    );
};

const BudgetsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

     const openEditModal = (budget: Budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingBudget(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };
    
    if (!context) return <div>Carregando...</div>;
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Orçamentos do Mês</h2>
                <button 
                    onClick={openAddModal}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    Adicionar Orçamento
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {context.budgets.map(budget => (
                    <BudgetCard key={budget.id} budget={budget} onEdit={openEditModal} />
                ))}
            </div>

            {isModalOpen && <AddBudgetModal onClose={closeModal} budgetToEdit={editingBudget} />}
        </div>
    );
};

export default BudgetsPage;