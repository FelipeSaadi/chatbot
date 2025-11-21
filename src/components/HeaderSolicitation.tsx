'use client';
import React from "react";
import MoreOptionsMenu from "@/modules/chat/components/moreoptions";
import { IMenuItem } from "@/modules/chat/components/moreoptions";
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const router = useRouter();
    
        const navbarOptions: IMenuItem[] = [
            {
                id: 1,
                label: 'Abrir Conversas',
                action: () => router.push('/'), 
            },
            {
                id: 2,
                label: 'Ver Notificações',
                action: () => router.push('/notification'), 
            },
            {
                id: 3,
                label: 'Configurações',
                action: () => router.push('/config'),
            },
        ];
    return (
        <header className="px-8 py-6 bg-transparent">
            <h1 className="text-3xl font-bold text-gray-800">Solicitações</h1>
            <MoreOptionsMenu
                options={navbarOptions}
            />
        </header>
    );
};

export default Header;
