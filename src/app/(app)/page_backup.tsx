// ChatPage.tsx
"use client";
import React, { useState, useRef } from 'react';
import ChatList from '@/modules/chat/components/ChatList';
import ChatWindow from '@/modules/chat/components/ChatWindow';
import Avatar from '@/components/Avatar';
import messageService from '@/lib/services/message';

// Tipos simplificados para os dados mock
type ChatListItemData = { 
  id: string; 
  avatarSrc: string; 
  avatarAlt: string; 
  userName: string; 
  statusOrMessage: string; 
  timestamp: string; 
  showNotification?: boolean; 
};

type MessageData = { 
  id: string; 
  senderName: string; 
  timestamp: string; 
  message: string; 
  isSender: boolean; 
  avatar?: React.ReactElement; 
  statusIcon?: React.ReactElement;
  image?: Buffer | string;
  audioUrl?: string;
};

type ChatHeaderData = { 
  userName: string; 
  userStatus: string; 
  avatarSrc: string; 
  avatarAlt?: string; 
  isOnline?: boolean; 
  onMoreOptionsClick?: () => void; 
  moreOptionsIcon?: React.ReactElement; 
  leftActionContent?: string; 
  onLeftActionClick?: () => void; 
};

// Componentes auxiliares
const Typography: React.FC<any> = ({ as: Tag = 'span', children, className }) => <Tag className={className}>{children}</Tag>;
const SimpleAvatar: React.FC<{ initials?: string; src?: string; alt?: string; className?: string }> = ({ initials, src, alt, className = "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold" }) => {
  if (src) return <img src={src} alt={alt} className={`${className} object-cover`} />;
  return <div className={className}>{initials}</div>;
};
const OptionsIconAtom: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
  </svg>
);
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={`w-3.5 h-3.5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

// Dados Mock
const mockChats: ChatListItemData[] = [
  { id: '1', avatarSrc: 'https://placehold.co/400', avatarAlt: 'AtendeAi', userName: 'AtendeAi', statusOrMessage: 'Online', timestamp: '13:57', showNotification: true },
];

const mockMessages: { [key: string]: MessageData[] } = {};

const mockChatHeaders: { [key: string]: ChatHeaderData } = {
  '1': { userName: 'AtendeAi', userStatus: 'Online', avatarSrc: 'https://placehold.co/400', avatarAlt: 'AtendeAi', isOnline: true, onMoreOptionsClick: () => alert('Mais opções João'), moreOptionsIcon: <OptionsIconAtom className="w-6 h-6 text-gray-500 dark:text-gray-400" /> },
};

const ChatPage: React.FC = () => {
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

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || !selectedChatId) return;

    const newUserMessage: MessageData = {
      id: `msg_${Date.now()}`,
      senderName: 'Você',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      message: inputValue,
      isSender: true,
      avatar: <SimpleAvatar src="https://placehold.co/400" alt="Você" className="w-8 h-8 rounded-full" />
    };

    setCurrentMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history: any = currentMessages.map(msg => ({
        role: msg.isSender ? "user" : "assistant",
        content: msg.message
      }));

      const response = await messageService.getMessage({
        message: inputValue,
        history: history
      });

      const assistantMessage: MessageData = {
        id: `msg_${Date.now() + 1}`,
        senderName: 'AtendeAi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: response,
        isSender: false,
        avatar: <SimpleAvatar initials="AI" className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold" />,
        statusIcon: <PaperAirplaneIcon className="text-gray-400 dark:text-gray-500" />
      };

      setCurrentMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioSend = async (transcribedText: string, audioBlob: Blob) => {
    if (!selectedChatId) return;

    const audioUrl = URL.createObjectURL(audioBlob);

    const newAudioMessage: MessageData = {
      id: `msg_${Date.now()}`,
      senderName: 'Você',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      message: transcribedText || 'Mensagem de áudio',
      isSender: true,
      audioUrl: audioUrl,
      avatar: <SimpleAvatar src="https://placehold.co/400" alt="Você" className="w-8 h-8 rounded-full" />
    };

    setCurrentMessages(prev => [...prev, newAudioMessage]);
    setIsLoading(true);

    try {
      const history: any = currentMessages.map(msg => ({
        role: msg.isSender ? "user" : "assistant",
        content: msg.message
      }));

      const response = await messageService.getMessage({
        message: transcribedText,
        history: history
      });

      const assistantMessage: MessageData = {
        id: `msg_${Date.now() + 1}`,
        senderName: 'AtendeAi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: response,
        isSender: false,
        avatar: <SimpleAvatar initials="AI" className="w-8 h-8 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold" />,
        statusIcon: <PaperAirplaneIcon className="text-gray-400 dark:text-gray-500" />
      };

      setCurrentMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!fileInputRef.current?.files?.[0] || !selectedChatId) return;

    const file = fileInputRef.current.files[0];
    setIsLoading(true);

    try {
      const response = await messageService.uploadImage(file);
      const image = await messageService.getImage(response.id);

      const newImageMessage: MessageData = {
        id: `msg_${Date.now()}`,
        senderName: 'Você',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        message: 'Enviou uma imagem',
        isSender: true,
        image: image,
        avatar: <SimpleAvatar src="https://placehold.co/400" alt="Você" className="w-8 h-8 rounded-full" />
      };

      setCurrentMessages(prev => [...prev, newImageMessage]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const selectedChatHeaderData = selectedChatId ? mockChatHeaders[selectedChatId] : undefined;

  return (
    <div className="flex h-screen antialiased text-gray-800 dark:text-slate-200 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="w-full sm:w-1/3 md:w-1/4 xl:w-1/5 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <ChatList
          chats={mockChats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChatId && selectedChatHeaderData ? (
          <ChatWindow
            headerProps={{
              ...selectedChatHeaderData,
              leftActionContent: undefined,
              onLeftActionClick: undefined,
            }}
            messages={currentMessages}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            onSendMessage={handleSendMessage}
            onAudioSend={handleAudioSend}
            onImageUpload={() => fileInputRef.current?.click()}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <Typography as="p" className="text-lg">
              Selecione uma conversa para começar.
            </Typography>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default ChatPage;
