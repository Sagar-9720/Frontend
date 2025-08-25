import React, { useState } from "react";
import {
  Plus,
  Edit,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { Input } from "../../components/common/Input";
import { format } from "date-fns";
import {
  useItineraries,
  ItineraryUI,
} from "../../DataManagers/itineraryDataManager";
import { GenericLayout } from "../../components/layout/Layout";

const Itineraries: React.FC = () => {
  try {
    // Safe hook usage with error handling
    const itineraryData = useItineraries();
    const {
      itineraries = [],
      loading = false,
      error,
      refetch,
      createItinerary,
      updateItinerary,
    } = itineraryData || {};

    const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 1;
  const [filteredItineraries, setFilteredItineraries] = useState<ItineraryUI[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<ItineraryUI | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tripId: "",
    duration: 1,
    activities: [""],
    meals: [""],
    accommodation: "",
  });

  // Safe useEffect with error handling
  React.useEffect(() => {
    try {
      if (
        Array.isArray(itineraries) &&
        itineraries.length === 0 &&
        !loading &&
        !fetchError &&
        fetchAttempts < MAX_FETCH_ATTEMPTS
      ) {
        setFetchAttempts((prev) => prev + 1);
        refetch?.().catch((err: any) => {
          console.error('Error fetching itineraries:', err);
          setFetchError(err?.message || "Failed to fetch itineraries.");
        });
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setFetchError('Failed to load itineraries data');
    }
  }, [itineraries, loading, fetchError, fetchAttempts, refetch]);

  // Safe filtering useEffect
  React.useEffect(() => {
    try {
      let filtered = Array.isArray(itineraries) ? itineraries : [];
      
      filtered = filtered.filter((itinerary) => {
        try {
          const title = itinerary?.title || '';
          const description = itinerary?.description || '';
          const tripTitle = itinerary?.tripTitle || '';
          const createdBy = itinerary?.createdBy || '';
          const searchLower = searchTerm.toLowerCase();
          
          return (
            title.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower) ||
            tripTitle.toLowerCase().includes(searchLower) ||
            createdBy.toLowerCase().includes(searchLower)
          );
        } catch (error) {
          console.error('Error filtering itinerary:', error, itinerary);
          return false;
        }
      });
      
      if (statusFilter !== "all") {
        filtered = filtered.filter((itinerary) => {
          try {
            return itinerary?.status === statusFilter;
          } catch (error) {
            console.error('Error filtering by status:', error);
            return false;
          }
        });
      }
      
      setFilteredItineraries(filtered);
    } catch (error) {
      console.error('Error in filtering useEffect:', error);
      setFilteredItineraries([]);
    }
  }, [searchTerm, statusFilter, itineraries]);

  // Safe refresh handler
  const handleRefresh = async () => {
    try {
      setFetchError(null);
      setFetchAttempts(0);
      await refetch?.();
    } catch (error) {
      console.error('Error refreshing itineraries:', error);
      setFetchError('Failed to refresh itineraries');
    }
  };

  // Table columns with error handling
  const getStatusIcon = (status: string) => {
    try {
      switch (status) {
        case "approved":
          return <CheckCircle className="w-4 h-4 text-green-600" />;
        case "rejected":
          return <XCircle className="w-4 h-4 text-red-600" />;
        case "pending":
          return <Clock className="w-4 h-4 text-yellow-600" />;
        default:
          return <Edit className="w-4 h-4 text-gray-600" />;
      }
    } catch (error) {
      console.error('Error getting status icon:', error);
      return <Edit className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    try {
      switch (status) {
        case "approved":
          return "bg-green-100 text-green-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } catch (error) {
      console.error('Error getting status color:', error);
      return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Itinerary",
      sortable: true,
      render: (value: string, itinerary: ItineraryUI) => {
        try {
          return (
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">{value || 'Untitled'}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {itinerary?.tripTitle || 'No trip assigned'}
                </div>
              </div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering itinerary title:', error);
          return <div className="text-red-500">Error loading title</div>;
        }
      },
    },
    {
      key: "duration",
      label: "Duration",
      render: (duration: number) => {
        try {
          const days = duration || 0;
          return `${days} day${days !== 1 ? "s" : ""}`;
        } catch (error) {
          console.error('Error rendering duration:', error);
          return 'N/A';
        }
      },
    },
    {
      key: "status",
      label: "Status",
      render: (status: string) => {
        try {
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status || 'unknown'}</span>
            </span>
          );
        } catch (error) {
          console.error('Error rendering status:', error);
          return <span className="text-red-500">Error</span>;
        }
      },
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (isFeatured: boolean) => {
        try {
          return (
            <div className="flex items-center">
              <Star
                className={`w-4 h-4 ${
                  isFeatured ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            </div>
          );
        } catch (error) {
          console.error('Error rendering featured status:', error);
          return <div className="text-red-500">Error</div>;
        }
      },
    },
    {
      key: "likes",
      label: "Engagement",
      render: (likes: number, itinerary: ItineraryUI) => {
        try {
          const likesCount = likes || 0;
          const viewsCount = itinerary?.views || 0;
          return (
            <div className="text-sm">
              <div>{likesCount} likes</div>
              <div className="text-gray-500">{viewsCount} views</div>
            </div>
          );
        } catch (error) {
          console.error('Error rendering engagement:', error);
          return <div className="text-red-500">Error</div>;
        }
      },
    },
    {
      key: "createdBy",
      label: "Creator",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date: string) => {
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
      render: (_: any, itinerary: ItineraryUI) => {
        try {
          return (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  try {
                    handleEdit(itinerary);
                  } catch (error) {
                    console.error('Error opening edit modal:', error);
                  }
                }}
              >
                <Edit className="w-4 h-4" />
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
      setEditingItinerary(null);
      setFormData({
        title: "",
        description: "",
        tripId: "",
        duration: 1,
        activities: [""],
        meals: [""],
        accommodation: "",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening add modal:', error);
    }
  };

  const handleEdit = (itinerary: ItineraryUI) => {
    try {
      setEditingItinerary(itinerary);
      setFormData({
        title: itinerary?.title || "",
        description: itinerary?.description || "",
        tripId: itinerary?.tripId?.toString() || "",
        duration: itinerary?.duration || 1,
        activities: itinerary?.activities || [""],
        meals: itinerary?.meals || [""],
        accommodation: itinerary?.accommodation || "",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error opening edit modal:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      try {
        if (editingItinerary) {
          await updateItinerary?.(editingItinerary.id.toString(), formData);
        } else {
          await createItinerary?.(formData);
        }
        setIsModalOpen(false);
        refetch?.();
      } catch (error) {
        console.error("Error saving itinerary:", error);
        alert("Error saving itinerary");
      }
    } catch (error) {
      console.error('Error in submit handler:', error);
    }
  };

  const addActivity = () => {
    try {
      setFormData({ ...formData, activities: [...formData.activities, ""] });
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const removeActivity = (index: number) => {
    try {
      const newActivities = formData.activities.filter((_, i) => i !== index);
      setFormData({ ...formData, activities: newActivities });
    } catch (error) {
      console.error('Error removing activity:', error);
    }
  };

  const updateActivity = (index: number, value: string) => {
    try {
      const newActivities = [...formData.activities];
      newActivities[index] = value;
      setFormData({ ...formData, activities: newActivities });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  // Filters section
  const filters = (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
      {(searchTerm || statusFilter !== "all") && (
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredItineraries.length} of {itineraries.length}{" "}
          itineraries
        </div>
      )}
    </div>
  );

  // Buttons section
  const buttons = (
    <Button onClick={handleAdd}>
      <Plus className="w-4 h-4 mr-2" /> Add Itinerary
    </Button>
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
    <Table columns={columns} data={filteredItineraries} loading={loading} />
  );

  // Modal section
  const modal = (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingItinerary ? "Edit Itinerary" : "Add New Itinerary"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
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
            required
          />
        </div>
        <Input
          label="Trip ID"
          type="number"
          value={formData.tripId}
          onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
          required
        />
        <Input
          label="Duration (days)"
          type="number"
          min="1"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: parseInt(e.target.value) })
          }
          required
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Activities
            </label>
            <Button type="button" size="sm" onClick={addActivity}>
              Add Activity
            </Button>
          </div>
          {formData.activities.map((activity, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={activity}
                onChange={(e) => updateActivity(index, e.target.value)}
                placeholder={`Activity ${index + 1}`}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.activities.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => removeActivity(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1">
            {editingItinerary ? "Update" : "Create"} Itinerary
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
      title="Itinerary Management"
      subtitle="Manage trip itineraries and schedules"
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
  } catch (error) {
    console.error('Error in Itineraries component:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">
          Something went wrong while loading itineraries
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
};

export default Itineraries;
