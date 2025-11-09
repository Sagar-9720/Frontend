// Trip Service - Handles all trip-related API calls integrating with backend microservices
import { API_ENDPOINTS, buildTripUrl } from "./api";
import type { Trip, TripPayLoad } from "../models";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient("TripService");

export const tripService = {
  // Trip CRUD operations
  getTrips: (params?: Record<string, string | number | boolean>) =>
    client.get(withQuery(buildTripUrl(API_ENDPOINTS.TRIP.TRIPS), params)),
  getTripById: (id: string) =>
    client.get(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_ID, { id })),
  createTrip: (data: TripPayLoad) =>
    client.post(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_CREATE), data),
  updateTrip: (id: string, data: TripPayLoad) =>
    client.put(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_UPDATE, { id }), data),
  deleteTrip: (id: string) =>
    client.del(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_ID, { id })),

  // Get trips by destination name
  getTripsByDestinationName: (destinationName: string): Promise<Trip[]> =>
    client.get(
      withQuery(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_DESTINATION), {
        destinationName,
      })
    ),

  // Get trips by price range
  getTripsByPriceRange: (
    startPrice: number,
    endPrice: number
  ): Promise<Trip[]> =>
    client.get(
      withQuery(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_PRICE_RANGE), {
        startPrice,
        endPrice,
      })
    ),

  // Get trip requests by user
  getTripRequestsByUser: (userId: string): Promise<Trip[]> =>
    client.get(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_REQUESTS_BY_USER, { userId })),

  // Auto-delete trips by date
  autoDeleteTripByDate: (): Promise<void> =>
    client.post(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_AUTO_DELETE)),

  // Get all trip requests
  getAllTripsRequested: (): Promise<Trip[]> =>
    client.get(buildTripUrl(API_ENDPOINTS.TRIP.ALL_TRIP_REQUESTS)),

  // Approve trip request
  approveTripRequest: (
    requestId: string,
    tripRequest: unknown
  ): Promise<Trip> =>
    client.post(buildTripUrl(API_ENDPOINTS.TRIP.TRIP_APPROVE, { requestId }), tripRequest),
};
