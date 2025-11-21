import React from 'react';
import ChatItem from './ChatItem';
import Typography from '@/components/Typography';

interface ChatListItemData {
    id: string;
    avatarSrc: string;
    avatarAlt: string;
    userName: string;
    statusOrMessage: string;
    timestamp: string;
    showNotification?: boolean;
}

export interface ChatListProps {
    chats: ChatListItemData[];
    selectedChatId?: string;
    onChatSelect: (chatId: string) => void;
    className?: string;
}

const ChatList: React.FC<ChatListProps> = ({
    chats,
    selectedChatId,
    onChatSelect,
    className = '',
}) => {
    return (
        <div className={`flex flex-col h-full bg-white dark:bg-slate-800 ${className}`}>
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <Typography as="h1" className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    Conversas
                </Typography>
            </div>

            <div className="flex-grow overflow-y-auto">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            avatarSrc={chat.avatarSrc}
                            avatarAlt={chat.avatarAlt}
                            userName={chat.userName}
                            messageOrStatus={chat.statusOrMessage}
                            timestamp={chat.timestamp}
                            showNotification={chat.showNotification}
                            onClick={() => onChatSelect(chat.id)}
                            className={
                                selectedChatId === chat.id
                                    ? 'bg-gray-100 dark:bg-slate-700'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-750'
                            }
                        />
                    ))
                ) : (
                    <Typography as="p" className="p-4 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma conversa encontrada.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default ChatList;
