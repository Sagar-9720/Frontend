// Dashboard Service - Handles all dashboard-related API calls
import { API_ENDPOINTS, buildTripUrl } from "./api";
import { createServiceClient } from "../utils/serviceFactory";

const client = createServiceClient("DashboardService");

export const dashboardService = {
  getOverview: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.OVERVIEW)),
  getUserStats: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.USER_STATS)),
  getTripStats: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.TRIP_STATS)),
  getRevenueStats: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.REVENUE_STATS)),
  getAnalytics: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.ANALYTICS)),
  getRecentActivities: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES)),
  getSystemHealth: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.SYSTEM_HEALTH)),
  getNotifications: () => client.get(buildTripUrl(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS)),
};
