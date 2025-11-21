import React from 'react';

// 💡 Definições de Tipos
export type TicketStatus = 'Aberto' | 'Em Andamento' | 'Resolvido';

interface TicketItemProps {
    ticket: {
        code: string;
        category: string;
        title: string;
        description: string;
        date: string;
        time: string;
        attendant?: string;
        status: TicketStatus;
    };
}

const ClockIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);

// Função Auxiliar para Estilo de Status
const getStatusClasses = (status: TicketStatus) => {
    switch (status) {
        case 'Aberto':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Em Andamento':
            return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'Resolvido':
            return 'bg-green-100 text-green-800 border-green-300';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
    }
};

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
    const statusClasses = getStatusClasses(ticket.status);

    return (
        <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer">
            
            <div className="flex justify-between items-start mb-2">
                {/* Código e Categoria */}
                <div className="flex items-center space-x-3">
                    <p className="text-sm font-semibold text-gray-600">{ticket.code}</p>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                        {ticket.category}
                    </span>
                </div>
                
                {/* Status */}
                <div className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses}`}>
                    {ticket.status}
                </div>
            </div>

            {/* Título e Descrição */}
            <h2 className="text-base md:text-lg font-bold text-gray-800 mb-1">{ticket.title}</h2>
            <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>

            {/* Metadados (Data e Atendente) */}
            <div className="flex flex-col md:flex-row md:items-center text-xs text-gray-500 space-y-1 md:space-y-0 md:space-x-4 border-t pt-3 mt-3">
                <div className="flex items-center space-x-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>
                        {ticket.date} às {ticket.time}
                    </span>
                </div>
                
                {ticket.attendant && (
                    <div className="hidden md:block text-gray-300">|</div> // Separador
                )}

                {ticket.attendant && (
                    <span>
                        Atendente: {ticket.attendant}
                    </span>
                )}
            </div>
            
        </div>
    );
};

export default TicketItem;