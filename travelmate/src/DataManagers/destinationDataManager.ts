import { useState, useEffect } from "react";
import { Destination } from "../models/entity/Destination";
import { destinationService } from "../services/destinationService";

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const result = await destinationService.getDestinations();
      setDestinations(result);
      setError(null);
    } catch (err) {
      setError("Failed to load destinations");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      fetchDestinations();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations,
  };
};
