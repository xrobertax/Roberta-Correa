import React, { useContext, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
import { AppContext } from '../AppContext';
import { Transaction, TransactionType } from '../types';
import { getFinancialInsights } from '../services/geminiService';
import { SparklesIcon } from './Icons';

const MetricCard: React.FC<{ title: string; value: string; currency?: string; colorClass: string }> = ({ title, value, currency, colorClass }) => (
    <div className="bg-surface p-6 rounded-xl shadow-md flex-1 min-w-[200px]">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <p className={`text-3xl font-bold ${colorClass}`}>
            {currency && <span className="text-xl mr-1">{currency}</span>}
            {value}
        </p>
    </div>
);

const InsightModal: React.FC<{ content: string; onClose: () => void }> = ({ content, onClose }) => {
    // Basic markdown parsing for newlines
    const formattedContent = content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-primary flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2"/>
                        Análise Financeira com IA
                    </h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">&times;</button>
                </div>
                <div className="prose max-w-none text-text-secondary leading-relaxed">
                    {formattedContent}
                </div>
                 <div className="text-right mt-6">
                    <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const context = useContext(AppContext);
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);

    const { totalIncome, totalExpenses, balance, monthlyData, expenseData, recentTransactions, currentMonthTransactions } = useMemo(() => {
        if (!context) return { totalIncome: 0, totalExpenses: 0, balance: 0, monthlyData: [], expenseData: [], recentTransactions: [], currentMonthTransactions: [] };

        const { currentDate, transactions } = context;

        const currentMonthTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
        });

        const totalIncome = currentMonthTransactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = currentMonthTransactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;

        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const monthlyData = months.map((month, index) => {
             const income = context.transactions
                .filter(t => new Date(t.date).getMonth() === index && t.type === TransactionType.Income)
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = context.transactions
                .filter(t => new Date(t.date).getMonth() === index && t.type === TransactionType.Expense)
                .reduce((sum, t) => sum + t.amount, 0);
            return { name: month, Receitas: income, Despesas: expense };
        });

        const expenseCategories = currentMonthTransactions
            .filter(t => t.type === TransactionType.Expense)
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        const expenseData = Object.entries(expenseCategories).map(([name, value]) => ({ name, value }));
        
        const recentTransactions = [...currentMonthTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        return { totalIncome, totalExpenses, balance, monthlyData, expenseData, recentTransactions, currentMonthTransactions };
    }, [context]);
    
    if (!context) return <div>Carregando...</div>;

    const COLORS = ['#10b981', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#eab308'];

    const handleGetInsights = async () => {
        setIsLoadingInsights(true);
        setInsights(null);
        const result = await getFinancialInsights(currentMonthTransactions, context.investments, context.currentDate);
        setInsights(result);
        setIsLoadingInsights(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Visão Geral</h2>
                <button
                    onClick={handleGetInsights}
                    disabled={isLoadingInsights}
                    className="flex items-center bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent/90 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoadingInsights ? 'Analisando...' : 'Obter Análise com IA'}
                </button>
            </div>
             {insights && <InsightModal content={insights} onClose={() => setInsights(null)} />}

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard title="Receita Mensal" value={totalIncome.toFixed(2)} currency="BRL" colorClass="text-secondary" />
                <MetricCard title="Despesa Mensal" value={totalExpenses.toFixed(2)} currency="BRL" colorClass="text-red-500" />
                <MetricCard title="Balanço Mensal" value={balance.toFixed(2)} currency="BRL" colorClass={balance >= 0 ? 'text-blue-500' : 'text-red-500'} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-surface p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Visão Anual: Receitas vs. Despesas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Distribuição de Despesas do Mês</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        {expenseData.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
                                <PieLegend />
                            </PieChart>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">Nenhuma despesa este mês.</div>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Recent Transactions */}
             <div className="bg-surface p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">Transações Recentes do Mês</h3>
                <div className="overflow-x-auto">
                    {recentTransactions.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Descrição</th>
                                    <th className="p-2">Data</th>
                                    <th className="p-2">Categoria</th>
                                    <th className="p-2 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((t: Transaction) => (
                                    <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-2 font-medium">{t.description}</td>
                                        <td className="p-2 text-text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-2 text-text-secondary">{t.category}</td>
                                        <td className={`p-2 text-right font-semibold ${t.type === TransactionType.Income ? 'text-secondary' : 'text-red-500'}`}>
                                            {t.type === TransactionType.Income ? '+' : '-'} {t.currency} {t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-text-secondary py-4">Nenhuma transação este mês.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;