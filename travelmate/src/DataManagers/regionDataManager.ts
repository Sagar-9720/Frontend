import { useState, useEffect } from 'react';
import { Region } from '../models/entity/Region';
import { regionService } from '../services/regionService';

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const result = await regionService.getRegions();
      setRegions(result);
      setError(null);
    } catch (err) {
      setError('Failed to load regions');
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      let debounceTimer: ReturnType<typeof setTimeout>;
      setLoading(true);
      debounceTimer = setTimeout(() => {
        fetchRegions();
      }, 300);
      return () => {
        clearTimeout(debounceTimer);
      };
    }, []);

  // Mutation handlers
  const createRegion = async (payload: Partial<Region>) => {
    await regionService.createRegion(payload);
    await fetchRegions();
  };

  const updateRegion = async (id: string, payload: Partial<Region>) => {
    await regionService.updateRegion(id, payload);
    await fetchRegions();
  };

  const deleteRegion = async (id: string) => {
    await regionService.deleteRegion(id);
    await fetchRegions();
  };

  return {
    regions,
    loading,
    error,
    refetch: fetchRegions,
    createRegion,
    updateRegion,
    deleteRegion,
  };
};
