import { useState, useRef, useCallback } from 'react';
import messageService from '@/lib/services/message';
import { ChatListItemData, ChatHeaderData, MessageData } from '../types';

import { SimpleAvatar } from '@/components/SimpleAvatar';
import { PaperAirplaneIcon } from '@/components/PaperAirplaneIcon';
import { OptionsIconAtom } from '@/components/OptionsIcon';
import { ChatTurn } from '../types';



const mockChats: ChatListItemData[] = [
    { id: '1', avatarSrc: 'https://placehold.co/400', avatarAlt: 'AtendeAi', userName: 'AtendeAi', statusOrMessage: 'Online', timestamp: '13:57', showNotification: true },
];

const mockMessages: { [key: string]: MessageData[] } = {};

const mockChatHeaders: { [key: string]: ChatHeaderData } = {
    '1': {
        userName: 'AtendeAi',
        userStatus: 'Online',
        avatarSrc: 'https://placehold.co/400',
        avatarAlt: 'AtendeAi',
        isOnline: true,
        onMoreOptionsClick: () => alert('Mais opções João'),
        moreOptionsIcon: <OptionsIconAtom className="w-6 h-6 text-gray-500 dark:text-gray-400" />
    },
};

// --- Custom Hook ---

export const useChatLogic = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | undefined>('1');
    const [inputValue, setInputValue] = useState('');
    const [currentMessages, setCurrentMessages] = useState<MessageData[]>(selectedChatId ? mockMessages[selectedChatId] || [] : []);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        setCurrentMessages(mockMessages[chatId] || []);
        setInputValue('');
    };

    // Função auxiliar para criar a mensagem do Assistente
    const createAssistantMessage = (response: any) => ({
        id: `msg_${Date.now() + 1}`,
        senderName: 'AtendeAi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: response,
        isSender: false,
        avatar: <SimpleAvatar initials="AI" className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold" />,
        statusIcon: <PaperAirplaneIcon className="text-gray-400 dark:text-gray-500" />,
        enableTTS: true
    });

    // Função auxiliar para criar a mensagem do Usuário
    const createUserMessage = (message: string, isAudio = false, audioUrl?: string, image?: Buffer | string): MessageData => ({
        id: `msg_${Date.now()}`,
        senderName: 'Você',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: message,
        isSender: true,
        audioUrl: audioUrl,
        image: image,
        avatar: <SimpleAvatar src="https://placehold.co/400" alt="Você" className="w-8 h-8 rounded-full" />,
        enableTTS: !isAudio // Habilita TTS apenas para mensagens de texto
    });

    const getHistory = useCallback((): ChatTurn[] => currentMessages.map(msg => ({
        role: msg.isSender ? "user" : "assistant",
        content: msg.message
    }) as ChatTurn), [currentMessages]);


    // --- Lógica de Envio de Mensagem de Texto ---
    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || !selectedChatId) return;

        const messageToSend = inputValue;
        const newUserMessage = createUserMessage(messageToSend);

        setCurrentMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await messageService.getMessage({
                message: messageToSend,
                history: getHistory()
            });
            setCurrentMessages(prev => [...prev, createAssistantMessage(response)]);
        } catch (error) {
            console.error("Error getting response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Lógica de Envio de Áudio ---
    const handleAudioSend = async (transcribedText: string, audioBlob: Blob) => {
        if (!selectedChatId) return;

        const audioUrl = URL.createObjectURL(audioBlob);
        const newAudioMessage = createUserMessage(transcribedText || 'Mensagem de áudio', true, audioUrl);

        setCurrentMessages(prev => [...prev, newAudioMessage]);
        setIsLoading(true);

        try {
            const response = await messageService.getMessage({
                message: transcribedText,
                history: getHistory()
            });
            setCurrentMessages(prev => [...prev, createAssistantMessage(response)]);
        } catch (error) {
            console.error("Error getting response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Lógica de Upload de Imagem ---
    const handleImageUpload = async () => {
        if (!fileInputRef.current?.files?.[0] || !selectedChatId) return;

        const file = fileInputRef.current.files[0];
        setIsLoading(true);

        try {
            const response = await messageService.uploadImage(file);
            const image = await messageService.getImage(response.id);

            const newImageMessage = createUserMessage('Enviou uma imagem', false, undefined, image);
            setCurrentMessages(prev => [...prev, newImageMessage]);

            if (response.description) {
                setCurrentMessages(prev => [...prev, createAssistantMessage(response.description)]);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return {
        selectedChatId,
        setSelectedChatId,
        inputValue,
        setInputValue,
        currentMessages,
        isLoading,
        fileInputRef,
        handleChatSelect,
        handleSendMessage,
        handleAudioSend,
        handleImageUpload,
        mockChats,
        mockChatHeaders
    };
};

export default useChatLogic;