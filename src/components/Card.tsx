import React from "react";

export interface CardProps {
    title?: string;
    content?: string;
    height?: string;
    width?: string;
    children?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ 
    title, 
    content, 
    height, 
    width, 
    children,
    className = "" 
}) => {
    const cardClasses = [
        "bg-white",
        "border",
        "rounded-md",
        "p-4",
        "shadow-sm",
        width && `w-[${width}]`,
        height && `h-[${height}]`,
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses}>
            {title && <h2 className="text-xl font-semibold mb-2 text-black">{title}</h2>}
            {content && <p className="text-black">{content}</p>}
            {children}
        </div>
    );
};

export default Card;
