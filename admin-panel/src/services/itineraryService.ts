// Itinerary Service - Handles all itinerary-related API calls
import { API_ENDPOINTS, buildTripUrl, replaceUrlParams } from "./api";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient('ItineraryService');

export const itineraryService = {
  getItineraries: (params?: Record<string,string|number|boolean>) => client.get(withQuery(buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARIES), params)),
  getItinerary: (id: string) => client.get(buildTripUrl(replaceUrlParams(API_ENDPOINTS.ITINERARY.ITINERARY_BY_ID, { id }))),
  createItinerary: (data: unknown) => client.post(buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARY_CREATE), data),
  updateItinerary: (id: string, data: unknown) => client.put(buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARY_UPDATE, { id }), data),
  getItinerariesByDestination: (destinationId: string) => client.get(buildTripUrl(replaceUrlParams(API_ENDPOINTS.ITINERARY.ITINERARIES_BY_DESTINATION, { destinationId }))),
  suggestItineraries: (keyword: string) => client.get(buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARY_SUGGEST.replace(":keyword", encodeURIComponent(keyword)))),
};
