import { GoogleGenAI } from "@google/genai";
import { Transaction, Investment, TransactionType } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function formatFinancialDataForPrompt(transactions: Transaction[], investments: Investment[], currentDate: Date): string {
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.Income)
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2);
    
    const totalExpenses = transactions
        .filter(t => t.type === TransactionType.Expense)
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2);
        
    const expenseCategories = transactions
        .filter(t => t.type === TransactionType.Expense)
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const formattedExpenseCategories = Object.entries(expenseCategories)
        .map(([category, amount]) => `- ${category}: ${amount.toFixed(2)}`)
        .join('\n');

    const totalInvestments = investments
        .reduce((sum, i) => sum + i.currentValue, 0)
        .toFixed(2);
        
    const investmentTypes = investments.reduce((acc, i) => {
        acc[i.type] = (acc[i.type] || 0) + i.currentValue;
        return acc;
    }, {} as Record<string, number>);

    const formattedInvestmentTypes = Object.entries(investmentTypes)
        .map(([type, value]) => `- ${type}: ${value.toFixed(2)}`)
        .join('\n');

    return `
Here is a summary of a family's financial data for ${monthName} (amounts are in their respective currencies, mostly BRL and USD):

**Monthly Financial Summary:**
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}

**Expense Breakdown by Category:**
${formattedExpenseCategories}

**Investment Portfolio Summary (geral, não mensal):**
- Total Investment Value: ${totalInvestments}

**Investment Allocation by Type:**
${formattedInvestmentTypes}

Please analyze the financial data for ${monthName} and provide actionable financial insights and tips for this family. Focus on potential savings, expense analysis for this month, and general financial health improvements based on this month's performance. Keep the tone friendly, encouraging, and easy to understand for someone who is not a financial expert. Please provide your response in Portuguese (Brazil).
    `;
}

export const getFinancialInsights = async (transactions: Transaction[], investments: Investment[], currentDate: Date): Promise<string> => {
    if (!process.env.API_KEY) {
        return "A chave da API do Gemini não está configurada. Por favor, configure a variável de ambiente API_KEY para usar as funcionalidades de IA.";
    }
    
    try {
        const prompt = formatFinancialDataForPrompt(transactions, investments, currentDate);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error fetching financial insights from Gemini:", error);
        return "Desculpe, ocorreu um erro ao tentar obter as análises financeiras. Por favor, tente novamente mais tarde.";
    }
};