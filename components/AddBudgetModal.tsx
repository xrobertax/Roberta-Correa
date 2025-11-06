import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import { TransactionType } from '../types';
import { CURRENCIES, TRANSACTION_CATEGORIES } from '../constants';

interface AddBudgetModalProps {
    onClose: () => void;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ onClose }) => {
    const context = useContext(AppContext);
    const [category, setCategory] = useState(TRANSACTION_CATEGORIES[TransactionType.Expense][0]);
    const [limit, setLimit] = useState('');
    const [currency, setCurrency] = useState('BRL');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const existingBudget = context?.budgets.find(b => b.category === category);
        if (existingBudget) {
            alert(`Já existe um orçamento para a categoria "${category}".`);
            return;
        }

        if (!category || !limit) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        context?.addBudget({
            category,
            limit: parseFloat(limit),
            currency
        });
        onClose();
    };
    
    const availableCategories = TRANSACTION_CATEGORIES[TransactionType.Expense].filter(
        cat => !context?.budgets.some(b => b.category === cat)
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Orçamento Mensal</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-text-secondary">Categoria da Despesa</label>
                         <select 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" 
                            required
                         >
                            {availableCategories.length > 0 ? 
                                availableCategories.map(c => <option key={c} value={c}>{c}</option>) :
                                <option disabled>Todas as categorias já possuem orçamento</option>
                            }
                         </select>
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
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90" disabled={availableCategories.length === 0}>Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBudgetModal;
