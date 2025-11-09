import { useResource, useMutationWithRefetch } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { Region } from "../models/entity/Region";
import { Country } from "../models/entity/Country";
import { regionService } from "../services/regionService";
import { countryService } from "../services/countryService";

export const useRegionsAndCountries = () => {
  const regionsRes = useResource<Region, Region[]>({
    sourceName: 'RegionDataManager:Regions',
    fetchFn: async () => regionService.getRegions() as Promise<Region[]>,
    mapListFn: (raw) => Array.isArray(raw) ? raw : [],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.REGIONS,
  });
  const countriesRes = useResource<Country, Country[]>({
    sourceName: 'RegionDataManager:Countries',
    fetchFn: async () => countryService.getCountries() as Promise<Country[]>,
    mapListFn: (raw) => Array.isArray(raw) ? raw : [],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.COUNTRIES,
  });

  const createRegion = useMutationWithRefetch(
    async (payload: Partial<Region>) => regionService.createRegion(payload),
    regionsRes.refetch,
    'RegionDataManager:Regions'
  );
  const updateRegion = useMutationWithRefetch(
    async (id: string, payload: Partial<Region>) => regionService.updateRegion(id, payload),
    regionsRes.refetch,
    'RegionDataManager:Regions'
  );
  const createCountry = useMutationWithRefetch(
    async (payload: Partial<Country>) => countryService.createCountry(payload),
    countriesRes.refetch,
    'RegionDataManager:Countries'
  );
  const updateCountry = useMutationWithRefetch(
    async (id: string, payload: Partial<Country>) => countryService.updateCountry(id, payload),
    countriesRes.refetch,
    'RegionDataManager:Countries'
  );
  const getCountry = async (id: string) => countryService.getCountryById(id);

  return {
    regions: (regionsRes.data as Region[]) || [],
    regionLoading: regionsRes.loading,
    regionError: regionsRes.error,
    refetchRegions: regionsRes.refetch,
    createRegion,
    updateRegion,

    countries: (countriesRes.data as Country[]) || [],
    countryLoading: countriesRes.loading,
    countryError: countriesRes.error,
    refetchCountries: countriesRes.refetch,
    createCountry,
    updateCountry,
    getCountry,
  };
};
