import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { buildJournalUrl, API_ENDPOINTS } from "./api";
import type { Tag } from "../models";

export class TagService {
  // Get all tags
  async getAllTags(): Promise<Tag[]> {
    try {
      logger.info("Fetching all tags", {}, "TagService");
      const url = buildJournalUrl(API_ENDPOINTS.TAG.TAGS);
      logger.debug("API Request URL", { url }, "TagService");
      const response = await httpClient.get<Tag[]>(url);
      logger.info(
        "Successfully fetched tags",
        { count: response.data?.length },
        "TagService"
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to fetch tags", error, "TagService");
      throw error;
    }
  }
  async suggestTags(query: string): Promise<string[]> {
    try {
      logger.info("Suggesting tags", { query }, "TagService");
      const url =
        buildJournalUrl(API_ENDPOINTS.TAG.TAG_SUGGEST) +
        `?q=${encodeURIComponent(query)}`;
      logger.debug("API Request URL", { url }, "TagService");
      const response = await httpClient.get<string[]>(url);
      logger.info(
        "Successfully fetched tag suggestions",
        { count: response.data?.length },
        "TagService"
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to suggest tags", error, "TagService");
      throw error;
    }
  }
}

