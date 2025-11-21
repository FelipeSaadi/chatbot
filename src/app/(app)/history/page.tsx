"use client";
import { useEffect, useState } from "react";
import TicketItem, { TicketStatus } from '@/components/TicketItem';

interface Ticket {
    _id: string;
    title: string;
    name: string;
    phone: string;
    address: string;
    note: string; 
    priority: 'alta' | 'media' | 'baixa';
    status: TicketStatus; 
    code: string; 
    category: string; 
    description: string; 
    date: string; 
    time: string; 
    // attendant?: string; 
}


const SearchIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>);
const CalendarIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 6h12m0 0h12m-6 3v12" /></svg>);
const FilterIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18H7.5" /></svg>);
const ChevronDownIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);


export default function SolicitationHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error("Token de autenticação não encontrado.");
                return;
            }

            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_BASE_URL}/api/requests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`Falha ao buscar dados: ${res.statusText}`);
                }

                const data: Request[] = await res.json();

                const STATUS_MAPPER: { [key: string]: TicketStatus } = {
                    'novo': 'Aberto',
                    'em_andamento': 'Em Andamento',
                    'concluido': 'Resolvido',
                };


                const normalizePriority = (p: any) => {
                    const s = String(p).toLowerCase();
                    if (s === 'high' || s === 'alta' || s === 'high_priority' || s === 'high-priority') return 'alta';
                    if (s === 'medium' || s === 'media' || s === 'med') return 'media';
                    if (s === 'low' || s === 'baixa') return 'baixa';
                    return 'baixa';
                };

                const normalized = (data || []).map((r: any) => {
                    const createdDate = new Date(r.createdAt || Date.now());
                    const datePart = createdDate.toLocaleDateString('pt-BR');
                    const timePart = createdDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return {
                        ...r,
                        code: `${r._id.slice(-4)}`,
                        category: r.service || r.department || 'Geral',
                        description: r.note,
                        date: datePart,
                        time: timePart,
                        // attendant: r.attendantName || undefined, // Se necessário

                        priority: normalizePriority(r.priority),
                        status: STATUS_MAPPER[r.status] || 'Aberto',
                    };
                });

                setRequests(normalized as Ticket[]);
            } catch (error) {
                console.error('Erro ao buscar solicitações:', error);
            }
        };

        fetchRequests();
    }, []);



    const filteredTickets = requests
        .filter(r =>
            r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.note.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        // O padding lateral e superior garante que o conteúdo não cole nas bordas
        // md:px-20 aumenta o padding em telas maiores, centralizando o conteúdo
        <div className="p-4 md:p-8 lg:p-12 xl:px-40 bg-gray-50 min-h-screen">

            {/* Título e Descrição */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Histórico de Solicitações</h1>
                <p className="text-gray-600">Visualize todas as suas solicitações anteriores</p>
                {/* Contagem de Resultados */}
                <p className="text-sm text-gray-500 mt-4">{filteredTickets.length} solicitações encontradas</p>
            </header>

            {/* Barra de Pesquisa */}
            <div className="mb-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por número, título ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                </div>
            </div>

            {/* Filtros e Ordenação (Responsivo) */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">

                {/* Botão de Filtro/Categorias */}
                <div className="relative flex-1">
                    <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select
                        className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 bg-white rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                        defaultValue=""
                    >
                        <option value="">Todas as categorias</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                        <option value="Documentos">Documentos</option>
                        {/* ... mais categorias */}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Botão de Data/Ordenação */}
                <div className="relative flex-1">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select
                        className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 bg-white rounded-lg cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="recent"
                    >
                        <option value="recent">Data (mais recente)</option>
                        <option value="oldest">Data (mais antiga)</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Lista de Tickets */}
            <div className="space-y-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        // 🎯 O ticket agora deve ter o formato e o status corretos
                        <TicketItem key={ticket._id} ticket={ticket} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg mt-10">
                        Nenhuma solicitação encontrada correspondente à pesquisa.
                    </p>
                )}
            </div>

        </div>
    );
}