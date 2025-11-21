"use client";
import React, { useState, useMemo } from 'react';
import ChatList from '@/modules/chat/components/ChatList';
import ChatWindow from '@/modules/chat/components/ChatWindow';
import { Typography } from '@/components';
import { ChatListItemData, ChatHeaderData, MessageData } from '../chat/types';

const mockChats: ChatListItemData[] = [
    { id: '1', avatarSrc: 'M', avatarAlt: 'Maria Silva', userName: 'Maria Silva', statusOrMessage: '5 msgs', timestamp: '14:30', showNotification: false },
    { id: '2', avatarSrc: 'C', avatarAlt: 'Carlos Oliveira', userName: 'Carlos Oliveira', statusOrMessage: '5 msgs', timestamp: '16:00', showNotification: false },
    { id: '3', avatarSrc: 'A', avatarAlt: 'Ana Costa', userName: 'Ana Costa', statusOrMessage: '2 msgs', timestamp: '11:00', showNotification: false },
];

const mockChatHeaders: { [key: string]: ChatHeaderData } = {
    '1': { userName: 'Maria Silva', userStatus: 'Ticket: TKT-001', avatarSrc: 'M', avatarAlt: 'Maria Silva', isOnline: true },
    '2': { userName: 'Carlos Oliveira', userStatus: 'Ticket: TKT-002', avatarSrc: 'C', avatarAlt: 'Carlos Oliveira', isOnline: false },
    '3': { userName: 'Ana Costa', userStatus: 'Ticket: TKT-003', avatarSrc: 'A', avatarAlt: 'Ana Costa', isOnline: false },
};

const mockMessages: { [key: string]: MessageData[] } = {
    '1': [
        { id: 'm1', senderName: 'Maria Silva', timestamp: '09:00', message: 'Olá, preciso agendar uma consulta com cardiologista', isSender: false },
        { id: 'm2', senderName: 'AtendeAI', timestamp: '09:00', message: 'Olá, Maria! Entendi que você precisa agendar uma consulta com cardiologista. Vou criar um chamado para você. Qual é a urgência do atendimento?', isSender: true },
        { id: 'm3', senderName: 'Maria Silva', timestamp: '09:01', message: 'É urgente, tenho sentido dores no peito', isSender: false },
        { id: 'm4', senderName: 'AtendeAI', timestamp: '09:01', message: 'Entendo a urgência. Criei o chamado TKT-001 com prioridade alta. Um atendente especializado entrará em contato em breve. Enquanto isso, se as dores persistirem, procure atendimento de emergência.', isSender: true },
        { id: 'm5', senderName: 'Você', timestamp: '14:30', message: 'Olá Maria, sou João Santos da equipe de saúde. Já estou verificando as disponibilidades de cardiologistas. Consegue comparecer amanhã às 14h?', isSender: true },
    ],
};


const ConversationsPageAttendant: React.FC = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>('1');

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    const selectedChatHeaderData = selectedChatId ? mockChatHeaders[selectedChatId] : undefined;
    const currentMessages = selectedChatId ? mockMessages[selectedChatId] || [] : [];

    // Simulação da busca (conforme no mockup)
    const [searchTerm, setSearchTerm] = useState('');
    const filteredChats = useMemo(() => {
        if (!searchTerm) return mockChats;
        return mockChats.filter(chat =>
            chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);


    return (
        <div className="w-full bg-gray-50 flex flex-1">
            <div className="bg-gray-50  w-full max-w-7xl mx-auto flex flex-col h-full">
                {/* Título e Subtítulo */}
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Conversas</h1>
                    <p className="text-gray-600">Histórico de conversas com cidadãos</p>
                </header>

                {/* Layout de Duas Colunas */}
                <div className="flex bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden h-[80vh]">

                    {/* 1. Coluna de Lista de Chats (w-1/4 em desktop, escondida em mobile se chat selecionado) */}
                    <div className="w-full sm:w-1/3 md:w-1/4 xl:w-1/5 border-r border-gray-200 flex flex-col 
                     h-full
                     /* Regra Responsiva: Esconder a lista em mobile quando um chat está aberto */
                     ${selectedChatId ? 'hidden sm:flex' : 'flex'}">

                        {/* Barra de Pesquisa da Lista */}
                        <div className="p-4 border-b">
                            <input
                                type="text"
                                placeholder="Buscar por nome ou ticket..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Lista de Conversas (Reutilizando ChatList) */}
                        <div className="overflow-y-auto flex-1">
                            <ChatList
                                chats={filteredChats}
                                selectedChatId={selectedChatId}
                                onChatSelect={handleChatSelect}
                            />
                        </div>
                    </div>

                    <div className={`flex-1 flex flex-col h-full 
                     ${selectedChatId ? 'flex' : 'hidden sm:flex'}`}>

                        {selectedChatId && selectedChatHeaderData ? (
                            <ChatWindow

                                disableInput={true}
                                headerProps={{
                                    ...selectedChatHeaderData,
                                }}
                                messages={currentMessages}
                                inputValue=""
                                onInputValueChange={() => { }}
                                onSendMessage={() => { }}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <Typography as="p" className="text-lg">
                                    Selecione uma conversa para visualizar o histórico.
                                </Typography>
                            </div>
                        )}
                    </div>

                </div>
            </div>



        </div>
    );
};

export default ConversationsPageAttendant;