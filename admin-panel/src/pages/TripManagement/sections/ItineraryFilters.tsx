import React from 'react';
import { Search } from 'lucide-react';

interface ItineraryFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  total: number;
  filtered: number;
}

export const ItineraryFilters: React.FC<ItineraryFiltersProps> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, total, filtered }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Status</option>
        <option value="draft">Draft</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      {(searchTerm || statusFilter !== 'all') && (
        <div className="mt-2 text-sm text-gray-600">
          Showing {filtered} of {total} itineraries
        </div>
      )}
    </div>
  );
};

