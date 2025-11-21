import React from "react";
//import { MoreHorizontal } from "lucide-react";

export interface NotificationCardProps {
  className?: string;
  src: string;
  fallback: string;
  time: string;
  children: React.ReactNode;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  className,
  src,
  fallback,
  time,
  children,
}) => {
  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <img
          src={src}
          alt={fallback}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
        <div className="text-gray-800 text-sm">{children}</div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4 text-gray-500 text-xs">
        <span>{time}</span>
        {/* <MoreHorizontal size={16} className="cursor-pointer hover:text-gray-700" /> */}
      </div>
    </div>
  );
};

export default NotificationCard;
