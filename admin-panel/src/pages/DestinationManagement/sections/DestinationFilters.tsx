import React from "react";
import { SearchInput } from "../../../components/common/SearchInput";
import { FilterSelect } from "../../../components/common/FilterSelect";
import { ExportCSVButton } from "../../../components/common/ExportCSVButton";
import { Destination } from "../../../models/entity/Destination";
import { Region } from "../../../models/entity/Region";

interface DestinationFiltersProps {
  searchName: string;
  setSearchName: (v: string) => void;
  searchRegion: string;
  setSearchRegion: (v: string) => void;
  searchStatus: string;
  setSearchStatus: (v: string) => void;
  uniqueRegions: Region[];
  exportData: Destination[];
}

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  searchName,
  setSearchName,
  searchRegion,
  setSearchRegion,
  searchStatus,
  setSearchStatus,
  uniqueRegions,
  exportData,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <SearchInput
        placeholder="Search by name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        containerClassName="relative"
        className="w-48"
      />
      <FilterSelect
        value={searchRegion}
        onChange={(e) => setSearchRegion(e.target.value)}
        options={[{ label: 'All Regions', value: '' }, ...uniqueRegions.map(r => ({ label: r.name, value: r.id !== undefined && r.id !== null ? String(r.id) : `name:${r.name}` }))]}
        className="w-52"
      />
      <FilterSelect
        value={searchStatus}
        onChange={(e) => setSearchStatus(e.target.value)}
        options={[{ label: 'All Status', value: '' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
        className="w-40"
      />
      <ExportCSVButton data={exportData} filename="destinations.csv" />
    </div>
  );
};

