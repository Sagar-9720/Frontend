import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput';

interface TripFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  total?: number;
  filtered?: number;
}

export const TripFilters: React.FC<TripFiltersProps> = ({ searchTerm, setSearchTerm, total, filtered }) => {
  return (
    <div className="space-y-1 max-w-md">
      <SearchInput
        placeholder="Search by trip name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && typeof filtered === 'number' && typeof total === 'number' && (
        <div className="text-xs text-gray-600">
          Found {filtered} trip{filtered !== 1 ? 's' : ''} matching "{searchTerm}" (of {total})
        </div>
      )}
    </div>
  );
};

