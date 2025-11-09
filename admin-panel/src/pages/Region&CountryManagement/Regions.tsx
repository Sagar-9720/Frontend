import React, { useState, useEffect, useCallback } from "react";
import { RegionTable } from "./components/RegionTable";
import { RegionFormModal } from "./components/RegionFormModal";
import { CountryFormModal } from "./components/CountryFormModal";
import { Region } from "../../models/entity/Region";
import { Country } from "../../models/entity/Country";
import { CountryTable } from "./components/CountryTable";
import { GenericLayout } from "../../components/layout/Layout";
import { useRegionsAndCountries } from "../../DataManagers/regionDataManager";
import { countryService } from "../../services/countryService";
import { logger } from "../../utils";
import { PaneSwitch } from "../../components/common/PaneSwitch";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { RegionFilters } from "./sections/RegionFilters";
import { CountryFilters } from "./sections/CountryFilters";

const log = logger.forSource('RegionsPage');

const Regions: React.FC = () => {
  // Safe hook usage with error handling
  const regionData = useRegionsAndCountries();
  const {
    regions = [],
    regionLoading: isLoading = false,
    refetchRegions,
    createRegion,
    updateRegion,
    createCountry,
    updateCountry,
  } = regionData || {};

  const [countries, setCountries] = useState<Country[]>([]); // used for region form select
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    countryId: "",
    description: "",
    isActive: true,
  });
  // Country table state
  const [countryTable, setCountryTable] = useState<Country[]>([]);
  const [countryTableLoading, setCountryTableLoading] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryFormData, setCountryFormData] = useState({ name: "" });
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<"region" | "country">("region");
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 1;

  const fetchCountries = useCallback(async () => {
    try {
      setFetchError(null);
      const list = (await countryService.getCountries()) as unknown;
      setCountries(Array.isArray(list) ? list : []);
    } catch (error) {
      log.error('Error fetching countries', error as unknown);
      setFetchError("Failed to fetch countries");
      setCountries([]);
    }
  }, []);

  const fetchCountryTable = useCallback(async () => {
    try {
      setCountryTableLoading(true);
      setFetchError(null);
      const list = (await countryService.getCountries()) as unknown;
      setCountryTable(Array.isArray(list) ? list : []);
    } catch (error) {
      log.error('Error fetching country table', error as unknown);
      setFetchError("Failed to fetch country table");
      setCountryTable([]);
    } finally {
      setCountryTableLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (fetchAttempts < MAX_FETCH_ATTEMPTS) {
          setFetchAttempts((prev) => prev + 1);
          await Promise.all([fetchCountries(), fetchCountryTable()]);
        }
      } catch (error) {
        log.error('Error initializing data', error as unknown);
        setFetchError('Failed to initialize data');
      }
    };

    initializeData();
  }, [fetchAttempts, fetchCountries, fetchCountryTable]);

  // Filter regions based on search term
  const filteredRegions = React.useMemo(() => {
    try {
      if (!Array.isArray(regions)) return [];
      if (searchTerm.trim() === "") return regions;
      return regions.filter(
        (region) =>
          region?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          region?.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      log.error('Error filtering regions', error as unknown);
      return [];
    }
  }, [searchTerm, regions]);

  // Region handlers with error protection
  const handleAdd = () => {
    try {
      setEditingRegion(null);
      setFormData({
        name: "",
        countryId: "",
        description: "",
        isActive: true,
      });
      setIsModalOpen(true);
    } catch (error) {
      log.error('Error opening add region modal', error as unknown);
    }
  };

  const handleEdit = (region: Region) => {
    try {
      if (!region) return;
      setEditingRegion(region);
      setFormData({
        name: region.name || "",
        countryId: region.country?.id?.toString() || "",
        description: "",
        isActive: true,
      });
      setIsModalOpen(true);
    } catch (error) {
      log.error('Error opening edit region modal', error as unknown);
    }
  };

  type RegionFormValues = typeof formData;
  type CountryFormValues = { name: string };

  const onRegionSubmit = async (data: Record<string, unknown>) => {
    const values = data as RegionFormValues;
    await handleSubmit(values);
  };

  const onCountrySubmit = async (data: Record<string, unknown>) => {
    const values = data as CountryFormValues;
    await handleCountrySubmit(values);
  };

  const handleSubmit = async (values: typeof formData) => {
    try {
      if (!values.name.trim()) {
        alert('Region name is required');
        return;
      }
      const payload: Partial<Region> = {
        name: values.name,
        // backend may support these optional fields; kept for future compatibility
        countryId: Number(values.countryId) || undefined,
        description: values.description,
        isActive: values.isActive,
      } as unknown as Partial<Region>;

      if (editingRegion?.id !== undefined) {
        if (updateRegion) await updateRegion(editingRegion.id.toString(), payload);
      } else {
        if (createRegion) await createRegion(payload);
      }
      setFetchAttempts(0);
      await refetchRegions?.();
      setIsModalOpen(false);
    } catch (error) {
      log.error('Error submitting region form', error as unknown);
      alert('Failed to save region. Please try again.');
    }
  };

  // Country handlers with error protection
  const handleCountryAdd = () => {
    try {
      setEditingCountry(null);
      setCountryFormData({ name: "" });
      setIsCountryModalOpen(true);
    } catch (error) {
      log.error('Error opening add country modal', error as unknown);
    }
  };

  const handleCountryEdit = (country: Country) => {
    try {
      if (!country) return;
      setEditingCountry(country);
      setCountryFormData({ name: country.name || "" });
      setIsCountryModalOpen(true);
    } catch (error) {
      log.error('Error opening edit country modal', error as unknown);
    }
  };

  // Safe filtered countries with error handling
  const filteredCountries = React.useMemo(() => {
    try {
      if (!Array.isArray(countryTable)) return [];
      if (countrySearchTerm.trim() === "") return countryTable;
      return countryTable.filter((country) =>
        country?.name?.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
    } catch (error) {
      log.error('Error filtering countries', error as unknown);
      return [];
    }
  }, [countrySearchTerm, countryTable]);

  const handleCountrySubmit = async (values: { name: string }) => {
    try {
      if (!values.name.trim()) {
        alert('Country name is required');
        return;
      }
      const payload: Partial<Country> = { name: values.name };
      if (editingCountry?.id !== undefined) {
        await updateCountry?.(editingCountry.id.toString(), payload);
      } else {
        await createCountry?.(payload);
      }
      setIsCountryModalOpen(false);
      setFetchAttempts(0);
      await fetchCountryTable();
    } catch (error) {
      log.error('Error submitting country form', error as unknown);
      alert('Failed to save country. Please try again.');
    }
  };

  // Error section with safe error handling
  const errorSection = fetchError ? (
    <ErrorBanner
      message={fetchError}
      onRetry={async () => {
        try {
          setFetchError(null);
          setFetchAttempts(0);
          await Promise.all([refetchRegions?.(), fetchCountries(), fetchCountryTable()]);
        } catch (err) {
          log.error('Error retrying fetch', err as unknown);
        }
      }}
      className="mb-4"
    />
  ) : null;

  // Filters with error protection
  const regionFilters = (
    <RegionFilters
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onAdd={handleAdd}
      data={filteredRegions}
    />
  );

  const countryFilters = (
    <CountryFilters
      searchTerm={countrySearchTerm}
      setSearchTerm={setCountrySearchTerm}
      onAdd={handleCountryAdd}
      data={filteredCountries}
    />
  );

  const regionTablePane = (
    <RegionTable
      regions={filteredRegions}
      loading={isLoading}
      onEdit={handleEdit}
    />
  );

  const countryTablePane = (
    <CountryTable
      countries={filteredCountries}
      loading={countryTableLoading}
      onEdit={handleCountryEdit}
    />
  );

  const table = (
    <>
      <PaneSwitch
        active={activePane}
        items={[{ key: 'region', label: 'Region Management' }, { key: 'country', label: 'Country Management' }]}
        onChange={(k) => setActivePane(k as 'region'|'country')}
      />
      {activePane === "region" ? regionTablePane : countryTablePane}
    </>
  );

  const titleConst = activePane === 'region' ? PAGE_TITLES.REGION_MANAGEMENT : PAGE_TITLES.COUNTRY_MANAGEMENT;
  const subtitleConst = activePane === 'region' ? PAGE_SUBTITLES.REGION_MANAGEMENT : PAGE_SUBTITLES.COUNTRY_MANAGEMENT;

  const modal = (
    <>
      {activePane === 'region' && isModalOpen && (
        <RegionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={onRegionSubmit}
          submitting={false}
          editingRegion={editingRegion}
          formData={formData as unknown as Record<string, unknown>}
          setFormData={setFormData as unknown as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
          countries={countries}
        />
      )}
      {activePane === 'country' && isCountryModalOpen && (
        <CountryFormModal
          isOpen={isCountryModalOpen}
          onClose={() => setIsCountryModalOpen(false)}
          onSubmit={onCountrySubmit}
          submitting={false}
          formData={countryFormData as unknown as Record<string, unknown>}
          setFormData={setCountryFormData as unknown as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
        />
      )}
    </>
  );

  return (
    <GenericLayout
      title={titleConst}
      subtitle={subtitleConst}
      filters={activePane === "region" ? regionFilters : countryFilters}
      buttons={null}
      errorSection={errorSection}
      table={table}
      modal={modal}
    />
  );
};

export default Regions;
