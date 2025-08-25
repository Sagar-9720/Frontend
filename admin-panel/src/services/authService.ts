//Authentication service - handles all auth-related API calls
import { User } from "../models";
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildAuthUrl } from "./api";

export const authService = {
  async getAllUsers(params?: any) {
    try {
      logger.info("Fetching all users", { params });
      const queryString = params ? new URLSearchParams(params).toString() : "";
      const endpoint =
        buildAuthUrl(API_ENDPOINTS.AUTH.ALL_USERS) +
        (queryString ? `?${queryString}` : "");
      const response = await httpClient.get(endpoint);
      logger.info("All users fetched successfully", { data: response.data });
      return {
        success: true,
        data: response.data,
        message: "Users fetched successfully",
      };
    } catch (error) {
      logger.error("Get all users failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      };
    }
  },

  async deleteUser(userId: string) {
    try {
      logger.info("Deleting user", { userId }, "AuthService");
      return await httpClient.delete(
        buildAuthUrl(API_ENDPOINTS.AUTH.DELETE_USER, { userId }),
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Delete user failed", error, "AuthService");
      throw error;
    }
  },

  async updateRole(updates: any) {
    try {
      logger.info("Updating user role", updates, "AuthService");
      return await httpClient.put(
        buildAuthUrl(API_ENDPOINTS.AUTH.UPDATE_ROLE),
        updates,
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Update role failed", error, "AuthService");
      throw error;
    }
  },

  async getUserName(userIds: string[]) {
    try {
      logger.info("Fetching user names", { userIds }, "AuthService");
      return await httpClient.get(
        buildAuthUrl(API_ENDPOINTS.AUTH.GET_USER_NAME),
        { skipAuth: false, body: userIds }
      );
    } catch (error) {
      logger.error("Get user name failed", error, "AuthService");
      throw error;
    }
  },
  async login(email: string, password: string) {
    try {
      logger.info("Attempting user login", { email }, "AuthService");
      logger.debug(
        "Login request URL",
        { url: buildAuthUrl(API_ENDPOINTS.AUTH.LOGIN) },
        "AuthService"
      );

      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.LOGIN),
        { email, password },
        { skipAuth: true }
      );
    } catch (error) {
      logger.error("Login failed", error, "AuthService");
      logger.security("Login attempt failed", {
        email,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  async logout() {
    try {
      logger.info("Attempting user logout", {}, "AuthService");
      logger.debug(
        "Logout request URL",
        { url: buildAuthUrl(API_ENDPOINTS.AUTH.LOGOUT) },
        "AuthService"
      );

      await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.LOGOUT),
        {},
        { skipAuth: false }
      );

      logger.info("Logout successful", "AuthService");
    } catch (error) {
      logger.error("Logout failed", error, "AuthService");
      throw error;
    }
  },

  async refreshToken() {
    try {
      logger.info("Refreshing token", {}, "AuthService");
      return await httpClient.refreshToken(
        buildAuthUrl(API_ENDPOINTS.AUTH.REFRESH),
        {
          skipAuth: true,
        }
      );
    } catch (error) {
      logger.error("Token refresh failed", error, "AuthService");
      throw error;
    }
  },

  async validateToken() {
    try {
      logger.debug("Validating token", {}, "AuthService");
      return await httpClient.post(buildAuthUrl(API_ENDPOINTS.AUTH.VALIDATE), {
        skipAuth: false,
      });
    } catch (error) {
      logger.error("Token validation failed", error, "AuthService");
      throw error;
    }
  },

  async changePassword(update: any) {
    try {
      logger.info("Attempting password change", {}, "AuthService");
      logger.security("Password change attempt", { timestamp: Date.now() });

      return await httpClient.put(
        buildAuthUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD),
        update,
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Password change failed", error, "AuthService");
      logger.security("Password change failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST),
        email,
        {
          skipAuth: true,
        }
      );
    } catch (error) {
      logger.error("Forgot password failed:", error);
      throw error;
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      return await httpClient.resetPassword(
        buildAuthUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD),
        token,
        newPassword
      );
    } catch (error) {
      logger.error("Reset password failed:", error);
      throw error;
    }
  },

  async getUserInfo() {
    try {
      logger.info("Fetching user info", {}, "AuthService");
      return await httpClient.get(buildAuthUrl(API_ENDPOINTS.AUTH.USER_INFO), {
        skipAuth: false,
      });
    } catch (error) {
      logger.error("Failed to fetch user info", error, "AuthService");
      throw error;
    }
  },

  async updateUserInfo(updates: Partial<User>) {
    try {
      logger.info("Updating user info", updates, "AuthService");
      return await httpClient.put(
        buildAuthUrl(API_ENDPOINTS.AUTH.UPDATE),
        updates
      );
    } catch (error) {
      logger.error("Failed to update user info", error, "AuthService");
      throw error;
    }
  },

  async registerSubAdmin(data: any) {
    try {
      logger.info("Registering sub-admin", data, "AuthService");
      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.REGISTER_SUBADMIN),
        data,
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Sub-admin registration failed", error, "AuthService");
      throw error;
    }
  },

  async getAllSubAdmins() {
    try {
      logger.info("Fetching all sub-admins", {}, "AuthService");
      return await httpClient.get(
        buildAuthUrl(API_ENDPOINTS.AUTH.GET_ALL_SUBADMINS),
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Failed to fetch sub-admins", error, "AuthService");
      throw error;
    }
  },

  async deleteUserRequest() {
    try {
      logger.info("Fetching all delete requested users", {}, "AuthService");
      return await httpClient.get(
        buildAuthUrl(API_ENDPOINTS.AUTH.DELETE_USER_REQUEST),
        { skipAuth: false }
      );
    } catch (error) {
      logger.error(
        "Failed to fetch delete requested users",
        error,
        "AuthService"
      );
      throw error;
    }
  },

  async checkEmailExists(email: string) {
    try {
      logger.info("Checking if email exists", { email }, "AuthService");
      const endpoint = buildAuthUrl(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
        email,
      });
      return await httpClient.get(endpoint, { skipAuth: true });
    } catch (error) {
      logger.error("Email check failed", error, "AuthService");
      throw error;
    }
  },
};
