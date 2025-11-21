"use client";
import React from 'react';
import LoginCard from '../../components/LoginCard';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
    const { setRole } = useUser();
    const navigate = useRouter();
    const router = useRouter();

    const handleLogin = (role: "citizen" | "attendant") => {
    setRole(role);

    if (role === "citizen") {
      router.push("/citizen");
    } else {
      router.push("/attendant");
    }
  };

    return (
        <main className="flex h-screen bg-gray-100">
            <div className="hidden md:flex flex-1 justify-center items-center bg-gray-900 overflow-hidden">
                <Image
                    src="/farol_santander.jpg"
                    alt="Imagem de fundo"
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                    priority
                />
            </div>
            <div className="flex flex-1 justify-center items-center p-4">
                <LoginCard />
            </div>
            {/* <button
                onClick={() => handleLogin("citizen")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Entrar como Cidadão
            </button>
            <button
                onClick={() => handleLogin("attendant")}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
                Entrar como Atendente
            </button> */}

        </main>
    );
}