// Shared constants & types for DataManager hooks
// Centralizes retry, debounce, and user-facing error strings.

export const DATA_MANAGER = {
  DEBOUNCE_MS: 300,
  AUTO_RETRY: 1,
  ERRORS: {
    DASHBOARD: 'Failed to load dashboard data',
    DESTINATIONS: 'Failed to load destinations',
    ITINERARIES: 'Failed to load itineraries',
    REGIONS: 'Failed to load regions',
    COUNTRIES: 'Failed to load countries',
    SUBADMINS: 'Failed to fetch sub-admins',
    JOURNALS: 'Failed to load travel journals',
    TRIPS: 'Failed to load trips',
    USERS: 'Failed to fetch users',
    DELETE_REQUESTS: 'Failed to fetch delete requests'
  } as const,
  // Optional default numeric/timeouts (extend later if needed)
  TIMEOUTS: {
    FETCH: 15000, // ms
  } as const,
} as const;

export type DataManagerErrorKey = keyof typeof DATA_MANAGER.ERRORS;

// Generic fallback builders (used if a hook wants a skeleton)
export const DATA_FALLBACKS = {
  DASHBOARD: () => ({
    mostCommented: { trips: [], itineraries: [], destinations: [] },
    mostLiked: { trips: [], itineraries: [], destinations: [] },
    mostSaved: { trips: [], itineraries: [], destinations: [] },
    stats: [
      { name: 'Users', value: '0', change: '0%', icon: 'Users', color: 'bg-blue-600' },
      { name: 'Trips', value: '0', change: '0%', icon: 'Route', color: 'bg-green-600' },
      { name: 'Destinations', value: '0', change: '0%', icon: 'MapPin', color: 'bg-purple-600' }
    ],
    recentActivities: [],
  }),
} as const;

export type DashboardFallbackType = ReturnType<typeof DATA_FALLBACKS.DASHBOARD>;
