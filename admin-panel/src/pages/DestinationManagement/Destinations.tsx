import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/common/Button";
import { ExportCSVButton } from "../../components/common/ExportCSVButton";
import { DestinationTable } from "./components/DestinationTable";
import { DestinationFormModal } from "./components/DestinationFormModal";
import { useDestinations } from "../../DataManagers/destinationDataManager";
import { Destination } from "../../models/entity/Destination";
import { Region } from "../../models/entity/Region";
import { GenericLayout } from "../../components/layout/Layout";

export const Destinations: React.FC = () => {
  try {
    const {
      destinations,
      loading,
      error,
      refetch,
      createDestination,
      updateDestination,
    } = useDestinations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDestination, setEditingDestination] =
      useState<Destination | null>(null);
    const [formData, setFormData] = useState<Partial<Destination>>({
      name: "",
      region: undefined,
      description: "",
      imageUrl: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [searchRegion, setSearchRegion] = useState<string>("");
    const [searchStatus, setSearchStatus] = useState<string>("");
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const MAX_FETCH_ATTEMPTS = 1;

    const regionList: Region[] = React.useMemo(() => {
      try {
        if (!destinations || !Array.isArray(destinations)) return [];
        return Array.from(
          new Set(destinations.map((d) => d?.region).filter(Boolean))
        ) as Region[];
      } catch (error) {
        console.error('Error creating region list:', error);
        return [];
      }
    }, [destinations]);

    const handleAdd = () => {
      try {
        setEditingDestination(null);
        setFormData({ name: "", region: undefined, description: "", imageUrl: "" });
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error in handleAdd:', error);
        alert('Error opening add destination form');
      }
    };

    const handleEdit = (destination: Destination) => {
      try {
        if (!destination) {
          console.error('No destination provided for editing');
          return;
        }
        setEditingDestination(destination);
        setFormData({
          name: destination?.name || "",
          region: destination?.region ?? undefined,
          description: destination?.description || "",
          imageUrl: destination?.imageUrl || "",
        });
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error in handleEdit:', error);
        alert('Error opening edit destination form');
      }
    };

    const handleSubmit = async (formData: Partial<Destination>) => {
      setSubmitting(true);
      try {
        if (editingDestination) {
          await updateDestination(editingDestination?.id?.toString() || "", formData);
        } else {
          await createDestination(formData);
        }
        
        // Reset fetch attempts before manual refetch
        setFetchAttempts(0);
        await refetch();
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error saving destination:', err);
        alert("Failed to save destination");
      } finally {
        setSubmitting(false);
      }
    };

    const filteredDestinations = React.useMemo(() => {
      try {
        if (!destinations || !Array.isArray(destinations)) return [];
        return destinations.filter((d) => {
          if (!d) return false;
          const matchesName = (d?.name || "").toLowerCase().includes(searchName.toLowerCase());
          const matchesRegion = searchRegion ? d?.region?.name === searchRegion : true;
          return matchesName && matchesRegion;
        });
      } catch (error) {
        console.error('Error filtering destinations:', error);
        return [];
      }
    }, [destinations, searchName, searchRegion]);

    // Loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8 text-gray-500">
          Loading destinations...
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex justify-center items-center py-8 text-red-500">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Error Loading Destinations</h2>
            <p>{error}</p>
            <button 
              onClick={async () => {
                try {
                  setFetchAttempts(0);
                  await refetch();
                } catch (error) {
                  console.error('Error retrying fetch:', error);
                }
              }} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

  // Layout props
  const buttons = (
    <Button onClick={handleAdd}>
      <Plus className="w-4 h-4 mr-2" />
      Add Destination
    </Button>
  );

  const filters = (
    <>
      <input
        type="text"
        placeholder="Search by name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="border px-3 py-2 rounded w-48"
      />
      <select
        value={searchRegion}
        onChange={(e) => setSearchRegion(e.target.value)}
        className="border px-3 py-2 rounded w-48"
      >
        <option value="">All Regions</option>
        {regionList.map((region) => (
          <option key={region.name} value={region.name}>
            {region.name}
          </option>
        ))}
      </select>
      <select
        value={searchStatus}
        onChange={(e) => setSearchStatus(e.target.value)}
        className="border px-3 py-2 rounded w-40"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <ExportCSVButton
        data={filteredDestinations}
        filename="destinations.csv"
      />
    </>
  );

  const errorSection = error ? (
    <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
      <div>Failed to fetch destinations. Please try again later.</div>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            setFetchAttempts(0);
            await refetch();
          } catch (error) {
            console.error('Error retrying fetch:', error);
          }
        }}
      >
        Retry
      </Button>
    </div>
  ) : null;

  const table = (
    <DestinationTable
      destinations={filteredDestinations}
      loading={loading}
      onEdit={handleEdit}
    />
  );

  const modal = (
    <DestinationFormModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
      submitting={submitting}
      editingDestination={editingDestination}
      formData={formData}
      setFormData={setFormData}
    />
  );

  return (
    <GenericLayout
      title="Destination Management"
      subtitle="Manage travel destinations and locations"
      buttons={buttons}
      filters={filters}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
  } catch (error) {
    console.error('Error in Destinations component:', error);
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Destinations Error</h2>
          <p>Something went wrong while loading destinations.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};
