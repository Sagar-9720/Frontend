import { Destination } from "../models/entity/Destination";
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { buildTripUrl, API_ENDPOINTS } from "./api";

class DestinationService {
  // Get all destinations
  async getDestinations(): Promise<Destination[]> {
    try {
      logger.info("Fetching all destinations", {}, "DestinationService");
      const url = buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATIONS);
      logger.debug("API Request URL", { url }, "DestinationService");
      const response = await httpClient.get<{ data: Destination[] }>(url);
      logger.info("API Response", response);
      logger.info(
        "Successfully fetched destinations",
        { count: response.data.data.length },
        "DestinationService"
      );
      return response.data.data;
    } catch (error) {
      logger.error(
        "Failed to fetch destinations",
        { error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Get destination by ID
  async getDestinationById(id: string): Promise<Destination> {
    try {
      logger.info("Fetching destination by ID", { id }, "DestinationService");
      const url = buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_ID, {
        id,
      });
      logger.debug("API Request URL", { url, id }, "DestinationService");
      const response = await httpClient.get<Destination>(url);
      logger.info(
        "Successfully fetched destination",
        { id, name: response.data?.name },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to fetch destination by ID",
        { id, error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Create new destination
  async createDestination(
    destination: Partial<Destination>
  ): Promise<Destination> {
    try {
      logger.info(
        "Creating new destination",
        { name: destination.name },
        "DestinationService"
      );
      const url = buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_CREATE);
      logger.debug(
        "API Request URL and data",
        { url, destination },
        "DestinationService"
      );
      const response = await httpClient.post<Destination>(url, destination);
      logger.info(
        "Successfully created destination",
        { id: response.data?.id, name: response.data?.name },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to create destination",
        { destination, error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Update destination
  async updateDestination(
    id: string,
    destination: Partial<Destination>
  ): Promise<Destination> {
    try {
      logger.info(
        "Updating destination",
        { id, updates: destination },
        "DestinationService"
      );
      const url = buildTripUrl(API_ENDPOINTS.DESTINATION.DESTINATION_BY_ID, {
        id,
      });
      logger.debug(
        "API Request URL and data",
        { url, id, destination },
        "DestinationService"
      );

      const response = await httpClient.put<Destination>(url, destination);
      logger.info(
        "Successfully updated destination",
        { id, name: response.data.name },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to update destination",
        { id, destination, error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Search destinations
  async searchDestinations(query: string): Promise<Destination[]> {
    try {
      logger.info("Searching destinations", { query }, "DestinationService");
      const url = `${buildTripUrl(
        API_ENDPOINTS.DESTINATION.DESTINATION_SEARCH
      )}?q=${encodeURIComponent(query)}`;
      logger.debug("API Request URL", { url, query }, "DestinationService");

      const response = await httpClient.get<Destination[]>(url);
      logger.info(
        "Successfully searched destinations",
        { query, count: response.data.length },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to search destinations",
        { query, error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Get destinations by country
  async getDestinationsByCountry(countryId: string): Promise<Destination[]> {
    try {
      logger.info(
        "Fetching destinations by country",
        { countryId },
        "DestinationService"
      );
      const url = buildTripUrl(
        API_ENDPOINTS.DESTINATION.DESTINATION_BY_COUNTRY,
        { countryId }
      );
      logger.debug("API Request URL", { url, countryId }, "DestinationService");
      const response = await httpClient.get<Destination[]>(url);
      logger.info(
        "Successfully fetched destinations by country",
        { countryId, count: response.data.length },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to fetch destinations by country",
        { countryId, error },
        "DestinationService"
      );
      throw error;
    }
  }

  // Get destinations by region
  async getDestinationsByRegion(regionId: string): Promise<Destination[]> {
    try {
      logger.info(
        "Fetching destinations by region",
        { regionId },
        "DestinationService"
      );
      const url = buildTripUrl(
        API_ENDPOINTS.DESTINATION.DESTINATION_BY_REGION,
        { regionId }
      );
      logger.debug("API Request URL", { url, regionId }, "DestinationService");
      const response = await httpClient.get<Destination[]>(url);
      logger.info(
        "Successfully fetched destinations by region",
        { regionId, count: response.data.length },
        "DestinationService"
      );
      return response.data;
    } catch (error) {
      logger.error(
        "Failed to fetch destinations by region",
        { regionId, error },
        "DestinationService"
      );
      throw error;
    }
  }
}

export const destinationService = new DestinationService();
