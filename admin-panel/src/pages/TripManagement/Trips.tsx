import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Search } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { Trip } from "../../models/entity/Trip";
import { useTrips } from "../../DataManagers/tripDataManager";
import { format } from "date-fns";
import { GenericLayout } from "../../components/layout/Layout";

function Trips() {
  try {
    // Safe hook usage with error handling
    const tripData = useTrips();
    const {
      trips = [],
      loading: isLoading = false,
      error,
      refetch,
    } = tripData || {};

    const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 1;
  
  // Safe useEffect with error handling
  useEffect(() => {
    try {
      if (
        Array.isArray(trips) &&
        trips.length === 0 &&
        !isLoading &&
        !fetchError &&
        fetchAttempts < MAX_FETCH_ATTEMPTS
      ) {
        setFetchAttempts((prev) => prev + 1);
        refetch?.().catch((err: any) => {
          console.error('Error fetching trips:', err);
          setFetchError(err?.message || "Failed to fetch trips.");
        });
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setFetchError('Failed to load trips data');
    }
  }, [trips, isLoading, fetchError, fetchAttempts, refetch]);
  
  // Safe refresh handler
  const handleRefresh = async () => {
    try {
      setFetchError(null);
      setFetchAttempts(0);
      await refetch?.();
    } catch (error) {
      console.error('Error refreshing trips:', error);
      setFetchError('Failed to refresh trips');
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
  });

  // Filter trips based on search term with error handling
  const filteredTrips = React.useMemo(() => {
    try {
      if (!Array.isArray(trips)) {
        console.warn('Trips is not an array:', trips);
        return [];
      }
      
      if (searchTerm.trim() === "") return trips;
      
      return trips.filter((trip: Trip) => {
        try {
          const title = trip?.title || '';
          const description = trip?.description || '';
          const searchLower = searchTerm.toLowerCase();
          
          return (
            title.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower)
          );
        } catch (error) {
          console.error('Error filtering trip:', error, trip);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in filteredTrips:', error);
      return [];
    }
  }, [searchTerm, trips]);

  const columns = [
    {
      key: "title",
      label: "Trip",
      sortable: true,
      render: (value: string, trip: Trip) => {
        try {
          return (
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{value || 'Untitled'}</div>
                <div className="text-sm text-gray-500">{trip?.description || 'No description'}</div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering trip title:', error);
          return <div className="text-red-500">Error loading trip</div>;
        }
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive: boolean) => {
        try {
          return (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        } catch (error) {
          console.error('Error rendering trip status:', error);
          return <span className="text-red-500">Error</span>;
        }
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: Date) => {
        try {
          if (!date) return 'N/A';
          return format(new Date(date), "MMM dd, yyyy");
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Invalid date';
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, trip: Trip) => {
        try {
          return (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  try {
                    handleEdit(trip);
                  } catch (error) {
                    console.error('Error opening edit modal:', error);
                  }
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  try {
                    if (trip?.id !== undefined) {
                      handleDelete(trip.id);
                    }
                  } catch (error) {
                    console.error('Error deleting trip:', error);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        } catch (error) {
          console.error('Error rendering actions:', error);
          return <div className="text-red-500">Error</div>;
        }
      },
    },
  ];

  // Safe handlers with error handling
  const handleAdd = () => {
    try {
      setEditingTrip(null);
      setFormData({
        title: "",
        description: "",
        isActive: true,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening add modal:', error);
    }
  };

  const handleEdit = (trip: Trip) => {
    try {
      setEditingTrip(trip);
      setFormData({
        title: trip?.title || "",
        description: trip?.description || "",
        isActive: trip?.isActive ?? true,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening edit modal:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (window.confirm("Are you sure you want to delete this trip?")) {
        try {
          // TODO: Implement deleteTrip in useTrips/tripService
          // await tripService.deleteTrip(id.toString());
          console.log('Delete trip with ID:', id);
          refetch?.();
        } catch (error) {
          console.error("Error deleting trip:", error);
        }
      }
    } catch (error) {
      console.error('Error in delete handler:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      try {
        if (editingTrip) {
          // TODO: Implement updateTrip in useTrips/tripService
          // await tripService.updateTrip(editingTrip.id!.toString(), formData);
        } else {
          // TODO: Implement createTrip in useTrips/tripService
          // await tripService.createTrip(formData);
        }
        setIsModalOpen(false);
        refetch?.();
      } catch (error) {
        console.error("Error saving trip:", error);
      }
    } catch (error) {
      console.error('Error in submit handler:', error);
    }
  };

  // Filters section
  const filters = (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by trip name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Found {filteredTrips.length} trip
          {filteredTrips.length !== 1 ? "s" : ""} matching "{searchTerm}"
        </div>
      )}
    </div>
  );

  // Buttons section
  const buttons = (
    <div className="flex space-x-3">
      <Button onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Trip
      </Button>
      {/* <Button variant="outline" onClick={handleAutoDelete}>
        Auto-Delete Trips
      </Button> */}
    </div>
  );

  // Error section
  const errorSection = fetchError && (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <span className="text-red-700 font-medium">{fetchError}</span>
      <Button variant="outline" className="ml-4" onClick={handleRefresh}>
        Retry
      </Button>
    </div>
  );

  // Table section
  const table = (
    <Table columns={columns} data={filteredTrips} loading={isLoading} />
  );

  // Modal section
  const modal = (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingTrip ? "Edit Trip" : "Add New Trip"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Trip Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-900"
          >
            Active
          </label>
        </div>
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            {editingTrip ? "Update" : "Create"} Trip
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );

  return (
    <GenericLayout
      title="Trip Management"
      subtitle="Manage trips"
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
  } catch (error) {
    console.error('Error in Trips component:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">
          Something went wrong while loading trips
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
        >
          Reload Page
        </Button>
      </div>
    );
  }
}

export default Trips;
