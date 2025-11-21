'use client';

import React, { useState, useRef, useEffect, ReactElement } from 'react';

const DefaultOptionsIcon = (props: { className?: string }) => (

    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    </svg>

);

export interface IMenuItem {
    id: string | number;
    label: string;
    action: () => void;
    href?: string;
}
interface MoreOptionsMenuProps {
    options: IMenuItem[];
    moreOptionsIcon?: ReactElement;
    positionClasses?: string;
}

const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({
    options,
    moreOptionsIcon,
    positionClasses = 'right-0',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    if (options.length === 0) {
        return null;
    }

    return (
        <div className="relative flex-shrink-0 w-auto min-w-[40px] flex justify-end" ref={menuRef}>

            {/* Botão de Toggle */}
            <button
                onClick={handleButtonClick}
                className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Mais opções"
                aria-expanded={isOpen}
                type="button"
            >
                {moreOptionsIcon && React.isValidElement(moreOptionsIcon)
                    ? moreOptionsIcon
                    : <DefaultOptionsIcon className="w-5 h-5" />
                }
            </button>

            {/* O MENU DROPDOWN */}
            {isOpen && (
                <div
                    className={`absolute ${positionClasses} mt-8 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 dark:bg-gray-700`}
                    role="menu"
                >
                    <div className="py-1" role="none">
                        {options.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleMenuItemClick(item.action)}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                                role="menuitem"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoreOptionsMenu;