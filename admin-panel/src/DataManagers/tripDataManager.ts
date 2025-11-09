// Trip Data Manager - provides trips list state via generic resource hook
import { useResource } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { Trip } from '../models/entity/Trip';
import { tripService } from '../services/tripService';
import { logger } from '../utils';

const log = logger.forSource('TripDataManager');

export const useTrips = () => {
  const { data, loading, error, refetch } = useResource<Trip, { success?: boolean; data?: Trip[]; error?: string }>({
    sourceName: 'TripDataManager',
    fetchFn: async () => {
      const result = await tripService.getTrips();
      // Normalize shape to always include data[]
      const arr = Array.isArray(result) ? result : [];
      log.info('Fetched trips', { count: arr.length });
      return { data: arr};
    },
    mapListFn: (raw) => Array.isArray(raw.data) ? raw.data : [],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.TRIPS,
    autoRetry: DATA_MANAGER.AUTO_RETRY,
    debounceMs: DATA_MANAGER.DEBOUNCE_MS,
  });

  return {
    trips: Array.isArray(data) ? (data as Trip[]) : [],
    loading,
    error,
    refetch,
  };
};
