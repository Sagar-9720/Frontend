import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Edit,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Table } from "../../components/common/Table";
import { Modal } from "../../components/common/Modal";
import { format } from "date-fns";
import { useItineraries, ItineraryUI } from "../../DataManagers/itineraryDataManager";
import { GenericLayout } from "../../components/layout/Layout";
import { Form } from "../../components/common/Form";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { ItineraryFilters } from "./sections/ItineraryFilters";

// Column type for local table usage
interface ItineraryColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: ItineraryUI) => React.ReactNode;
}

const Itineraries: React.FC = () => {
  const itineraryData = useItineraries();
  const {
    itineraries = [],
    loading = false,
    refetch,
    createItinerary,
    updateItinerary,
  } = itineraryData || {};

  const [fetchError, setFetchError] = useState<string | null>(null);
  const MAX_FETCH_ATTEMPTS = 1;
  const fetchAttemptsRef = useRef(0);
  const fetchedOnceRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<ItineraryUI | null>(null);
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

  const filteredItineraries = useMemo<ItineraryUI[]>(() => {
    try {
      let filtered = Array.isArray(itineraries) ? [...itineraries] : [];
      const searchLower = searchTerm.toLowerCase();
      if (searchLower) {
        filtered = filtered.filter((itinerary) => {
          const title = itinerary?.title || '';
          const description = itinerary?.description || '';
          const tripTitle = itinerary?.tripTitle || '';
          const createdBy = itinerary?.createdBy || '';
          return (
            title.toLowerCase().includes(searchLower) ||
            description.toLowerCase().includes(searchLower) ||
            tripTitle.toLowerCase().includes(searchLower) ||
            createdBy.toLowerCase().includes(searchLower)
          );
        });
      }
      if (statusFilter !== 'all') {
        filtered = filtered.filter((i) => i.status === statusFilter);
      }
      return filtered;
    } catch {
      return [];
    }
  }, [searchTerm, statusFilter, itineraries]);

  // Initial fetch retry logic
  useEffect(() => {
    if (fetchedOnceRef.current) return;
    if (Array.isArray(itineraries) && itineraries.length === 0 && !loading && !fetchError && fetchAttemptsRef.current < MAX_FETCH_ATTEMPTS) {
      fetchAttemptsRef.current += 1;
      fetchedOnceRef.current = true;
      refetch?.().catch((err: unknown) => {
        const msg = typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : undefined;
        setFetchError(msg || 'Failed to fetch itineraries.');
      });
    }
  }, [itineraries, loading, fetchError, refetch]);

  const handleRefresh = async () => {
    setFetchError(null);
    fetchAttemptsRef.current = 0;
    fetchedOnceRef.current = false;
    await refetch?.();
  };

  const handleAdd = () => {
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
  };

  const handleEdit = (itinerary: ItineraryUI) => {
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
  };

  const addActivity = () => setFormData({ ...formData, activities: [...formData.activities, ""] });
  const removeActivity = (index: number) => setFormData({ ...formData, activities: formData.activities.filter((_, i) => i !== index) });
  const updateActivity = (index: number, value: string) => {
    const next = [...formData.activities];
    next[index] = value;
    setFormData({ ...formData, activities: next });
  };

  const columns: ItineraryColumn[] = [
    {
      key: "title",
      label: "Itinerary",
      sortable: true,
      render: (value: unknown, itinerary) => (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <div className="font-medium text-gray-900">{(value as string) || 'Untitled'}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {itinerary?.tripTitle || 'No trip assigned'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (value: unknown) => {
        const days = (value as number) || 0;
        return `${days} day${days !== 1 ? 's' : ''}`;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => {
        const status = (value as string) || 'unknown';
        const icon = status === 'approved' ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : status === 'rejected' ? (
          <XCircle className="w-4 h-4 text-red-600" />
        ) : status === 'pending' ? (
          <Clock className="w-4 h-4 text-yellow-600" />
        ) : (
          <Edit className="w-4 h-4 text-gray-600" />
        );
        const color = status === 'approved' ? 'bg-green-100 text-green-800' : status === 'rejected' ? 'bg-red-100 text-red-800' : status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {icon}
            <span className="ml-1 capitalize">{status}</span>
          </span>
        );
      },
    },
    {
      key: "isFeatured",
      label: "Featured",
      render: (value: unknown) => (
        <Star className={`w-4 h-4 ${(value as boolean) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ),
    },
    {
      key: "likes",
      label: "Engagement",
      render: (value: unknown, row) => (
        <div className="text-sm">
          <div>{(value as number) || 0} likes</div>
          <div className="text-gray-500">{row?.views || 0} views</div>
        </div>
      ),
    },
    { key: "createdBy", label: "Creator", sortable: true },
    {
      key: "createdAt",
      label: "Created",
      render: (value: unknown) => {
        const dateStr = value as string;
        if (!dateStr) return 'N/A';
        try { return format(new Date(dateStr), 'MMM dd, yyyy'); } catch { return 'Invalid date'; }
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filters = (
    <ItineraryFilters
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      total={itineraries.length}
      filtered={filteredItineraries.length}
    />
  );

  const buttons = (
    <Button onClick={handleAdd}>
      <Plus className="w-4 h-4 mr-2" /> Add Itinerary
    </Button>
  );

  const errorSection = fetchError && (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <span className="text-red-700 font-medium">{fetchError}</span>
      <Button variant="outline" className="ml-4" onClick={handleRefresh}>
        Retry
      </Button>
    </div>
  );

  const table = (
    <Table
      columns={columns as unknown as { key: string; label: string; sortable?: boolean; render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode }[]}
      data={filteredItineraries as unknown as Record<string, unknown>[]}
      loading={loading && !fetchError}
    />
  );

  const modal = (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingItinerary ? "Edit Itinerary" : "Add New Itinerary"}
    >
      <Form
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', rows: 3, required: true },
          { name: 'tripId', label: 'Trip ID', type: 'number', required: true },
          { name: 'duration', label: 'Duration (days)', type: 'number', required: true, min: 1 }
        ]}
        value={formData}
        onChange={setFormData}
        onSubmit={async () => {
          try {
            if (editingItinerary) {
              await updateItinerary?.(editingItinerary.id.toString(), formData);
            } else {
              await createItinerary?.(formData);
            }
            setIsModalOpen(false);
            refetch?.();
          } catch {
            alert('Error saving itinerary');
          }
        }}
        onCancel={() => setIsModalOpen(false)}
        submitLabel={editingItinerary ? 'Update Itinerary' : 'Create Itinerary'}
        renderActions={() => (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Activities</label>
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
                    <Button type="button" size="sm" variant="danger" onClick={() => removeActivity(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-3 pt-2">
              <Button type="submit" className="flex-1">
                {editingItinerary ? 'Update' : 'Create'} Itinerary
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      />
    </Modal>
  );

  return (
    <GenericLayout
      title={PAGE_TITLES.ITINERARY_MANAGEMENT}
      subtitle={PAGE_SUBTITLES.ITINERARY_MANAGEMENT}
      filters={filters}
      buttons={buttons}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
};

export default Itineraries;
