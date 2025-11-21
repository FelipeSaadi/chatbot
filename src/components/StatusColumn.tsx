import React , { ReactNode } from "react";

interface StatusColumnProps {
    status: string;         
    count: number;         
    className?: string;     
    content: ReactNode;     
}

const getCountClasses = (status: string) => {
    switch (status) {
        case 'A Fazer':
            return 'bg-yellow-400 text-black border-yellow-500';
        case 'Em Andamento':
            return 'bg-blue-400 text-white border-blue-500';
        case 'Concluído':
            return 'bg-green-400 text-white border-green-500';
        default:
            return 'bg-gray-300 text-gray-800 border-gray-400';
    }
};

export const StatusColumn: React.FC<StatusColumnProps> = ({ status, count, className, content }) => {
    const countClasses = getCountClasses(status);

    return (
        <div className={`flex flex-col flex-1 p- bg-gray-50 rounded-lg ${className}`}> 
         <div className="p-10 pt-5">
            <div className="flex justify-between items-center mb-4 pb-2">
                
                <h2 className="text-lg font-bold text-gray-700">{status}</h2>
                
                <span className={`
                    text-xs font-bold px-2 py-0.5 rounded-full border 
                    shadow-sm flex-shrink-0 
                    ${countClasses}
                `}>
                    {count}
                </span>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto">
                {content}
            </div>

         </div>
            
            
        </div>
    );
};

export default StatusColumn;
    