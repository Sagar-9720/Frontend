import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useCallback } from "react";
import { storageUtility, logger } from "../utils";
const log = logger.forSource('AuthContext');
import { authService } from "../services/authService";
import { User } from "../models";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // DEV AUTH BYPASS FLAG (ONLY FOR LOCAL DEVELOPMENT - REMOVE BEFORE PROD)
  const DEV_BYPASS_ENABLED = (import.meta.env.VITE_DEV_AUTH_BYPASS || '').toLowerCase() === 'true';
  const DEV_BYPASS_EMAIL = import.meta.env.VITE_DEV_AUTH_EMAIL; // optional specific email restriction
  const DEV_BYPASS_ROLE = import.meta.env.VITE_DEV_AUTH_ROLE || "ADMIN";

  /**
   * Development-only bypass function.
   * Returns true if bypass performed, false otherwise.
   * IMPORTANT: Ensure VITE_DEV_AUTH_BYPASS is NEVER enabled in production.
   */
  const attemptDevBypass = (email: string): boolean => {
    if (!DEV_BYPASS_ENABLED) return false;
    if (DEV_BYPASS_EMAIL && DEV_BYPASS_EMAIL !== email) return false; // enforce allowed dev email if specified

    log.warn(
      "[DEV AUTH BYPASS] Active. Skipping real authentication. REMOVE BEFORE PRODUCTION."
    );

    // Create a long-lived dummy JWT-like token (expires far in future) to avoid expiry check warnings
    try {
      const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
      const futureExpSeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
      const payload = btoa(
        JSON.stringify({
          sub: "dev-user",
          email,
          roles: [DEV_BYPASS_ROLE],
          exp: futureExpSeconds,
          iat: Math.floor(Date.now() / 1000),
          bypass: true,
        })
      );
      const dummyToken = `${header}.${payload}.devsig`;

      const dummyUser: User = {
        userId: 0,
        name: "Dev Admin",
        email,
        phone: "0000000000",
        dob: "1990-01-01",
        gender: "OTHER",
        roles: DEV_BYPASS_ROLE,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileImg: "",
      };

      storageUtility.setAuthToken(dummyToken);
      storageUtility.setUserData(dummyUser);
      setUser(dummyUser);
      setToken(dummyToken);
      setIsLoading(false);
      return true;
    } catch (e) {
      log.error("Failed to create dev bypass token", e as unknown);
      return false;
    }
  };

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = storageUtility.getAuthToken();
        const storedUser = storageUtility.getUserData<User>();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Validate token with backend (skip if dev bypass token contains bypass flag)
          const isBypass = (() => {
            try {
              const payloadRaw = storedToken.split(".")[1];
              if (!payloadRaw) return false;
              const payloadJson = JSON.parse(atob(payloadRaw));
              return payloadJson?.bypass === true;
            } catch {
              return false;
            }
          })();

          // If a dev-bypass token is present but bypass flag is disabled, force logout/clear auth
          if (isBypass && !DEV_BYPASS_ENABLED) {
            log.warn(
              "[DEV AUTH BYPASS] Bypass token detected but VITE_DEV_AUTH_BYPASS is disabled. Clearing auth."
            );
            await logout();
            return;
          }

          if (!isBypass) {
            try {
              const response = await authService.validateToken();
              const validResp = response as unknown as { success?: boolean; data?: { valid?: boolean } };
              if (!validResp?.success || !validResp?.data?.valid) {
                throw new Error("Invalid token");
              }
            } catch (error) {
              log.warn('Token validation failed, clearing auth data', error as unknown);
              await logout();
            }
          } else {
            log.info("[DEV AUTH BYPASS] Skipping backend token validation.");
          }
        }
      } catch (error) {
        log.error('Failed to initialize auth', error as unknown);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dev bypass first (only if enabled)
    if (DEV_BYPASS_ENABLED && attemptDevBypass(email)) {
      log.info('[DEV AUTH BYPASS] Login bypassed', { email });
      return true;
    }

    try {
      setIsLoading(true);
      log.user('Login attempt', { email });

      type LoginHttpResp = { data?: { data?: { userInfo?: User; token?: string; refreshToken?: string } } };
      const result = await authService.login(email, password);
      const safeRes = result as unknown as LoginHttpResp | Record<string, any>;
      const payload = safeRes?.data?.data ?? safeRes?.data ?? (safeRes as Record<string, any>);
      const { userInfo, token: authToken, refreshToken: refToken } = (payload || {}) as { userInfo?: User; token?: string; refreshToken?: string };
      if (!userInfo || !authToken || !refToken) {
        throw new Error('Authentication failed: missing token or user info');
      }

      storageUtility.setAuthToken(authToken);
      if (refToken) storageUtility.setRefreshToken(refToken);
      storageUtility.setUserData(userInfo);

      setUser(userInfo);
      setToken(authToken);
      log.info('Login successful', { userId: userInfo?.userId, email: userInfo?.email });
      return true;
    } catch (error: unknown) {
      log.error('Login failed', error);
      storageUtility.clearAuthData();
      setUser(null);
      setToken(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      log.user("Logout initiated");

      // Call backend logout endpoint to revoke token
      if (token) {
        try {
          await authService.logout();
          log.info("Token revoked on server");
        } catch (error) {
          // Continue with logout even if backend call fails
          log.warn(
            "Backend logout failed, continuing with local logout",
            error as unknown
          );
        }
      }

      // Clear local storage
      storageUtility.clearAuthData();

      // Clear state
      setUser(null);
      setToken(null);

      log.user("Logout completed");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      log.error("Logout failed", error as unknown);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refToken = storageUtility.getRefreshToken();

      if (!refToken) {
        await logout();
        return false;
      }

      // Use auth service for refresh token
      const response = await authService.refreshToken();
      type RefreshTokenResp = { success?: boolean; data?: { token?: string; refreshToken?: string; user?: User } };
      const r = response as unknown as RefreshTokenResp;

      if (r?.success && r?.data) {
        const { token: newToken, refreshToken: newRefreshToken, user: userData } = r.data;

        // Update stored tokens
        if (newToken) storageUtility.setAuthToken(newToken);
        if (newRefreshToken) {
          storageUtility.setRefreshToken(newRefreshToken);
        }

        // Update user data if provided
        if (userData) {
          storageUtility.setUserData(userData);
          setUser(userData);
        }

        if (newToken) setToken(newToken);

        log.info("Token refreshed successfully");
        return true;
      }

      await logout();
      return false;
    } catch (error) {
      log.error("Token refresh failed", error as unknown);
      await logout();
      return false;
    }
  }, [logout]);

  // Auto refresh token when it's about to expire
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiry = () => {
      try {
        // Decode JWT token to check expiry (basic implementation)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        // Refresh token if it expires in less than 5 minutes
        if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
          refreshToken();
        } else if (timeUntilExpiry <= 0) {
          logout();
        }
      } catch (error) {
        // If token is not a valid JWT, we can't decode it
        // In this case, rely on backend validation
        log.warn("Failed to decode token for expiry check", error as unknown);
      }
    };

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Initial check
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [token, logout, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isLoading,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
