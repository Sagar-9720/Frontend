// Authentication service - refactored to use serviceFactory client
import { User } from "../models";
import { API_ENDPOINTS, buildAuthUrl } from "./api";
import { createServiceClient } from "../utils/serviceFactory";
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";

const client = createServiceClient("AuthService");
const log = logger.forSource("AuthService");

export const authService = {
  getAllUsers: (params?: Record<string, string | number | boolean>) =>
    client.get(
      buildAuthUrl(API_ENDPOINTS.AUTH.ALL_USERS) +
        (params
          ? `?${new URLSearchParams(
              Object.fromEntries(
                Object.entries(params).map(([k, v]) => [k, String(v)])
              )
            ).toString()}`
          : "")
    ),

  deleteUser: (userId: string) =>
    client.del(buildAuthUrl(API_ENDPOINTS.AUTH.DELETE_USER, { userId }), {
      skipAuth: false,
    }),

  updateRole: (updates: Record<string, unknown>) =>
    client.put(buildAuthUrl(API_ENDPOINTS.AUTH.UPDATE_ROLE), updates, {
      skipAuth: false,
    }),

  getUserName: (userIds: string[]) =>
    client.get(buildAuthUrl(API_ENDPOINTS.AUTH.GET_USER_NAME), {
      skipAuth: false,
      body: userIds,
    }),

  login: (email: string, password: string) =>
    client.post(
      buildAuthUrl(API_ENDPOINTS.AUTH.LOGIN),
      { email, password },
      { skipAuth: true }
    ),

  logout: async () => {
    log.info("Attempting user logout");
    await client.post(buildAuthUrl(API_ENDPOINTS.AUTH.LOGOUT), {}, {
      skipAuth: false,
    });
    log.info("Logout successful");
  },

  refreshToken: () =>
    httpClient.refreshToken(buildAuthUrl(API_ENDPOINTS.AUTH.REFRESH), {
      skipAuth: true,
    }),

  validateToken: () =>
    client.post(buildAuthUrl(API_ENDPOINTS.AUTH.VALIDATE), undefined, {
      skipAuth: false,
    }),

  changePassword: (update: { oldPassword: string; newPassword: string }) =>
    client.put(buildAuthUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD), update, {
      skipAuth: false,
    }),

  forgotPassword: (email: string) =>
    client.post(
      buildAuthUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST),
      email,
      { skipAuth: true }
    ),

  resetPassword: (token: string, newPassword: string) =>
    httpClient.resetPassword(buildAuthUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD), token, newPassword),

  getUserInfo: () =>
    client.get(buildAuthUrl(API_ENDPOINTS.AUTH.USER_INFO), {
      skipAuth: false,
    }),

  updateUserInfo: (updates: Partial<User>) =>
    client.put(buildAuthUrl(API_ENDPOINTS.AUTH.UPDATE), updates),

  registerSubAdmin: (data: Record<string, unknown>) =>
    client.post(
      buildAuthUrl(API_ENDPOINTS.AUTH.REGISTER_SUBADMIN),
      data,
      { skipAuth: false }
    ),

  getAllSubAdmins: () =>
    client.get(buildAuthUrl(API_ENDPOINTS.AUTH.GET_ALL_SUBADMINS), {
      skipAuth: false,
    }),

  deleteUserRequest: () =>
    client.get(buildAuthUrl(API_ENDPOINTS.AUTH.DELETE_USER_REQUEST), {
      skipAuth: false,
    }),

  checkEmailExists: (email: string) =>
    client.get(buildAuthUrl(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email }), {
      skipAuth: true,
    }),
};
