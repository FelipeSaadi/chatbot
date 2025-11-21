// src/components/LoginCard.tsx
"use client";
import React from 'react';
import LoginForm from './LoginForm';

const LoginCard: React.FC = () => {
    return (
        <div className="w-11/12 max-w-md p-10 bg-white rounded-xl shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Entrar na sua conta
            </h1>
            <p className="text-gray-500 mb-8">
                Bem-vindo de volta! Por favor, insira suas credenciais.
            </p>
            <LoginForm />
        </div>
    );
};

export default LoginCard;