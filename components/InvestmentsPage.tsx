import React, { useContext, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../AppContext';
import { Investment } from '../types';
import AddInvestmentModal from './AddInvestmentModal';
import { EditIcon } from './Icons';

const InvestmentCard: React.FC<{ investment: Investment, onEdit: (investment: Investment) => void }> = ({ investment, onEdit }) => {
    const profit = investment.currentValue - investment.initialValue;
    // Evita divisão por zero se o valor inicial for 0
    const profitPercentage = investment.initialValue !== 0 ? (profit / investment.initialValue) * 100 : 0;
    const isProfit = profit >= 0;

    // Função auxiliar para formatar a moeda
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: investment.currency,
            minimumFractionDigits: 2,
        });
    };

    return (
        <div className="bg-surface p-6 rounded-xl shadow-md flex flex-col h-full space-y-4">
            {/* Cabeçalho */}
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-text-primary truncate" title={investment.name}>
                            {investment.name}
                        </h3>
                        <p className="text-sm text-text-secondary">{investment.type}</p>
                    </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                            {investment.currency}
                        </span>
                        <button onClick={() => onEdit(investment)} className="text-gray-400 hover:text-primary">
                            <EditIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Valor Atual em Destaque */}
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-sm text-text-secondary">Valor Atual</p>
                <p className="text-4xl font-bold text-primary leading-tight">
                    {formatCurrency(investment.currentValue)}
                </p>
            </div>

            {/* Rentabilidade */}
            <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center text-sm">
                     <span className="text-text-secondary">Rentabilidade</span>
                     <div className={`text-right font-semibold ${isProfit ? 'text-secondary' : 'text-red-500'}`}>
                        <span>{isProfit ? '+' : ''}{formatCurrency(profit)}</span>
                        <span className="block text-xs font-normal">({profitPercentage.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const InvestmentsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

    const openEditModal = (investment: Investment) => {
        setEditingInvestment(investment);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingInvestment(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingInvestment(null);
    };
    
    const { totalValue, investmentData } = useMemo(() => {
        if (!context) return { totalValue: 0, investmentData: [] };

        const totalValue = context.investments.reduce((sum, inv) => sum + inv.currentValue, 0);

        const investmentTypes = context.investments.reduce((acc, inv) => {
            acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
            return acc;
        }, {} as Record<string, number>);

        const investmentData = Object.entries(investmentTypes).map(([name, value]) => ({ name, value }));

        return { totalValue, investmentData };

    }, [context]);

    if (!context) return <div>Carregando...</div>;

    const COLORS = ['#10b981', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#eab308'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Carteira de Investimentos</h2>
                <button 
                    onClick={openAddModal}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    Adicionar Investimento
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                     <h3 className="text-lg font-semibold mb-2 text-text-primary">Valor Total da Carteira (BRL)</h3>
                     <p className="text-5xl font-bold text-primary">{totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-surface p-6 rounded-xl shadow-md">
                     <h3 className="text-lg font-semibold mb-4 text-text-primary">Alocação de Ativos</h3>
                     <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={investmentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {investmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {context.investments.map(inv => (
                    <InvestmentCard key={inv.id} investment={inv} onEdit={openEditModal} />
                ))}
            </div>

            {isModalOpen && <AddInvestmentModal onClose={closeModal} investmentToEdit={editingInvestment} />}
        </div>
    );
};

export default InvestmentsPage;