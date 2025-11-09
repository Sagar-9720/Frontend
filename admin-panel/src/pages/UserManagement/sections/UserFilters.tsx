import React from 'react';
import { SearchInput } from '../../../components/common/SearchInput';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  genderFilter: string;
  setGenderFilter: (v: string) => void;
  showDeleteRequests: boolean;
  setShowDeleteRequests: (v: boolean) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  genderFilter,
  setGenderFilter,
  showDeleteRequests,
  setShowDeleteRequests,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <SearchInput
        placeholder="Search by name, email, phone, DOB..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-48"
      />
      <select
        className="border rounded px-2 py-1"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="SubAdmin">Sub-Admin</option>
      </select>
      <select
        className="border rounded px-2 py-1"
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={showDeleteRequests}
          onChange={(e) => setShowDeleteRequests(e.target.checked)}
        />
        Show Delete Requests
      </label>
      <div className="flex items-center gap-1">
        <span>DOB:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <span>-</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );
};

