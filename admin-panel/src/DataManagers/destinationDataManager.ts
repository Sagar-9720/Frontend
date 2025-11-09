import { useResource, useMutationWithRefetch } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { Destination } from "../models/entity/Destination";
import { destinationService } from "../services/destinationService";

export const useDestinations = () => {
  const { data, loading, error, refetch, setData } = useResource<Destination, Destination[]>({
    sourceName: 'DestinationDataManager',
    fetchFn: async () => {
      const result = await destinationService.getDestinations();
      return Array.isArray(result) ? result : [];
    },
    mapListFn: (raw) => raw as Destination[],
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.DESTINATIONS,
  });

  const createDestination = useMutationWithRefetch<[Partial<Destination>], Destination>(
    async (payload) => destinationService.createDestination(payload),
    refetch,
    'DestinationDataManager'
  );
  const updateDestination = useMutationWithRefetch<[string, Partial<Destination>], Destination>(
    async (id, payload) => destinationService.updateDestination(id, payload),
    refetch,
    'DestinationDataManager'
  );

  return {
    destinations: (data as Destination[]) || [],
    loading,
    error,
    refetch,
    createDestination,
    updateDestination,
    setDestinations: setData,
  };
};
