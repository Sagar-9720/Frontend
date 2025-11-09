import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Content */}
        <div className={`
          inline-block align-bottom bg-[var(--color-surface)] rounded-[var(--radius-lg)] 
          text-left overflow-hidden shadow-[var(--shadow-xl)] transform transition-all 
          sm:my-8 sm:align-middle sm:w-full border border-[var(--color-border)]
          ${sizeClasses[size]}
        `}>
          <div className="bg-[var(--color-surface)] px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] 
                           hover:bg-[var(--color-background)] rounded-[var(--radius-md)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="text-[var(--color-text-primary)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};