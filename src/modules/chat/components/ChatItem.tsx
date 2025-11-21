import React from 'react';
import Avatar from '@/components/Avatar';
import Typography from '@/components/Typography';
import Icone from '@/components/Icone';

export interface ChatItemProps {
    avatarSrc: string;
    avatarAlt: string;
    avatarClassName?: string;
    userName: string;
    messageOrStatus: string;
    timestamp: string;
    isTyping?: boolean;
    showNotification?: boolean;
    className?: string;
    onClick?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
    avatarSrc,
    avatarAlt,
    avatarClassName = "w-10 h-10",
    userName,
    messageOrStatus,
    timestamp,
    isTyping = false,
    showNotification = false,
    className = "",
    onClick,
}) => {
    const statusText = isTyping ? "Digitando..." : messageOrStatus;
    const statusTextClass = isTyping
        ? "text-blue-600 dark:text-blue-400 italic"
        : "text-gray-600 dark:text-gray-400";

    return (
        <div
            className={`flex items-start p-3 space-x-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-200 dark:border-slate-600 last:border-b-0 ${className}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
        >
            <div className={`flex-shrink-0 pt-0.5 ${avatarClassName}`}>
                <Avatar src={avatarSrc} alt={avatarAlt} className="w-full h-full rounded-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <Typography
                        as="p"
                        className="font-semibold text-sm text-gray-900 dark:text-slate-100 truncate"
                    >
                        {userName}
                    </Typography>
                    <Typography
                        as="span"
                        className="text-xs text-gray-500 dark:text-slate-400 ml-2 flex-shrink-0"
                    >
                        {timestamp}
                    </Typography>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                    <Typography
                        as="p"
                        className={`text-sm truncate ${statusTextClass}`}
                    >
                        {statusText}
                    </Typography>

                    {showNotification && (
                        <div className="ml-2 flex-shrink-0">
                            <Icone />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
