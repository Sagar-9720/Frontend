import React from 'react';

export type StatusBadgeProps = {
  status?: string | boolean | null;
  trueLabel?: string;
  falseLabel?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, trueLabel = 'Active', falseLabel = 'Inactive' }) => {
  try {
    const isActive = typeof status === 'boolean' ? status : String(status).toLowerCase() === 'active' || status === 'approved';
    const color = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const label = typeof status === 'boolean' ? (isActive ? trueLabel : falseLabel) : String(status || 'unknown');

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{label}</span>
    );
  } catch {
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">unknown</span>;
  }
};
