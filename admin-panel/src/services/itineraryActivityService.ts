// Itinerary Activity Service - Handles all itinerary activity-related API calls
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl } from "./api";

export const itineraryActivityService = {
  // Get all itinerary activities
  async getAllActivities() {
    try {
      logger.info("Fetching all itinerary activities");
      const endpoint = buildTripUrl(
        API_ENDPOINTS.ITINERARY_ACTIVITY.ACTIVITIES
      );
      const response = await httpClient.get(endpoint);
      logger.info("Fetched all itinerary activities successfully");
      return response.data;
    } catch (error) {
      logger.error("Get all itinerary activities failed:", error);
      throw error;
    }
  },

  // Suggest itinerary activities
  async suggestActivities(keyword: string) {
    try {
      logger.info(`Suggesting itinerary activities for keyword: ${keyword}`);
      const endpoint = buildTripUrl(
        API_ENDPOINTS.ITINERARY_ACTIVITY.ACTIVITY_SUGGEST.replace(
          ":keyword",
          encodeURIComponent(keyword)
        )
      );
      const response = await httpClient.get(endpoint);
      logger.info("Fetched itinerary activity suggestions successfully");
      return response.data;
    } catch (error) {
      logger.error("Suggest itinerary activities failed:", error);
      throw error;
    }
  },
};
