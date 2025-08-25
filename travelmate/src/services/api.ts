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
    REGISTER: "/register",
    REFRESH: "/refresh",
    VALIDATE: "/validate",
    RESET_PASSWORD: "/reset-password",
    RESET_PASSWORD_REQUEST: "/reset-password-request",
    CHANGE_PASSWORD: "/change-password",
    UPDATE: "/update-user",
    USER_INFO: "/user-info",
    CHECK_EMAIL: "/check-email/:email",
    VERIFY_EMAIL: "/verify-email",
    RESEND_VERIFICATION: "/resend-verification",
    DELETE_REQUEST: "/delete-request",
    GET_USER_NAME: "/get-user-name",
  },

  // Trip Service Endpoints
  TRIP: {
    TRIPS: "/trips",
    TRIP_BY_ID: "/trips/:id",
    TRIP_BY_DESTINATION: "/trips/by-destination",
    TRIP_BY_PRICE_RANGE:
      "/trips/by-price-range?startPrice=:start&endPrice=:end",
    TRIP_SUGGEST: "/trips/suggest?q=:query",
    TRIP_REQUEST: "/trips/request",
    TRIP_GET_NAME: "/trips/get-trip-name",
  },

  // Destination Service Endpoints
  DESTINATION: {
    DESTINATIONS: "/destinations",
    DESTINATION_BY_ID: "/destinations/:id",
    DESTINATION_BY_COUNTRY: "/destinations/country/:countryId",
    DESTINATION_BY_REGION: "/destinations/region/:regionId",
    DESTINATION_SEARCH: "/destinations/search",
    DESTINATION_SUGGEST: "/destinations/suggest?q=:query",
  },

  // Region Service Endpoints
  REGION: {
    REGIONS: "/regions",
    REGION_BY_ID: "/regions/:id",
  },

  // Country Service Endpoints
  COUNTRY: {
    COUNTRIES: "/countries",
    COUNTRY_BY_ID: "/countries/:id",
  },

  // Itinerary Service Endpoints
  ITINERARY: {
    ITINERARIES: "/itineraries",
    ITINERARY_BY_ID: "/itineraries/:id",
    ITINERARIES_BY_DESTINATION: "/itineraries/destination/:destinationId",
    ITINERARY_SUGGEST: "/itineraries/suggest?keyword=:keyword",
  },

  // Itinerary Activity Service Endpoints
  ITINERARY_ACTIVITY: {
    ACTIVITIES: "/itinerary-activities",
    ACTIVITY_BY_ID: "/itinerary-activities/:id",
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
    TAG_SUGGEST: "/tags/suggest", // use ?q= for query
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
export { itineraryService } from "./itineraryService";
export { regionService } from "./regionService";
export { travelJournalService } from "./travelJournalService";
export { countryService } from "./countryService";
export { uploadService } from "./uploadService";
export { TagService } from "./tagService";
export { destinationService } from "./destinationService";

// Service instances for easy access
export default {
  auth: () => import("./authService").then((m) => m.authService),
  user: () => import("./userService").then((m) => m.userService),
  trip: () => import("./tripService").then((m) => m.tripService),
  itinerary: () => import("./itineraryService").then((m) => m.itineraryService),
  region: () => import("./regionService").then((m) => m.regionService),
  travelJournal: () =>
    import("./travelJournalService").then((m) => m.travelJournalService),
  country: () => import("./countryService").then((m) => m.countryService),
  upload: () => import("./uploadService").then((m) => m.uploadService),
  tag: () => import("./tagService").then((m) => m.TagService),
  destination: () =>
    import("./destinationService").then((m) => m.destinationService),
};
