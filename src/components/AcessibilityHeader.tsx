"use client";
import React from "react";
import { AccessibilityProvider } from "./AccessibilityContext";
import { AccessibilityButtons } from "./AccessibilityButtons";
import { useRouter, usePathname } from "next/navigation";

type NavItem = {
    name: string;
    path: string;
    roles: ("user" | "analyst")[]; // define quem vê esse link
};

const navItems: NavItem[] = [
    { name: "Chat", path: "/chat", roles: ["user"] },
    { name: "Meus Tickets", path: "/tickets", roles: ["user"] },
    { name: "Histórico", path: "/history", roles: ["user"] },
    { name: "Conversas", path: "/attendant-chat", roles: ["analyst"] },
    { name: "Solictações", path: "/request", roles: ["analyst"] },
    { name: "Dashboard", path: "/dashboard", roles: ["analyst"] },
];

interface AcessibilityHeaderProps {
    role: "user" | "analyst";
}

const AcessibilityHeader: React.FC<AcessibilityHeaderProps> = ({ role }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        alert("Você saiu da aplicação.");
        router.push("/login");
    };

    // Filtra as páginas conforme o papel do usuário
    const visibleNavItems = navItems.filter((item) =>
        item.roles.includes(role)
    );

    return (
        <AccessibilityProvider>
            <nav className="fixed top-0 left-0 w-full flex flex-row items-center justify-between bg-gray-50 text-gray-800 border-b-gray-300  border-b-1  z-50 px-8 py-4">
                {/* Logo / Título */}
                <div>
                    <h1 className="text-2xl font-extrabold">AtendeAI</h1>
                </div>

                {/* Links de navegação */}
                <div className="flex gap-6">
                    {visibleNavItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                  ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </div>

                {/* Botões de acessibilidade */}
                <AccessibilityButtons onLogout={handleLogout} />
            </nav>
        </AccessibilityProvider>
    );
};

export default AcessibilityHeader;
