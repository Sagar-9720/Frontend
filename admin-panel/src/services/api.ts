// API service for integrating with backend microservices
import { environmentHelper } from "../utils";

// Environment Configuration
export const BASE_URLS = {
  AUTH_SERVICE: environmentHelper.getAuthServiceUrl(),
  USER_SERVICE: environmentHelper.getUserServiceUrl(),
  TRIP_SERVICE: environmentHelper.getTripServiceUrl(),
  JOURNAL_SERVICE: environmentHelper.getJournalServiceUrl(),
};

// Centralized API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication Service Endpoints

  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    VALIDATE: "/validate",
    RESET_PASSWORD: "/reset-password",
    RESET_PASSWORD_REQUEST: "/reset-password-request",
    CHANGE_PASSWORD: "/change-password",
    UPDATE: "/update-user",
    USER_INFO: "/user-info",
    ALL_USERS: "/all-users",
    CHECK_EMAIL: "/check-email/:email",
    REGISTER_SUBADMIN: "/register-subadmin",
    VERIFY_EMAIL: "/verify-email",
    RESEND_VERIFICATION: "/resend-verification",
    DELETE_USER: "/delete-user/:userId",
    DELETE_REQUEST: "/delete-request",
    UPDATE_ROLE: "/update-role",
    GET_USER_NAME: "/get-user-name",
    GET_ALL_SUBADMINS: "/all-subadmins",
    DELETE_USER_REQUEST: "/all-delete-requested-users",
  },

  // Trip Service Endpoints
  TRIP: {
    TRIPS: "/trips",
    TRIP_BY_ID: "/trips/:id",
    TRIP_APPROVE: "/trips/approve/:requestId",
    TRIP_BY_DESTINATION: "/trips/by-destination",
    TRIP_BY_PRICE_RANGE:
      "/trips/by-price-range?startPrice=:start&endPrice=:end",
    TRIP_REQUESTS_BY_USER: "/trips/requests/user/:userId",
    TRIP_AUTO_DELETE: "/trips/auto-delete",
    ALL_TRIP_REQUESTS: "/trips/requests/all",
    TRIP_SUGGEST: "/trips/suggest?q=:query",
    TRIP_CREATE: "/trips",
    TRIP_UPDATE: "/trips",
    TRIP_DELETE: "/trips/:id",
    TRIP_REQUEST: "/trips/request",
    TRIP_GET_NAME: "/trips/get-trip-name",
  },

  // Dashboard Endpoints (served by Trip service in this setup)
  DASHBOARD: {
    OVERVIEW: "/dashboard/overview",
    USER_STATS: "/dashboard/user-stats",
    TRIP_STATS: "/dashboard/trip-stats",
    REVENUE_STATS: "/dashboard/revenue-stats",
    ANALYTICS: "/dashboard/analytics",
    RECENT_ACTIVITIES: "/dashboard/recent-activities",
    SYSTEM_HEALTH: "/dashboard/system-health",
    NOTIFICATIONS: "/dashboard/notifications",
  },

  // Destination Service Endpoints
  DESTINATION: {
    DESTINATIONS: "/destinations",
    DESTINATION_BY_ID: "/destinations/:id",
    DESTINATION_CREATE: "/destinations",
    DESTINATION_UPDATE: "/destinations",
    DESTINATION_DELETE: "/destinations/:id",
    DESTINATION_BY_COUNTRY: "/destinations/country/:countryId",
    DESTINATION_BY_REGION: "/destinations/region/:regionId",
    DESTINATION_SEARCH: "/destinations/search",
    DESTINATION_SUGGEST: "/destinations/suggest?q=:query",
  },

  // Region Service Endpoints
  REGION: {
    REGIONS: "/regions",
    REGION_BY_ID: "/regions/:id",
    REGION_CREATE: "/regions",
    REGION_UPDATE: "/regions/:id",
    REGION_DELETE: "/regions/:id",
  },

  // Country Service Endpoints
  COUNTRY: {
    COUNTRIES: "/countries",
    COUNTRY_BY_ID: "/countries/:id",
    COUNTRY_CREATE: "/countries",
    COUNTRY_UPDATE: "/countries/:id",
    COUNTRY_DELETE: "/countries/:id",
  },

  // Itinerary Service Endpoints
  ITINERARY: {
    ITINERARIES: "/itineraries",
    ITINERARY_BY_ID: "/itineraries/:id",
    ITINERARY_CREATE: "/itineraries",
    ITINERARY_UPDATE: "/itineraries",
    ITINERARY_DELETE: "/itineraries/:id",
    ITINERARIES_BY_DESTINATION: "/itineraries/destination/:destinationId",
    ITINERARY_SUGGEST: "/itineraries/suggest?keyword=:keyword",
  },

  // Itinerary Activity Service Endpoints
  ITINERARY_ACTIVITY: {
    ACTIVITIES: "/itinerary-activities",
    ACTIVITY_BY_ID: "/itinerary-activities/:id",
    ACTIVITY_CREATE: "/itinerary-activities",
    ACTIVITY_UPDATE: "/itinerary-activities/:id",
    ACTIVITY_DELETE: "/itinerary-activities/:id",
    ACTIVITY_SUGGEST: "/itinerary-activities/suggest?keyword=:keyword",
  },

  // Travel Journal Service Endpoints
  TRAVEL_JOURNAL: {
    JOURNALS: "/journals",
    JOURNAL_BY_ID: "/journals/:id",
    JOURNALS_BY_USER: "/journals/user/:userId",
    JOURNALS_BY_TRIP: "/journals/trip/:tripId",
    PUBLIC_JOURNALS: "/journals/public",
    JOURNALS_BY_TAG: "/journals/tag/:tag",
  },

  // Tags Service Endpoints
  TAG: {
    TAGS: "/tags",
    TAG_BY_ID: "/tags/:id",
    TAG_SUGGEST: "/tags/suggest?q=:query", // use ?q= for query
  },
} as const;

// URL Builder Helper Functions
export const buildJournalUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${BASE_URLS.JOURNAL_SERVICE}${endpoint}`;
  if (params) {
    url = replaceUrlParams(url, params);
  }
  return url;
};
export const buildAuthUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${BASE_URLS.AUTH_SERVICE}${endpoint}`;
  if (params) {
    url = replaceUrlParams(url, params);
  }
  return url;
};

export const buildUserUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${BASE_URLS.USER_SERVICE}${endpoint}`;
  if (params) {
    url = replaceUrlParams(url, params);
  }
  return url;
};

export const buildTripUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${BASE_URLS.TRIP_SERVICE}${endpoint}`;
  if (params) {
    url = replaceUrlParams(url, params);
  }
  return url;
};

// Helper function to replace URL parameters
export const replaceUrlParams = (
  url: string,
  params: Record<string, string>
): string => {
  let processedUrl = url;
  Object.entries(params).forEach(([key, value]) => {
    processedUrl = processedUrl.replace(`:${key}`, encodeURIComponent(value));
  });
  return processedUrl;
};

// Export all services for centralized access
export { authService } from "./authService";
export { userService } from "./userService";
export { tripService } from "./tripService";
export { dashboardService } from "./dashboardService";
export { itineraryService } from "./itineraryService";
export { regionService } from "./regionService";
export { travelJournalService } from "./travelJournalService";
export { countryService } from "./countryService";
export { uploadService } from "./uploadService";
export { destinationService } from "./destinationService";

