import React from "react";

export const SimpleAvatar: React.FC<{ initials?: string; src?: string; alt?: string; className?: string }> = ({ initials, src, alt, className = "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold" }) => {
    if (src) return <img src={src} alt={alt} className={`${className} object-cover`} />;
    return <div className={className}>{initials}</div>;
};