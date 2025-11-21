'use client';

import { useUser } from '@/contexts/UserContext';
import AcessibilityHeader from './AcessibilityHeader';


type HeaderRoleType = "analyst" | "user";

export default function ClientHeader() {
    const { role } = useUser(); 

    let headerRole: HeaderRoleType;

    if (role === 'analyst') {
        headerRole = 'analyst'; 
    } else if (role === 'user' || role === null) { 
        headerRole = 'user';
    } else {
        headerRole = 'user'; 
    }
    return (
        <AcessibilityHeader role={headerRole} />
    );
}