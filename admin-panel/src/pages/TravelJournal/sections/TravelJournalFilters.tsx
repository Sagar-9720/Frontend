import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput';

interface TravelJournalFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  total?: number;
  filtered?: number;
}

export const TravelJournalFilters: React.FC<TravelJournalFiltersProps> = ({ searchTerm, setSearchTerm, total, filtered }) => (
  <div className="space-y-1">
    <SearchInput
      placeholder="Search journals..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchTerm && typeof filtered === 'number' && typeof total === 'number' && (
      <div className="text-xs text-gray-500">
        Showing {filtered} of {total} journals
      </div>
    )}
  </div>
);

