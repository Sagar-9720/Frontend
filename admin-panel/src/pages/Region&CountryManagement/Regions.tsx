import React, { useState, useEffect, useMemo } from "react";
import { RegionTable } from "./components/RegionTable";
import { RegionFormModal } from "./components/RegionFormModal";
import { CountryFormModal } from "./components/CountryFormModal";
import { Region } from "../../models/entity/Region";
import { Country } from "../../models/entity/Country";
import { CountryTable } from "./components/CountryTable";
import { GenericLayout } from "../../components/layout/Layout";
import { useRegionsAndCountries } from "../../DataManagers/regionDataManager";
import { logger } from "../../utils";
import { PaneSwitch } from "../../components/common/PaneSwitch";
import { PAGE_TITLES, PAGE_SUBTITLES } from "../../utils";
import { RegionFilters } from "./sections/RegionFilters";
import { CountryFilters } from "./sections/CountryFilters";
import { ResourceGate } from "../../components/common/ResourceGate";
import { usePageResourceState } from "../../hooks/usePageResourceState";

const log = logger.forSource('RegionsPage');

const Regions: React.FC = () => {
  const regionData = useRegionsAndCountries();
  const debug = true;
  const {
    regions = [],
    regionLoading,
    regionError,
    regionStatus,
    regionHasFetched,
    refetchRegions,
    countries = [],
    countryLoading,
    countryError,
    countryStatus,
    countryHasFetched,
    refetchCountries,
    createRegion,
    updateRegion,
    createCountry,
    updateCountry,
  } = regionData || {};

  if (debug) {
    log.info('Initial data snapshot', {
      regionsLen: regions.length,
      regionStatus,
      regionHasFetched,
      countriesLen: countries.length,
      countryStatus,
      countryHasFetched,
    });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    countryId: "",
    description: "",
    isActive: true,
  });
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryFormData, setCountryFormData] = useState({ name: "" });
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [activePane, setActivePane] = useState<"region" | "country">("region");

  // Derive page resource states using shared hook
  const regionPage = usePageResourceState({ status: regionStatus, hasFetched: regionHasFetched, error: regionError }, regions);
  const countryPage = usePageResourceState({ status: countryStatus, hasFetched: countryHasFetched, error: countryError }, countries);

  // Diagnostics: fires when underlying data or status changes
  useEffect(() => {
    if (!debug) return;
    log.info('Regions page state change', {
      regionsLen: regions.length,
      regionStatus,
      regionHasFetched,
      regionInitialLoading: regionPage.initialLoading,
      regionShowError: regionPage.showError,
      regionReady: regionPage.ready,
      regionIsEmpty: regionPage.isEmpty,
      countriesLen: countries.length,
      countryStatus,
      countryHasFetched,
      countryInitialLoading: countryPage.initialLoading,
      countryShowError: countryPage.showError,
      countryReady: countryPage.ready,
      countryIsEmpty: countryPage.isEmpty,
      activePane,
    });
  }, [debug, regions, regionStatus, regionHasFetched, regionPage, countries, countryStatus, countryHasFetched, countryPage, activePane]);

  // Log search term changes (region)
  useEffect(() => { if (debug) log.info('Region searchTerm changed', { searchTerm }); }, [debug, searchTerm]);
  // Log country search term changes
  useEffect(() => { if (debug) log.info('Country searchTerm changed', { countrySearchTerm }); }, [debug, countrySearchTerm]);

  // Filter regions based on search term
  const filteredRegions = useMemo(() => {
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
      if (debug) log.info('Open region add modal');
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
      if (debug) log.info('Open region edit modal', { id: region.id, name: region.name });
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
      if (debug) log.info('Region submit start', { editing: Boolean(editingRegion), payload });
      if (editingRegion?.id !== undefined) {
        if (updateRegion) await updateRegion(editingRegion.id.toString(), payload);
      } else {
        if (createRegion) await createRegion(payload);
      }
      await refetchRegions?.();
      setIsModalOpen(false);
      if (debug) log.info('Region submit success');
    } catch (error) {
      log.error('Error submitting region form', error as unknown);
      alert('Failed to save region. Please try again.');
      if (debug) log.info('Region submit failure', { error });
    }
  };

  // Country handlers with error protection
  const handleCountryAdd = () => {
    try {
      setEditingCountry(null);
      setCountryFormData({ name: "" });
      setIsCountryModalOpen(true);
      if (debug) log.info('Open country add modal');
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
      if (debug) log.info('Open country edit modal', { id: country.id, name: country.name });
    } catch (error) {
      log.error('Error opening edit country modal', error as unknown);
    }
  };

  // Safe filtered countries with error handling
  const filteredCountries = useMemo(() => {
    try {
      if (!Array.isArray(countries)) return [];
      if (countrySearchTerm.trim() === "") return countries;
      return countries.filter((country) =>
        country?.name?.toLowerCase().includes(countrySearchTerm.toLowerCase())
      );
    } catch (error) {
      log.error('Error filtering countries', error as unknown);
      return [];
    }
  }, [countrySearchTerm, countries]);

  const handleCountrySubmit = async (values: { name: string }) => {
    try {
      if (!values.name.trim()) {
        alert('Country name is required');
        return;
      }
      const payload: Partial<Country> = { name: values.name };
      if (debug) log.info('Country submit start', { editing: Boolean(editingCountry), payload });
      if (editingCountry?.id !== undefined) {
        await updateCountry?.(editingCountry.id.toString(), payload);
      } else {
        await createCountry?.(payload);
      }
      setIsCountryModalOpen(false);
      await refetchCountries?.();
      if (debug) log.info('Country submit success');
    } catch (error) {
      log.error('Error submitting country form', error as unknown);
      alert('Failed to save country. Please try again.');
      if (debug) log.info('Country submit failure', { error });
    }
  };

  // Error section with safe error handling
  // We now rely on ResourceGate for error display, so no standalone errorSection.
  const errorSection = null;

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
    <ResourceGate
      loading={regionPage.initialLoading}
      error={regionError || null}
      showError={regionPage.showError}
      onRetry={refetchRegions}
    >
      <RegionTable
        regions={filteredRegions}
        loading={regionLoading && !regionPage.initialLoading}
        onEdit={handleEdit}
      />
    </ResourceGate>
  );

  const countryTablePane = (
    <ResourceGate
      loading={countryPage.initialLoading}
      error={countryError || null}
      showError={countryPage.showError}
      onRetry={refetchCountries}
    >
      <CountryTable
        countries={filteredCountries}
        loading={countryLoading && !countryPage.initialLoading}
        onEdit={handleCountryEdit}
      />
    </ResourceGate>
  );

  const handlePaneChange = (k: string) => {
    setActivePane(k as 'region' | 'country');
    if (debug) log.info('Pane switched', { pane: k });
  };

  const table = (
    <>
      <PaneSwitch
        active={activePane}
        items={[{ key: 'region', label: 'Region Management' }, { key: 'country', label: 'Country Management' }]}
        onChange={handlePaneChange}
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
      loading={activePane === 'region' ? regionPage.initialLoading : countryPage.initialLoading}
      table={table}
      modal={modal}
    />
  );
};

export default Regions;
