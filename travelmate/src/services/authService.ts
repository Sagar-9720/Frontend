//Authentication service - handles all auth-related API calls
import { User } from "../models";
import { httpClient } from "../utils/http-client";
import { logger } from "../utils/logger";
import { API_ENDPOINTS, buildAuthUrl } from "./api";

export const authService = {
  async verifyEmail(token: string) {
    try {
      logger.info("Verifying email", { token }, "AuthService");
      return await httpClient.verifyEmail(
        buildAuthUrl(API_ENDPOINTS.AUTH.VERIFY_EMAIL),
        token
      );
    } catch (error) {
      logger.error("Email verification failed", error, "AuthService");
      throw error;
    }
  },

  async resendVerification() {
    try {
      logger.info("Resending verification email", {}, "AuthService");
      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.RESEND_VERIFICATION),
        {},
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Resend verification failed", error, "AuthService");
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
      return await httpClient.get(buildAuthUrl(API_ENDPOINTS.AUTH.VALIDATE), {
        skipAuth: false,
      });
    } catch (error) {
      logger.error("Token validation failed", error, "AuthService");
      throw error;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      logger.info("Attempting password change", {}, "AuthService");
      logger.security("Password change attempt", { timestamp: Date.now() });

      return await httpClient.put(
        buildAuthUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD),
        {
          currentPassword,
          newPassword,
        }
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
        {
          email,
        }
      );
    } catch (error) {
      logger.error("Forgot password failed:", error);
      throw error;
    }
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.RESET_PASSWORD),
        {
          token,
          newPassword,
        }
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

  async deleteAccount() {
    try {
      logger.info("Deleting user account", "AuthService");
      return await httpClient.put(
        buildAuthUrl(API_ENDPOINTS.AUTH.DELETE_REQUEST),
        { skipAuth: false }
      );
    } catch (error) {
      logger.error("Delete account failed", error, "AuthService");
      throw error;
    }
  },

  async register(user: Partial<User>) {
    try {
      logger.info("Registering new user", { email: user.email }, "AuthService");
      return await httpClient.post(
        buildAuthUrl(API_ENDPOINTS.AUTH.REGISTER),
        user,
        { skipAuth: true }
      );
    } catch (error) {
      logger.error("User registration failed", error, "AuthService");
      throw error;
    }
  },
};
