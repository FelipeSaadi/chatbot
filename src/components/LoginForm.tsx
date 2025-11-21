

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '@/contexts/UserContext';

interface JwtPayload {
    id: number;
    email: string;
    name: string;
    role: 'analyst' | 'user'; 
    exp: number; 
}

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null); 

    const router = useRouter();
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const API_URL = `${API_BASE_URL}/api/login`; 

    const { setRole } = useUser();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
           
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token: string = data.token;
                
                localStorage.setItem('authToken', token);

                
                const decodedToken = jwtDecode<JwtPayload>(token);
                const userRole = decodedToken.role;

                setRole(userRole);

                if (userRole === 'analyst') {
                    router.push('/request');
                } else if (userRole === 'user') {
                    router.push('/chat');
                } else {
                    router.push('/'); 
                }
                
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Credenciais inválidas. Verifique seu e-mail e senha.';
                setError(errorMessage);
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
       <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block font-semibold mb-2 text-gray-700">Email</label>
                <input
                    type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="password" className="block font-semibold mb-2 text-gray-700">Senha</label>
                <input
                    type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isLoading}
                />
            </div>

            {error && (
                <div className="text-red-600 p-2 bg-red-100 border border-red-300 rounded-md text-center">
                    {error}
                </div>
            )}
            
            <button
                type="submit"
                className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading}
            >
                {isLoading ? 'Aguarde...' : 'Entrar'}
            </button>
        </form>
    );
};

export default LoginForm;