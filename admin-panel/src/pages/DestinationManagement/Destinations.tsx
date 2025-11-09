import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/common/Button";
import { DestinationTable } from "./components/DestinationTable";
import { DestinationFormModal } from "./components/DestinationFormModal";
import { useDestinations } from "../../DataManagers/destinationDataManager";
import { Destination } from "../../models/entity/Destination";
import { Region } from "../../models/entity/Region";
import { GenericLayout } from "../../components/layout/Layout";
import { logger } from "../../utils";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { DestinationFilters } from "./sections/DestinationFilters";

const log = logger.forSource('DestinationsPage');

export const Destinations: React.FC = () => {
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

  // Auto-retry once if initial fetch fails
  useEffect(() => {
    const attemptRetry = async () => {
      try {
        if (error && fetchAttempts < MAX_FETCH_ATTEMPTS) {
          setFetchAttempts((prev) => prev + 1);
          await refetch();
        }
      } catch (e) {
        log.error('Auto-retry for destinations failed', e as unknown);
      }
    };
    attemptRetry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const uniqueRegions = React.useMemo(() => {
    try {
      if (!Array.isArray(destinations)) return [];
      const byId = new Map<string, Region>();
      const byName = new Map<string, Region>();
      destinations.forEach((d) => {
        const r = d?.region;
        if (!r) return;
        if (r.id !== undefined && r.id !== null) {
          const key = String(r.id);
          if (!byId.has(key)) byId.set(key, r);
        } else if (r.name) {
          if (!byName.has(r.name)) byName.set(r.name, r);
        }
      });
      return [...byId.values(), ...byName.values()];
    } catch (e) {
      log.error('Error building uniqueRegions list', e as unknown);
      return [];
    }
  }, [destinations]);

  const handleAdd = () => {
    try {
      setEditingDestination(null);
      setFormData({ name: "", region: undefined, description: "", imageUrl: "" });
      setIsModalOpen(true);
    } catch (error) {
      log.error('Error in handleAdd', error as unknown);
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
      log.error('Error in handleEdit', error as unknown);
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
      log.error('Error saving destination', err as unknown);
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
        let matchesRegion = true;
        if (searchRegion) {
          const region = d.region;
          if (region) {
            const regionToken = region.id !== undefined && region.id !== null ? String(region.id) : `name:${region.name}`;
            matchesRegion = regionToken === searchRegion;
          } else {
            matchesRegion = false;
          }
        }
        return matchesName && matchesRegion;
      });
    } catch (error) {
      log.error('Error filtering destinations', error as unknown);
      return [];
    }
  }, [destinations, searchName, searchRegion]);

  // Layout props
  const buttons = (
    <Button onClick={handleAdd}>
      <Plus className="w-4 h-4 mr-2" />
      Add Destination
    </Button>
  );

  const filters = (
    <DestinationFilters
      searchName={searchName}
      setSearchName={setSearchName}
      searchRegion={searchRegion}
      setSearchRegion={setSearchRegion}
      searchStatus={searchStatus}
      setSearchStatus={setSearchStatus}
      uniqueRegions={uniqueRegions}
      exportData={filteredDestinations as Destination[]}
    />
  );

  const errorSection = error ? (
    <ErrorBanner
      message="Failed to load destinations. Please try again."
      onRetry={async () => {
        try {
          setFetchAttempts(0);
          await refetch();
        } catch (err) {
          log.error('Error retrying fetch', err as unknown);
        }
      }}
      className="mb-4"
    />
  ) : null;

  const table = (
    <DestinationTable
      destinations={filteredDestinations}
      loading={loading && !error}
      onEdit={handleEdit}
      renderStatus={(d: Destination & { status?: string }) => <StatusBadge status={d?.status} />}
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
};
