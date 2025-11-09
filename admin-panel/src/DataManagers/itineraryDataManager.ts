import { useResource, useMutationWithRefetch } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { itineraryService } from "../services/itineraryService";
import { Itinerary as BackendItinerary } from "../models/entity/Itinerary";
import { useCallback, useMemo } from 'react';

// UI type for Itinerary, matching all fields needed by the UI
export interface ItineraryUI {
  id: string;
  title: string;
  description: string;
  tripId: string;
  tripTitle?: string;
  duration: number;
  status?: "draft" | "pending" | "approved" | "rejected";
  isFeatured?: boolean;
  likes?: number;
  views?: number;
  createdBy?: string;
  createdAt?: string;
  activities?: string[];
  meals?: string[];
  accommodation?: string;
}

const mapBackendToUI = (data: BackendItinerary[]): ItineraryUI[] => (
  data.map((it: BackendItinerary) => ({
    id: ((it as unknown as { id?: string | number }).id ?? "").toString(),
    title: (it as unknown as { itineraryName?: string; title?: string }).itineraryName || (it as unknown as { title?: string }).title || "",
    description: (it as unknown as { description?: string }).description || "",
    tripId: (it as unknown as { tripId?: string | number }).tripId ? String((it as unknown as { tripId?: string | number }).tripId) : "",
    tripTitle: (it as unknown as { tripTitle?: string; trip?: { title?: string } }).tripTitle || ((it as unknown as { trip?: { title?: string } }).trip?.title ?? ""),
    duration: (it as unknown as { dayNumber?: number; duration?: number }).dayNumber || (it as unknown as { duration?: number }).duration || 1,
    status: (it as unknown as { status?: ItineraryUI['status'] }).status || "draft",
    isFeatured: (it as unknown as { isFeatured?: boolean }).isFeatured || false,
    likes: (it as unknown as { likes?: number }).likes || 0,
    views: (it as unknown as { views?: number }).views || 0,
    createdBy: (it as unknown as { createdBy?: string }).createdBy || "",
    createdAt: (it as unknown as { createdAt?: string }).createdAt || "",
    activities: (it as unknown as { activities?: string[] }).activities || [],
    meals: (it as unknown as { meals?: string[] }).meals || [],
    accommodation: (it as unknown as { accommodation?: string }).accommodation || "",
  }))
);

export const useItineraries = () => {
  const fetchFn = useCallback(async () => {
    const response = await itineraryService.getItineraries();
    return Array.isArray(response) ? response : [];
  }, []);

  const mapListFn = useCallback((raw: BackendItinerary[]) => mapBackendToUI(raw), []);

  const { data, loading, error, refetch } = useResource<ItineraryUI, BackendItinerary[]>({
    sourceName: 'ItineraryDataManager',
    fetchFn,
    mapListFn,
    isList: true,
    errorMessage: DATA_MANAGER.ERRORS.ITINERARIES,
  });

  const createItinerary = useMutationWithRefetch(
    async (payload: Partial<ItineraryUI>) => itineraryService.createItinerary(payload),
    refetch,
    'ItineraryDataManager'
  );
  const updateItinerary = useMutationWithRefetch(
    async (id: string, payload: Partial<ItineraryUI>) => itineraryService.updateItinerary(id, payload),
    refetch,
    'ItineraryDataManager'
  );

  return useMemo(() => ({
    itineraries: (data as ItineraryUI[]) || [],
    loading,
    error,
    refetch,
    createItinerary,
    updateItinerary,
  }), [data, loading, error, refetch, createItinerary, updateItinerary]);
};
