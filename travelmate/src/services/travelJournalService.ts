// Travel Journal Service - Handles all travel journal-related API calls
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildJournalUrl } from "./api";

export const travelJournalService = {
  async createJournal(journalData: any) {
    logger.info("Creating new travel journal", { journalData });
    try {
      const endpoint = buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS);
      const response = await httpClient.post(endpoint, journalData);
      logger.info("Travel journal created successfully", {
        id: response.data.id,
      });
      return response.data;
    } catch (error) {
      logger.error("Create travel journal failed:", error);
      throw error;
    }
  },

  async updateJournal(id: string, journalData: any) {
    logger.info(`Updating travel journal with ID: ${id}`, { journalData });
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNAL_BY_ID,
        { id }
      );
      const response = await httpClient.put(endpoint, journalData);
      logger.info(`Travel journal with ID: ${id} updated successfully`);
      return response.data;
    } catch (error) {
      logger.error("Update travel journal failed:", error);
      throw error;
    }
  },

  async deleteJournal(id: string) {
    logger.info(`Deleting travel journal with ID: ${id}`);
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNAL_BY_ID,
        { id }
      );
      await httpClient.delete(endpoint);
      logger.info(`Travel journal with ID: ${id} deleted successfully`);
    } catch (error) {
      logger.error("Delete travel journal failed:", error);
      throw error;
    }
  },
  // Get all travel journals
  async getAllJournals() {
    logger.info("Fetching all travel journals");
    try {
      const endpoint = buildJournalUrl(API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS);
      const response = await httpClient.get(endpoint);
      logger.info("Fetched all travel journals successfully");
      return response.data;
    } catch (error) {
      logger.error("Get all journals failed:", error);
      throw error;
    }
  },

  // Get travel journal by ID
  async getJournalById(id: string) {
    logger.info(`Fetching travel journal by ID: ${id}`);
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNAL_BY_ID,
        { id }
      );
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched travel journal by ID: ${id} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Get journal by ID failed:", error);
      throw error;
    }
  },

  // Get journals by user ID
  async getJournalsByUserId(userId: string) {
    logger.info(`Fetching journals by user ID: ${userId}`);
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_USER,
        { userId }
      );
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched journals by user ID: ${userId} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Get journals by user ID failed:", error);
      throw error;
    }
  },

  // Get journals by trip ID
  async getJournalsByTripId(tripId: string) {
    logger.info(`Fetching journals by trip ID: ${tripId}`);
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_TRIP,
        { tripId }
      );
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched journals by trip ID: ${tripId} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Get journals by trip ID failed:", error);
      throw error;
    }
  },

  // Get public journals
  async getPublicJournals() {
    logger.info("Fetching public travel journals");
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.PUBLIC_JOURNALS
      );
      const response = await httpClient.get(endpoint);
      logger.info("Fetched public travel journals successfully");
      return response.data;
    } catch (error) {
      logger.error("Get public journals failed:", error);
      throw error;
    }
  },
  // Search journals by tag
  async searchByTag(tag: string) {
    logger.info(`Searching journals by tag: ${tag}`);
    try {
      const endpoint = buildJournalUrl(
        API_ENDPOINTS.TRAVEL_JOURNAL.JOURNALS_BY_TAG,
        { tag }
      );
      const response = await httpClient.get(endpoint);
      logger.info(`Fetched journals by tag: ${tag} successfully`);
      return response.data;
    } catch (error) {
      logger.error("Search journals by tag failed:", error);
      throw error;
    }
  },
};
