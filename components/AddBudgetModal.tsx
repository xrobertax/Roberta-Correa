import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Budget, TransactionType } from '../types';
import { CURRENCIES, TRANSACTION_CATEGORIES } from '../constants';

interface AddBudgetModalProps {
    onClose: () => void;
    budgetToEdit?: Budget | null;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ onClose, budgetToEdit }) => {
    const context = useContext(AppContext);
    const [category, setCategory] = useState(TRANSACTION_CATEGORIES[TransactionType.Expense][0]);
    const [limit, setLimit] = useState('');
    const [currency, setCurrency] = useState('BRL');
    const [notes, setNotes] = useState('');

    const isEditing = budgetToEdit != null;

    useEffect(() => {
        if (isEditing) {
            setCategory(budgetToEdit.category);
            setLimit(String(budgetToEdit.limit));
            setCurrency(budgetToEdit.currency);
            setNotes(budgetToEdit.notes || '');
        }
    }, [isEditing, budgetToEdit]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isEditing) {
            const existingBudget = context?.budgets.find(b => b.category === category);
            if (existingBudget) {
                alert(`Já existe um orçamento para a categoria "${category}".`);
                return;
            }
        }

        if (!category || !limit) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const budgetData = {
            category,
            limit: parseFloat(limit),
            currency,
            notes
        };

        if (isEditing) {
            context?.updateBudget({ ...budgetData, id: budgetToEdit.id });
        } else {
            context?.addBudget(budgetData);
        }
        
        onClose();
    };
    
    const availableCategories = TRANSACTION_CATEGORIES[TransactionType.Expense].filter(
        cat => !context?.budgets.some(b => b.category === cat)
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-text-primary mb-6">{isEditing ? 'Editar Orçamento' : 'Novo Orçamento Mensal'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-text-secondary">Categoria da Despesa</label>
                         <select 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white disabled:bg-gray-100" 
                            required
                            disabled={isEditing}
                         >
                            {isEditing ? (
                                <option value={category}>{category}</option>
                            ) : (
                                availableCategories.length > 0 ? 
                                    availableCategories.map(c => <option key={c} value={c}>{c}</option>) :
                                    <option disabled>Todas as categorias já possuem orçamento</option>
                            )}
                         </select>
                         {isEditing && <p className="text-xs text-gray-500 mt-1">A categoria não pode ser alterada. Para isso, exclua e crie um novo orçamento.</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Observação (Opcional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Ex: Mensalidade escolar, cursos, material..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-text-secondary">Limite ({currency})</label>
                            <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-text-secondary">Moeda</label>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90" disabled={!isEditing && availableCategories.length === 0}>Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBudgetModal;