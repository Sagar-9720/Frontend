import React from 'react';
import { Search } from 'lucide-react';

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerClassName?: string;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  containerClassName = 'relative max-w-md',
  className = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        {...props}
        className={`pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
};
