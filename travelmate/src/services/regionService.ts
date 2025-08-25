// Region Service - Handles all region-related API calls
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl } from "./api";

export const regionService = {
  // Get all regions
  async getRegions(params?: any) {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const endpoint =
        buildTripUrl(API_ENDPOINTS.REGION.REGIONS) +
        (queryString ? `?${queryString}` : "");
      const response = await httpClient.get(endpoint);
      logger.info("Fetched regions successfully", { params });
      return response.data;
    } catch (error) {
      logger.error("Get regions failed:", error);
      throw error;
    }
  },

  // Get region by ID
  async getRegionById(id: string) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.REGION.REGION_BY_ID, { id });
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched region ${id} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Get region failed:", error);
      throw error;
    }
  },
};
