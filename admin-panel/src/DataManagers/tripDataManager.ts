import { useState, useEffect } from "react";
import { Trip } from "../models/entity/Trip";
import { tripService } from "../services/tripService";

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const result = await tripService.getTrips();
      if (result.success) {
        setTrips(result.data);
        setError(null);
      } else {
        setTrips([]);
        setError(result.error || "Failed to load trips");
      }
    } catch (err) {
      setError("Failed to load trips");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      fetchTrips();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  return { trips, loading, error, refetch: fetchTrips };
};
