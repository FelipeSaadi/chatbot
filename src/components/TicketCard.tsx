import React from 'react';

// 💡 Definições de Tipos (Copie e use as mesmas do TicketsPage.tsx para evitar erros)
interface Ticket {
    id: string;
    code: string;
    category: string;
    title: string;
    description: string;
    status: 'Todos' | 'Aberto' | 'Em Andamento' | 'Resolvido';
    priority: 'Baixa' | 'Média' | 'Alta';
    dateCreated: string;
}

interface TicketCardProps {
    ticket: Ticket;
    // Removidas as props isExpanded e onCardClick pois o mockup não sugere expansão.
}

// Ícones SVG (simulando Lucide/Heroicons)
const AlertCircleIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
);
const StatusIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);


// --- Funções Auxiliares de Estilo ---

// Retorna as classes de cor para o Status (Em Andamento, Resolvido, Aberto)
const getStatusClasses = (status: Ticket['status']) => {
    switch (status) {
        case 'Aberto': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Em Andamento': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Resolvido': return 'bg-green-100 text-green-800 border-green-300';
        default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

// Retorna as classes de cor para a Prioridade (Alta, Média, Baixa)
const getPriorityClasses = (priority: Ticket['priority']) => {
    switch (priority) {
        case 'Alta': return 'bg-red-100 text-red-800 border-red-300';
        case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Baixa': return 'bg-gray-100 text-gray-600 border-gray-300';
        default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
    const isAlert = ticket.status === 'Aberto' || ticket.priority === 'Alta'; // Exibir alerta baseado no estado ou prioridade
    const statusClasses = getStatusClasses(ticket.status);
    const priorityClasses = getPriorityClasses(ticket.priority);

    return (
        // Cartão principal com sombra e bordas arredondadas
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 ease-in-out">
            
            {/* Linha 1: CÓDIGO, CATEGORIA e ÍCONE DE ALERTA/STATUS */}
            <div className="flex justify-between items-start mb-3">
                
                {/* Código e Categoria */}
                <div className="flex flex-col">
                    <div className="text-xs font-semibold text-gray-500 mb-1">{ticket.code} - {ticket.category}</div>
                    
                    {/* Título Principal */}
                    <h2 className="text-lg font-bold text-gray-800">{ticket.title}</h2>
                </div>

                {/* Ícone de Status (Alerta ou Check) */}
                {isAlert ? (
                    <AlertCircleIcon className="text-red-500 w-5 h-5 flex-shrink-0" />
                ) : (
                    // O mockup não mostra o check, mas podemos mostrar o ícone de alerta se o ticket for "Aberto"
                    <></> 
                )}
            </div>

            {/* Linha 2: Descrição */}
            <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
            
            {/* Linha 3: TAGS DE STATUS e PRIORIDADE */}
            <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-gray-100">
                
                {/* Tag de Status */}
                <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusClasses}`}>
                    {ticket.status === 'Resolvido' && <StatusIcon className="w-3 h-3" />}
                    <span>{ticket.status}</span>
                </span>
                
                {/* Tag de Prioridade */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityClasses}`}>
                    {ticket.priority}
                </span>

            </div>

            {/* Linha 4: Data de Criação */}
            <p className="text-xs text-gray-500 mt-2">
                Criado em {ticket.dateCreated}
            </p>

        </div>
    );
};