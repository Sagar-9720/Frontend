import React from 'react';

export type PaneSwitchItem = { key: string; label: string };
export type PaneSwitchProps = {
  active: string;
  items: PaneSwitchItem[];
  onChange: (key: string) => void;
  className?: string;
};

export const PaneSwitch: React.FC<PaneSwitchProps> = ({ active, items, onChange, className = '' }) => {
  return (
    <div className={`flex border-b mb-4 ${className}`}>
      {items.map((item) => (
        <button
          key={item.key}
          className={`px-4 py-2 transition-colors ${
            active === item.key ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
