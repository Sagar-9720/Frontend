// Trip Service - Handles all trip-related API calls integrating with backend microservices
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl } from "./api";
import type { Trip, TripPayLoad } from "../models";

export const tripService = {
  // Trip CRUD operations
  async getTrips(params?: any) {
    try {
      logger.info("Fetching trips", { params });
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const endpoint =
        buildTripUrl(API_ENDPOINTS.TRIP.TRIPS) +
        (queryString ? `?${queryString}` : "");
      const response = await httpClient.get(endpoint);
      logger.info("Trips fetched successfully", { data: response.data });
      return {
        success: true,
        data: response.data,
        message: "Trips fetched successfully",
      };
    } catch (error) {
      logger.error("Get trips failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch trips",
      };
    }
  },

  async getTripById(id: string) {
    try {
      logger.info("Fetching trip", { id });
      const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_ID, { id });
      const response = await httpClient.get(url);
      logger.info("Trip fetched successfully", { data: response.data });
      return {
        success: true,
        data: response.data,
        message: "Trip fetched successfully",
      };
    } catch (error) {
      logger.error("Get trip failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch trip",
      };
    }
  },

  async createTrip(data: TripPayLoad) {
    try {
      logger.info("Creating trip", { data });
      const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_CREATE);
      const response = await httpClient.post(url, data);
      logger.info("Trip created successfully", { data: response.data });
      return {
        success: true,
        data: response.data,
        message: "Trip created successfully",
      };
    } catch (error) {
      logger.error("Create trip failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create trip",
      };
    }
  },

  async updateTrip(id: string, data: TripPayLoad) {
    try {
      logger.info("Updating trip", { id, data });
      const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_UPDATE, { id });
      const response = await httpClient.put(url, data);
      logger.info("Trip updated successfully", { data: response.data });
      return {
        success: true,
        data: response.data,
        message: "Trip updated successfully",
      };
    } catch (error) {
      logger.error("Update trip failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update trip",
      };
    }
  },

  async deleteTrip(id: string) {
    try {
      logger.info("Deleting trip", { id });
      const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_BY_ID, { id });
      await httpClient.delete(url);
      logger.info("Trip deleted successfully", { id });
      return {
        success: true,
        message: "Trip deleted successfully",
      };
    } catch (error) {
      logger.error("Delete trip failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete trip",
      };
    }
  },

  // Get trips by destination name
  async getTripsByDestinationName(destinationName: string): Promise<Trip[]> {
    logger.info("Fetching trips by destination name", { destinationName });
    const url = `${buildTripUrl(
      API_ENDPOINTS.TRIP.TRIP_BY_DESTINATION
    )}?destinationName=${encodeURIComponent(destinationName)}`;
    const response = await httpClient.get<Trip[]>(url);
    logger.info("Trips by destination fetched", { data: response.data });
    return response.data;
  },

  // Get trips by price range
  async getTripsByPriceRange(
    startPrice: number,
    endPrice: number
  ): Promise<Trip[]> {
    logger.info("Fetching trips by price range", { startPrice, endPrice });
    const url = `${buildTripUrl(
      API_ENDPOINTS.TRIP.TRIP_BY_PRICE_RANGE
    )}?startPrice=${startPrice}&endPrice=${endPrice}`;
    const response = await httpClient.get<Trip[]>(url);
    logger.info("Trips by price range fetched", { data: response.data });
    return response.data;
  },

  // Get trip requests by user
  async getTripRequestsByUser(userId: string): Promise<Trip[]> {
    logger.info("Fetching trip requests by user", { userId });
    const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_REQUESTS_BY_USER, {
      userId,
    });
    const response = await httpClient.get<Trip[]>(url);
    logger.info("Trip requests by user fetched", { data: response.data });
    return response.data;
  },

  // Auto-delete trips by date
  async autoDeleteTripByDate(): Promise<void> {
    logger.info("Auto-deleting trips by date");
    const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_AUTO_DELETE);
    await httpClient.post(url);
    logger.info("Auto-delete trips by date completed");
  },

  // Get all trip requests
  async getAllTripsRequested(): Promise<Trip[]> {
    logger.info("Fetching all trip requests");
    const url = buildTripUrl(API_ENDPOINTS.TRIP.ALL_TRIP_REQUESTS);
    const response = await httpClient.get<Trip[]>(url);
    logger.info("All trip requests fetched", { data: response.data });
    return response.data;
  },

  // Approve trip request
  async approveTripRequest(requestId: string, tripRequest: any): Promise<Trip> {
    logger.info("Approving trip request", { requestId, tripRequest });
    const url = buildTripUrl(API_ENDPOINTS.TRIP.TRIP_APPROVE, {
      requestId,
    });
    const response = await httpClient.post<Trip>(url, tripRequest);
    logger.info("Trip request approved", { data: response.data });
    return response.data;
  },
};
