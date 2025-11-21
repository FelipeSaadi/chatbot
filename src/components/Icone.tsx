import React from 'react';

export interface IconeProps {
    size?: string;
    height?: string;
    width?: string;
    color?: string;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const Icone: React.FC<IconeProps> = ({
    size,
    height = "24px",
    width = "24px",
    color = "black",
    className = "",
    onClick = () => { },
    children
}) => {
    const iconeClasses = [
        'inline-flex',
        'items-center',
        'justify-center',
        'w-[15px]',
        'h-[15px]',
        'bg-[#245FCC]',
        'shadow-md',
        'rounded-full',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={iconeClasses} onClick={onClick}>
            {children}
        </div>
    );
}

export default Icone;
