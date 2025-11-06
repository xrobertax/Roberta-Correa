import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Transaction, TransactionType } from '../types';
import { CURRENCIES, TRANSACTION_CATEGORIES } from '../constants';

interface AddTransactionModalProps {
    onClose: () => void;
    transactionToEdit?: Transaction | null;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, transactionToEdit }) => {
    const context = useContext(AppContext);
    const [type, setType] = useState<TransactionType>(TransactionType.Expense);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(TRANSACTION_CATEGORIES[TransactionType.Expense][0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [currency, setCurrency] = useState('BRL');
    const [source, setSource] = useState('');

    const isEditing = transactionToEdit != null;

    useEffect(() => {
        if (isEditing) {
            setType(transactionToEdit.type);
            setDescription(transactionToEdit.description);
            setAmount(String(transactionToEdit.amount));
            setCategory(transactionToEdit.category);
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
            setCurrency(transactionToEdit.currency);
            setSource(transactionToEdit.source);
        }
    }, [transactionToEdit, isEditing]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !category || !date || !source) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const transactionData = {
            type,
            description,
            amount: parseFloat(amount),
            category,
            date: new Date(date).toISOString(),
            currency,
            source
        };

        if (isEditing) {
            context?.updateTransaction({ ...transactionData, id: transactionToEdit.id });
        } else {
            context?.addTransaction(transactionData);
        }
        
        onClose();
    };
    
    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        // Só muda a categoria se não estiver editando ou se a categoria atual não existir no novo tipo
        if (!isEditing || !TRANSACTION_CATEGORIES[newType].includes(category)) {
             setCategory(TRANSACTION_CATEGORIES[newType][0]);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-text-primary mb-6">{isEditing ? 'Editar Transação' : 'Nova Transação'}</h2>
                
                <div className="flex border border-gray-200 rounded-lg p-1 mb-6">
                    <button 
                        onClick={() => handleTypeChange(TransactionType.Expense)}
                        className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === TransactionType.Expense ? 'bg-red-500 text-white' : 'hover:bg-red-100'}`}
                    >
                        Despesa
                    </button>
                    <button 
                        onClick={() => handleTypeChange(TransactionType.Income)}
                        className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${type === TransactionType.Income ? 'bg-secondary text-white' : 'hover:bg-green-100'}`}
                    >
                        Receita
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Descrição</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-text-secondary">Valor</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-text-secondary">Moeda</label>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-text-secondary">Categoria</label>
                             <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" required>
                                {TRANSACTION_CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Data</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">Fonte/Conta</label>
                        <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="Ex: Cartão de Crédito, Conta Corrente" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;