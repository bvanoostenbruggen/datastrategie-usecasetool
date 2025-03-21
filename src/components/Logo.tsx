
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = false }) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 ${className}`}
    >
      <img 
        src="/lovable-uploads/3da773a7-a00e-40dd-9fbc-0ade317020d7.png" 
        alt="Data Science Lab Logo" 
        className="h-8 w-auto"
      />
      {showText && (
        <span className="font-medium text-sm md:text-base hidden sm:inline-block text-gradient-pink">
          Data Science Lab
        </span>
      )}
    </Link>
  );
};
