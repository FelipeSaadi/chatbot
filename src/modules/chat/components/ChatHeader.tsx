'use client';
import React from 'react';
import Avatar from '@/components/Avatar';
import Typography from '@/components/Typography';
import MoreOptionsMenu from './moreoptions';
import { IMenuItem } from './moreoptions';
import { useRouter } from 'next/navigation';

export interface ChatHeaderProps {
    leftActionContent?: string | React.ReactNode;
    onLeftActionClick?: () => void;
    userName: string;
    userStatus: string;
    avatarSrc: string;
    avatarAlt?: string;
    isOnline?: boolean;
    onCenterContentClick?: () => void;
    moreOptionsIcon?: React.ReactElement;
    onMoreOptionsClick?: () => void;
    className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    leftActionContent,
    onLeftActionClick,
    userName,
    userStatus,
    avatarSrc,
    avatarAlt = '',
    isOnline = false,
    onCenterContentClick,
    moreOptionsIcon,
    onMoreOptionsClick,
    className = '',
}) => {
    const router = useRouter();

    const navbarOptions: IMenuItem[] = [
        {
            id: 1,
            label: 'Abrir Tickets',
            action: () => router.push('/tickets'), // Ação de redirecionamento
        },
        {
            id: 2,
            label: 'Ver Notificações',
            action: () => router.push('/notification'), // Outra ação de redirecionamento
        },
        {
            id: 3,
            label: 'Configurações',
            action: () => router.push('/config'),
        },
    ];

    return (
        <header
            className={`flex items-center justify-between p-3 h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 ${className}`}
        >
            
            <div
                className="flex items-center space-x-2 cursor-pointer mx-2 flex-grow justify-center sm:justify-start sm:flex-grow-0"
                onClick={onCenterContentClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCenterContentClick?.(); }}
            >
                <div className="relative flex-shrink-0">
                    <Avatar src={avatarSrc} alt={avatarAlt} className="w-9 h-9 rounded-full" />
                    {isOnline && (
                        <span
                            className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-slate-800"
                            title="Online"
                        ></span>
                    )}
                </div>
                <div className="flex flex-col items-start">
                    <Typography as="p" className="font-semibold text-sm text-gray-900 dark:text-slate-100 leading-tight truncate max-w-[120px] xs:max-w-[150px] sm:max-w-xs">
                        {userName}
                    </Typography>
                    <Typography as="p" className="text-xs text-gray-500 dark:text-slate-400 leading-tight">
                        {userStatus}
                    </Typography>
                </div>
            </div>

            {/* Seção Direita - Mais Opções */}
            <MoreOptionsMenu 
                options={navbarOptions} 
            />
        </header>
    );
};

export default ChatHeader;
