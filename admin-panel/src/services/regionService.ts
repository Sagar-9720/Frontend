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

  // Create new region
  async createRegion(payload: any) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.REGION.REGION_CREATE);
      const response = await httpClient.post(endpoint, payload);
      logger.info("Created region successfully", { payload });
      return response.data;
    } catch (error) {
      logger.error("Create region failed:", error);
      throw error;
    }
  },

  // Update region
  async updateRegion(id: string, payload: any) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.REGION.REGION_UPDATE, { id });
      const response = await httpClient.put(endpoint, payload);
      logger.info(`Updated region ${id} successfully`, { payload });
      return response.data;
    } catch (error) {
      logger.error("Update region failed:", error);
      throw error;
    }
  },
};
