import React from 'react';
import { ReportsIcon } from './Icons';

const ReportsPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
            <ReportsIcon className="w-24 h-24 text-primary opacity-30 mb-4" />
            <h2 className="text-3xl font-bold text-text-primary mb-2">Relatórios Personalizados</h2>
            <p className="max-w-md mb-6">
                Em breve, você poderá criar relatórios e dashboards personalizados para visualizar seus dados financeiros de novas maneiras e obter insights ainda mais profundos.
            </p>
            <button
                disabled
                className="bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-50"
            >
                Criar Novo Relatório
            </button>
        </div>
    );
};

export default ReportsPage;