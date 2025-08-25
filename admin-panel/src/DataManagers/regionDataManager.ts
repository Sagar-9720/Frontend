import { useState, useEffect } from "react";
import { Region } from "../models/entity/Region";
import { Country } from "../models/entity/Country";
import { regionService } from "../services/regionService";
import { countryService } from "../services/countryService";
import { logger } from "../utils";

export const useRegionsAndCountries = () => {
  // Region state
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionLoading, setRegionLoading] = useState(true);
  const [regionError, setRegionError] = useState<string | null>(null);

  // Country state
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [countryError, setCountryError] = useState<string | null>(null);

  // Fetch regions
  const fetchRegions = async () => {
    setRegionLoading(true);
    try {
      const result = await regionService.getRegions();
      logger.info("Fetched regions successfully", result.data);
      setRegions(result.data);
      setRegionError(null);
    } catch (err) {
      setRegionError("Failed to load regions");
      setRegions([]);
    } finally {
      setRegionLoading(false);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    setCountryLoading(true);
    try {
      const result = await countryService.getCountries();
      logger.info("Fetched countries successfully", result.data);
      setCountries(result.data);
      setCountryError(null);
    } catch (err) {
      setCountryError("Failed to load countries");
      setCountries([]);
    } finally {
      setCountryLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    setRegionLoading(true);
    setCountryLoading(true);
    debounceTimer = setTimeout(() => {
      fetchRegions();
      fetchCountries();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  // Region mutation handlers
  const createRegion = async (payload: Partial<Region>) => {
    await regionService.createRegion(payload);
    await fetchRegions();
  };

  const updateRegion = async (id: string, payload: Partial<Region>) => {
    await regionService.updateRegion(id, payload);
    await fetchRegions();
  };

  // Country mutation handlers
  const createCountry = async (payload: Partial<Country>) => {
    await countryService.createCountry(payload);
    await fetchCountries();
  };

  const updateCountry = async (id: string, payload: Partial<Country>) => {
    await countryService.updateCountry(id, payload);
    await fetchCountries();
  };

  const getCountry = async (id: string) => {
    return await countryService.getCountryById(id);
  };

  return {
    regions,
    regionLoading,
    regionError,
    refetchRegions: fetchRegions,
    createRegion,
    updateRegion,

    countries,
    countryLoading,
    countryError,
    refetchCountries: fetchCountries,
    createCountry,
    updateCountry,
    getCountry,
  };
};
