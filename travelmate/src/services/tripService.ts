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
};
