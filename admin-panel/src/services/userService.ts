// User Service - Handles all user-related API calls for comments, likes, saved trips, and views
import { buildUserUrl } from "./api";
import { createServiceClient, withQuery } from "../utils/serviceFactory";

const client = createServiceClient('UserService');

export const userService = {
  getComments: (params?: Record<string,string|number|boolean>) => client.get(withQuery(buildUserUrl("/api/users/comments"), params)),
  getLikes: (params?: Record<string,string|number|boolean>) => client.get(withQuery(buildUserUrl("/api/users/like"), params)),
  getSavedTrips: (params?: Record<string,string|number|boolean>) => client.get(withQuery(buildUserUrl("/api/users/saved-trips"), params)),
  getViews: (params?: Record<string,string|number|boolean>) => client.get(withQuery(buildUserUrl("/api/users/view"), params)),
};
