import React from "react";
import { useAccessibility } from "./AccessibilityContext";

interface Props {
    onLogout: () => void;
}

export const AccessibilityButtons: React.FC<Props> = ({ onLogout }) => {
    const { toggleFontSize, toggleContrast, highContrast } = useAccessibility();

    return (
        <div className="flex items-center gap-3 p-1">
            {/* Aumentar texto */}
            <button
                onClick={toggleFontSize}
                aria-label="Aumentar tamanho do texto"
                className="p-2 rounded-full bg-white border hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <img 
                    src="/t.png" 
                    alt="Ícone de texto" 
                    className={`w-5 h-5 ${highContrast ? 'invert brightness-0' : ''}`}
                />
            </button>


            {/* Modo alto contraste */}
            <button
                onClick={toggleContrast}
                aria-label="Alternar modo de contraste"
                className={`p-2 rounded-full border focus:outline-none focus:ring-2 transition duration-300 ease-in-out
        ${highContrast
                        ? "bg-black text-yellow-400 border-yellow-400" // Botão Invertido/Marcado
                        : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300 focus:ring-blue-500"
                    }
    `}
            >
                <img 
                    src="/simbolo-do-circulo-de-contraste.png" 
                    alt="Ícone de contraste" 
                    className={`w-5 h-5 ${highContrast ? 'invert brightness-0' : ''}`}
                />
            </button>

            {/* Logout */}
            <button
                onClick={onLogout}
                aria-label="Sair da aplicação"
                className="p-2 rounded-full  text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400"
            >
                <img 
                    src="/saida.png" 
                    alt="Ícone de sair" 
                    className={`w-5 h-5 ${highContrast ? 'invert brightness-0' : ''}`}
                />
            </button>
        </div>
    );
};
