import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';
import { CURRENCIES, INVESTMENT_TYPES } from '../constants';

interface AddInvestmentModalProps {
    onClose: () => void;
}

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ onClose }) => {
    const context = useContext(AppContext);
    const [name, setName] = useState('');
    const [type, setType] = useState(INVESTMENT_TYPES[0]);
    const [initialValue, setInitialValue] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [currency, setCurrency] = useState('BRL');
    const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !initialValue || !currentValue || !acquisitionDate) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        context?.addInvestment({
            name,
            type,
            initialValue: parseFloat(initialValue),
            currentValue: parseFloat(currentValue),
            currency,
            acquisitionDate: new Date(acquisitionDate).toISOString(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Novo Investimento</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Nome do Ativo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Ações Apple, Apartamento SP" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                     <div>
                         <label className="block text-sm font-medium text-text-secondary">Tipo de Investimento</label>
                         <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white" required>
                            {INVESTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-text-secondary">Valor Inicial</label>
                            <input type="number" value={initialValue} onChange={e => setInitialValue(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-text-secondary">Valor Atual</label>
                            <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-text-secondary">Moeda</label>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Data de Aquisição</label>
                            <input type="date" value={acquisitionDate} onChange={e => setAcquisitionDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
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

export default AddInvestmentModal;