import React, { useState } from 'react';

interface AvatarProps {
    src?: string;       
    alt: string;      
    size?: 'sm' | 'md' | 'lg' | 'xl'; 
    className?: string; 
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className }) => {
    const [imageError, setImageError] = useState(false);

   
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base', 
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
    };

    const getBackgroundColor = (name: string) => {
        const charCode = name.charCodeAt(0);
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500',
            'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
        ];
        return colors[charCode % colors.length];
    };

    const initial = alt ? alt.charAt(0).toUpperCase() : '?';
    const bgColorClass = getBackgroundColor(alt);

    if (src && !imageError) {
        return (
            <img
                src={src}
                alt={alt}
                className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
                onError={() => setImageError(true)} 
            />
        );
    }

    return (
        <div
            className={`
                rounded-full flex items-center justify-center 
                font-semibold text-white 
                ${bgColorClass} 
                ${sizeClasses[size]} 
                ${className}
            `}
        >
            {initial}
        </div>
    );
};

export default Avatar;