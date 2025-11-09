import React from 'react';

export type FilterSelectOption = { label: string; value: string };

export type FilterSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: FilterSelectOption[];
  label?: string;
  containerClassName?: string;
};

export const FilterSelect: React.FC<FilterSelectProps> = ({
  options,
  label,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <select
        {...props}
        className={`border px-3 py-2 rounded ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
