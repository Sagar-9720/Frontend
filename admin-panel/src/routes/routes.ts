// Centralized route constants for the application.
// Use these constants across the app (components, navigation, tests) to avoid
// hard-to-find string duplication and to keep routes consistent.

export const ROUTES = {
  // Authentication
  LOGIN: '/login',
  // Root landing (redirects to dashboard)
  ROOT: '/',

  // Main app pages
  DASHBOARD: '/dashboard',
  SUB_ADMINS: '/sub-admins',
  USERS: '/users',
  REGIONS: '/regions',
  DESTINATIONS: '/destinations',
  TRIPS: '/trips',
  ITINERARIES: '/itineraries',
  TRAVEL_JOURNALS: '/travel-journals',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export default ROUTES;

