// User Service - Handles all user-related API calls for comments, likes, saved trips, and views
import { httpClient } from "../utils/http-client";
import { buildUserUrl } from "./api";

export const userService = {
  // Get all comments
  async getComments(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const endpoint = buildUserUrl("/api/users/comments") + queryString;
    const response = await httpClient.get(endpoint);
    return response.data;
  },

  // Get all likes
  async getLikes(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const endpoint = buildUserUrl("/api/users/like") + queryString;
    const response = await httpClient.get(endpoint);
    return response.data;
  },

  // Get all saved trips
  async getSavedTrips(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const endpoint = buildUserUrl("/api/users/saved-trips") + queryString;
    const response = await httpClient.get(endpoint);
    return response.data;
  },

  // Get all views (if needed, usually just increaseView)
  async getViews(params?: any) {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const endpoint = buildUserUrl("/api/users/view") + queryString;
    const response = await httpClient.get(endpoint);
    return response.data;
  },
};
