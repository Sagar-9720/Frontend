import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl } from "./api";

class CountryService {
  async getCountries(params?: any) {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const endpoint =
        buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRIES) +
        (queryString ? `?${queryString}` : "");
      const response = await httpClient.get(endpoint);
      logger.info("Fetched countries successfully", { params });
      return response.data;
    } catch (error) {
      logger.error("Get countries failed:", error);
      throw error;
    }
  }

  async getCountryById(id: string) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_BY_ID, {
        id,
      });
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched country successfully`, { id });
      return response.data;
    } catch (error) {
      logger.error("Get country failed:", error);
      throw error;
    }
  }

  async createCountry(data: any) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_CREATE);
      const response = await httpClient.post(endpoint, data);
      logger.info("Created country successfully", { data });
      return response.data;
    } catch (error) {
      logger.error("Create country failed:", error);
      throw error;
    }
  }

  async updateCountry(id: string, data: any) {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.COUNTRY.COUNTRY_UPDATE, {
        id,
      });
      const response = await httpClient.put(endpoint, data);
      logger.info("Updated country successfully", { id, data });
      return response.data;
    } catch (error) {
      logger.error("Update country failed:", error);
      throw error;
    }
  }
}

export const countryService = new CountryService();
