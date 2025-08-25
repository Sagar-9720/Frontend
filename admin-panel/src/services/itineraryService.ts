// Itinerary Service - Handles all itinerary-related API calls
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl, replaceUrlParams } from "./api";

class ItineraryService {
  constructor() {
    logger.info("ItineraryService initialized");
  }

  // Get all itineraries
  async getItineraries(params?: any) {
    logger.info("Fetching all itineraries", { params });
    try {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const endpoint =
        buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARIES) +
        (queryString ? `?${queryString}` : "");
      const response = await httpClient.get(endpoint);
      logger.info("Fetched itineraries successfully");
      return response.data;
    } catch (error) {
      logger.error("Get itineraries failed:", error);
      throw error;
    }
  }

  // Get itinerary by ID
  async getItinerary(id: string) {
    logger.info(`Fetching itinerary with id: ${id}`);
    try {
      const endpoint = buildTripUrl(
        replaceUrlParams(API_ENDPOINTS.ITINERARY.ITINERARY_BY_ID, { id })
      );
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched itinerary ${id} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Get itinerary failed:", error);
      throw error;
    }
  }

  // Create new itinerary
  async createItinerary(data: any) {
    logger.info("Creating new itinerary", { data });
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARY_CREATE);
      const response = await httpClient.post(endpoint, data);
      logger.info("Created itinerary successfully");
      return response.data;
    } catch (error) {
      logger.error("Create itinerary failed:", error);
      throw error;
    }
  }

  // Update itinerary
  async updateItinerary(id: string, data: any) {
    logger.info(`Updating itinerary with id: ${id}`, { data });
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.ITINERARY.ITINERARY_UPDATE, {
        id,
      });
      const response = await httpClient.put(endpoint, data);
      logger.info(`Updated itinerary ${id} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Update itinerary failed:", error);
      throw error;
    }
  }

  async getItinerariesByDestination(destinationId: string) {
    logger.info(`Fetching itineraries by destination: ${destinationId}`);
    try {
      const endpoint = buildTripUrl(
        replaceUrlParams(API_ENDPOINTS.ITINERARY.ITINERARIES_BY_DESTINATION, {
          destinationId,
        })
      );
      const response = await httpClient.get(endpoint);
      logger.info(
        `Fetched itineraries for destination ${destinationId} successfully`
      );
      return response.data;
    } catch (error) {
      logger.error("Get itineraries by destination failed:", error);
      throw error;
    }
  }
  //suggest itinerary
  async suggestItineraries(keyword: string) {
    logger.info(`Suggesting itineraries for keyword: ${keyword}`);
    try {
      const endpoint = buildTripUrl(
        API_ENDPOINTS.ITINERARY.ITINERARY_SUGGEST.replace(
          ":keyword",
          encodeURIComponent(keyword)
        )
      );
      const response = await httpClient.get(endpoint);
      logger.info("Fetched itinerary suggestions successfully");
      return response.data;
    } catch (error) {
      logger.error("Suggest itineraries failed:", error);
      throw error;
    }
  }
}
export const itineraryService = new ItineraryService();
