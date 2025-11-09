import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput';
import { Button } from '../../../components/common/Button';
import { ExportCSVButton } from '../../../components/common/ExportCSVButton';
import { Region } from '../../../models/entity/Region';
import { Plus } from 'lucide-react';

interface RegionFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onAdd: () => void;
  data: Region[];
}

export const RegionFilters: React.FC<RegionFiltersProps> = ({ searchTerm, setSearchTerm, onAdd, data }) => {
  const exportRows = data.map(r => ({ id: r.id, name: r.name, country: r.country?.name || '' }));
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <SearchInput
        placeholder="Search by region name or country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Region
        </Button>
        <ExportCSVButton data={exportRows} filename="regions.csv" />
      </div>
    </div>
  );
};

