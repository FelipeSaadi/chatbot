"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TicketCard } from '@/components/TicketCard'; 


const STATUS_MAPPER_BACKEND_TO_FRONTEND = {
    'novo': 'Aberto',
    'em_andamento': 'Em Andamento',
    'concluido': 'Resolvido',
};

const PRIORITY_MAPPER_BACKEND_TO_FRONTEND = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta',
};

interface ApiRequest {
    _id: string;
    title: string;
    note: string;
    priority: "alta" | "media" | "baixa";
    status: "novo" | "em_andamento" |"concluido";
    createdAt: string;
    service?: string; 
    department?: string;
}

interface Ticket {
    id: string;
    code: string;
    category: string;
    title: string;
    description: string;
    status: 'Aberto' | 'Em Andamento' | 'Resolvido' ; 
    priority: 'Baixa' | 'Média' | 'Alta';
    dateCreated: string;
}

const mapRequestToTicket = (request: ApiRequest): Ticket => {
    const displayStatus = STATUS_MAPPER_BACKEND_TO_FRONTEND[request.status] as Ticket['status'] || 'Aberto';
    const displayPriority = PRIORITY_MAPPER_BACKEND_TO_FRONTEND[request.priority] as Ticket['priority'] || 'Baixa';
    
    const createdDate = new Date(request.createdAt);
    const formattedDate = createdDate.toLocaleDateString('pt-BR');
    
    return {
        id: request._id,
        code: `${request._id.slice(-4)}`, 
        category: request.service || request.department || 'Geral', 
        title: request.title,
        description: request.note, 
        status: displayStatus,
        priority: displayPriority,
        dateCreated: formattedDate,
    };
};



const TicketStatusFilter: React.FC<{
    currentStatus: string;
    setCurrentStatus: (status: string) => void;
    ticketCounts: Record<string, number>;
}> = ({ currentStatus, setCurrentStatus, ticketCounts }) => {
    const statuses = ['Todos', 'Aberto', 'Em Andamento', 'Resolvido']; 

    return (
        <div className="flex bg-white p-2 md:p-4 rounded-lg shadow-md border border-gray-100 mb-8">
            {statuses.map(status => {
                const isActive = currentStatus === status;
                const count = ticketCounts[status] || 0;
                
                const statusColor = {
                    'Aberto': 'text-yellow-500',
                    'Em Andamento': 'text-blue-500',
                    'Resolvido': 'text-green-500',
                    'Todos': 'text-gray-500'
                }[status] || 'text-gray-500';

                return (
                    <button
                        key={status}
                        onClick={() => setCurrentStatus(status)}
                        className={`flex-1 flex flex-col items-center p-2 rounded-lg transition-all duration-200 
                            ${isActive 
                                ? 'bg-gray-100 border-b-2 border-indigo-600 font-bold' 
                                : 'hover:bg-gray-50'
                            }`}
                    >
                        <span className={`text-sm md:text-base ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>
                            {status}
                        </span>
                        <span className={`text-lg md:text-xl font-semibold ${statusColor}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};


export const TicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string>('Todos'); 
    
    // Usar URL relativa em produção, absoluta em desenvolvimento
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    const API_URL = isProduction ? '/api/requests' : 'http://localhost:8000/api/requests';

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('authToken');

            if (!token) {
                setError("Usuário não autenticado. Faça login.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, 
                    },
                });

                if (response.ok) {
                    const rawData: ApiRequest[] = await response.json();
                    
                    const formattedTickets: Ticket[] = rawData.map(mapRequestToTicket);
                    
                    setTickets(formattedTickets); 
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Falha ao carregar as solicitações.");
                }
            } catch (err) {
                console.error("Erro de conexão ao buscar tickets:", err);
                setError("Não foi possível conectar ao servidor da API.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTickets(); 
    }, []);

    const filteredTickets = useMemo(() => {
        if (currentStatus === 'Todos') {
            return tickets;
        }
        return tickets.filter(ticket => ticket.status === currentStatus); 
    }, [tickets, currentStatus]);
    
    const ticketCounts = useMemo(() => {
        const counts: Record<string, number> = { Todos: tickets.length, Aberto: 0, 'Em Andamento': 0, Resolvido: 0 };
        tickets.forEach(ticket => {
            if (ticket.status in counts) {
                counts[ticket.status] += 1;
            }
        });
        return counts;
    }, [tickets]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando tickets...</div>;
    }
    
    if (error) {
        return <div className="p-8 text-center text-red-600 font-bold">Erro: {error}</div>;
    }
    
    
    return (
        <div className="bg-gray-50 p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto"> 

            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Meus Tickets</h1>
                <p className="text-gray-600">Acompanhe o status das suas solicitações</p>
            </header>

            <TicketStatusFilter
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
                ticketCounts={ticketCounts}
            />

            {/* Grid de Tickets */}
            <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        <TicketCard
                            key={ticket.id}
                            ticket={ticket} 
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg md:col-span-2 mt-10">
                        Nenhum ticket encontrado com o status "{currentStatus}".
                    </p>
                )}
            </main>

        </div>
    );
};

export default TicketsPage;