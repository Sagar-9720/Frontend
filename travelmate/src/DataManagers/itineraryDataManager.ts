import { useState, useEffect } from "react";
import { itineraryService } from "../services/itineraryService";
import { Itinerary as BackendItinerary } from "../models/entity/Itinerary";

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

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState<ItineraryUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await itineraryService.getItineraries();
      const data: BackendItinerary[] = response.data || [];
      // Map backend model to UI type
      const mapped: ItineraryUI[] = data.map((it: any) => ({
        id: (it.id ?? "").toString(),
        title: it.itineraryName || it.title || "",
        description: it.description || "",
        tripId: it.tripId ? it.tripId.toString() : "",
        tripTitle: it.tripTitle || (it.trip ? it.trip.title : ""),
        duration: it.dayNumber || it.duration || 1,
        status: it.status || "draft",
        isFeatured: it.isFeatured || false,
        likes: it.likes || 0,
        views: it.views || 0,
        createdBy: it.createdBy || "",
        createdAt: it.createdAt || "",
        activities: it.activities || [],
        meals: it.meals || [],
        accommodation: it.accommodation || "",
      }));
      setItineraries(mapped);
      setError(null);
    } catch (err) {
      setError("Failed to load itineraries");
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    setLoading(true);
    debounceTimer = setTimeout(() => {
      fetchItineraries();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  // Mutation handlers
  const createItinerary = async (payload: Partial<ItineraryUI>) => {
    await itineraryService.createItinerary(payload);
    await fetchItineraries();
  };

  const updateItinerary = async (id: string, payload: Partial<ItineraryUI>) => {
    await itineraryService.updateItinerary(id, payload);
    await fetchItineraries();
  };

  const deleteItinerary = async (id: string) => {
    await itineraryService.deleteItinerary(id);
    await fetchItineraries();
  };

  return {
    itineraries,
    loading,
    error,
    refetch: fetchItineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary,
  };
};
