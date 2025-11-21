"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AccessibilityContextProps {
  fontSize: number;
  toggleFontSize: () => void;
  highContrast: boolean;
  toggleContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedContrast = localStorage.getItem('highContrast') === 'true';
    setHighContrast(storedContrast);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const targetElement = document.body;

    if (highContrast) {
      targetElement.classList.add('high-contrast-mode');
    } else {
      targetElement.classList.remove('high-contrast-mode');
    }

  }, [highContrast]);


  const toggleFontSize = () => {
    setFontSize(prev => (prev === 100 ? 120 : prev === 120 ? 140 : 100));
  };

  const toggleContrast = () => {
    setHighContrast(prev => {
      const newState = !prev;
      localStorage.setItem('highContrast', newState ? 'true' : 'false');

      return newState;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, toggleFontSize, highContrast, toggleContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
};