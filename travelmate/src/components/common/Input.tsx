import React, { InputHTMLAttributes } from "react";
import { SIZES } from "../../utils";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "border border-[var(--color-border)] bg-[var(--color-background)]",
    outlined: "border-2 border-[var(--color-border)] bg-transparent",
    filled: "border-0 bg-[var(--color-surface)]",
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-[var(--radius-md)] shadow-sm
          text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
          disabled:bg-[var(--color-surface)] disabled:text-[var(--color-text-disabled)] disabled:cursor-not-allowed
          transition-colors duration-200
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${
            error
              ? "border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]"
              : ""
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-error)] flex items-center">
          <span className="w-4 h-4 mr-1">⚠</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {helperText}
        </p>
      )}
    </div>
  );
};
