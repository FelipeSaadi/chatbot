import React from "react";

export interface RequestCardProps {
    title: string;
    name: string;
    phone: string;
    address: string;
    note: string;
    priority: "alta" | "media" | "baixa";
}

const RequestCard: React.FC<RequestCardProps> = ({ title, name, phone, address, note, priority }) => {
    const getPriorityColor = () => {
        switch (priority) {
            case "alta":
                return "bg-red-500 text-white";
            case "media":
                // use amber/orange for medium priority with good contrast
                return "bg-amber-400 text-gray-900";
            case "baixa":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-300";
        }
    };

    return (
        <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getPriorityColor()}`}>
                    Prioridade: {priority === 'media' ? 'Média' : (priority.charAt(0).toUpperCase() + priority.slice(1))}
                </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
                <p><strong>{name}</strong></p>
                <p>{phone}</p>
                <p>{address}</p>
                <p className="text-gray-600">Nota: {note}</p>
            </div>
        </div>
    );
};

export default RequestCard;
