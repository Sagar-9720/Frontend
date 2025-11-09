import { useResource } from '../utils/dataManagerFactory';
import { DATA_MANAGER } from '../utils/constants/dataManager';
import { DashboardData } from '../models/Dashboard';
import { dashboardService } from '../services/dashboardService';

export const useDashboardData = () => {
  const fallback: DashboardData = {
    mostCommented: { trips: [], itineraries: [], destinations: [] },
    mostLiked: { trips: [], itineraries: [], destinations: [] },
    mostSaved: { trips: [], itineraries: [], destinations: [] },
    stats: [
      { name: 'Users', value: '0', change: '0%', icon: 'Users', color: 'bg-blue-600' },
      { name: 'Trips', value: '0', change: '0%', icon: 'Route', color: 'bg-green-600' },
      { name: 'Destinations', value: '0', change: '0%', icon: 'MapPin', color: 'bg-purple-600' }
    ],
    recentActivities: [],
  };

  const { data, loading, error, refetch } = useResource<DashboardData, DashboardData>({
    sourceName: 'DashboardDataManager',
    fetchFn: async (): Promise<DashboardData> => {
      const result = await dashboardService.getOverview();
      return (result as DashboardData) || fallback;
    },
    mapFn: (raw) => raw,
    fallback,
    isList: false,
    errorMessage: DATA_MANAGER.ERRORS.DASHBOARD,
    autoRetry: DATA_MANAGER.AUTO_RETRY,
  });

  return { dashboardData: data as DashboardData | null, loading, error, refetch };
};
