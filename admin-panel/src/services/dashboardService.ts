// Dashboard Service - Handles all dashboard-related API calls
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildTripUrl } from "./api";

export const dashboardService = {
  async getOverview() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.OVERVIEW);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get overview failed:", error);
      throw error;
    }
  },

  async getUserStats() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.USER_STATS);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get user stats failed:", error);
      throw error;
    }
  },

  async getTripStats() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.TRIP_STATS);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get trip stats failed:", error);
      throw error;
    }
  },

  async getRevenueStats() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.REVENUE_STATS);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get revenue stats failed:", error);
      throw error;
    }
  },

  async getAnalytics() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.ANALYTICS);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get analytics failed:", error);
      throw error;
    }
  },

  async getRecentActivities() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get recent activities failed:", error);
      throw error;
    }
  },

  async getSystemHealth() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.SYSTEM_HEALTH);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get system health failed:", error);
      throw error;
    }
  },

  async getNotifications() {
    try {
      const endpoint = buildTripUrl(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS);
      const response = await httpClient.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error("Get notifications failed:", error);
      throw error;
    }
  },
};
