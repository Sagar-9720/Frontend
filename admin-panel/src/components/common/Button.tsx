import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { SIZES } from '../../utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white focus:ring-[var(--color-primary)]/50 border border-transparent',
    secondary: 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-white focus:ring-[var(--color-secondary)]/50 border border-transparent',
    danger: 'bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-white focus:ring-[var(--color-error)]/50 border border-transparent',
    success: 'bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white focus:ring-[var(--color-success)]/50 border border-transparent',
    outline: 'border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-[var(--color-primary)]/50'
  };
  
  const sizes = {
    sm: SIZES.BUTTON.PADDING.SM + ' text-sm rounded-[var(--radius-sm)]',
    md: SIZES.BUTTON.PADDING.MD + ' text-sm rounded-[var(--radius-md)]',
    lg: SIZES.BUTTON.PADDING.LG + ' text-base rounded-[var(--radius-lg)]'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};