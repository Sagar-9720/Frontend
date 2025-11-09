import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput';
import { Button } from '../../../components/common/Button';
import { ExportCSVButton } from '../../../components/common/ExportCSVButton';
import { Country } from '../../../models/entity/Country';
import { Globe } from 'lucide-react';

interface CountryFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onAdd: () => void;
  data: Country[];
}

export const CountryFilters: React.FC<CountryFiltersProps> = ({ searchTerm, setSearchTerm, onAdd, data }) => {
  const exportRows = data.map(c => ({ id: c.id, name: c.name }));
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <SearchInput
        placeholder="Search by country name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={onAdd} variant="outline">
          <Globe className="w-4 h-4 mr-2" /> Add Country
        </Button>
        <ExportCSVButton data={exportRows} filename="countries.csv" />
      </div>
    </div>
  );
};

