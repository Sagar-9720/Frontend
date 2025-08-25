import { useState, useEffect } from 'react';
import { DashboardData } from '../models/Dashboard';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getOverview();
      setDashboardData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>;
    debounceTimer = setTimeout(() => {
      fetchDashboardData();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, []);

  return { dashboardData, loading, error, refetch: fetchDashboardData };
};
