
import React from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-6 right-6">
        <Logo />
      </div>
      {children}
    </div>
  );
};
