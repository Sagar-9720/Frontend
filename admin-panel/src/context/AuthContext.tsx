import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { storageUtility, logger } from "../utils";
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = storageUtility.getAuthToken();
        const storedUser = storageUtility.getUserData<User>();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Validate token with backend
          try {
            const response = await authService.validateToken();
            if (!response.success || !response.data || !response.data.valid) {
              throw new Error("Invalid token");
            }
          } catch (error) {
            logger.warn("Token validation failed, clearing auth data");
            await logout();
          }
        }
      } catch (error) {
        logger.error("Failed to initialize auth", error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      logger.userAction("Login attempt", { email });

      // Use real authentication service
      const result = await authService.login(email, password);
      // result.data is now the direct payload, e.g. { userInfo, token, refreshToken }
      const {
        userInfo,
        token: authToken,
        refreshToken: refToken,
      } = result.data.data || {};
      logger.info("Login Successful", result);

      // Store auth data
      storageUtility.setAuthToken(authToken);
      if (refToken) {
        storageUtility.setRefreshToken(refToken);
      }
      storageUtility.setUserData(userInfo);

      // Update state
      setUser(userInfo);
      setToken(authToken);
      logger.info("Login Successful: ", userInfo);

      return true;
    } catch (error: any) {
      logger.error("Login failed", error);

      // Clear any partial auth data
      storageUtility.clearAuthData();
      setUser(null);
      setToken(null);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      logger.userAction("Logout initiated");

      // Call backend logout endpoint to revoke token
      if (token) {
        try {
          await authService.logout();
          logger.info("Token revoked on server");
        } catch (error) {
          // Continue with logout even if backend call fails
          logger.warn(
            "Backend logout failed, continuing with local logout",
            error
          );
        }
      }

      // Clear local storage
      storageUtility.clearAuthData();

      // Clear state
      setUser(null);
      setToken(null);

      logger.userAction("Logout completed");

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      logger.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refToken = storageUtility.getRefreshToken();

      if (!refToken) {
        await logout();
        return false;
      }

      // Use auth service for refresh token
      const response = await authService.refreshToken();

      if (response.success && response.data) {
        const {
          token: newToken,
          refreshToken: newRefreshToken,
          user: userData,
        } = response.data;

        // Update stored tokens
        storageUtility.setAuthToken(newToken);
        if (newRefreshToken) {
          storageUtility.setRefreshToken(newRefreshToken);
        }

        // Update user data if provided
        if (userData) {
          storageUtility.setUserData(userData);
          setUser(userData);
        }

        setToken(newToken);

        logger.info("Token refreshed successfully");
        return true;
      }

      await logout();
      return false;
    } catch (error) {
      logger.error("Token refresh failed", error);
      await logout();
      return false;
    }
  };

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
        logger.warn("Failed to decode token for expiry check", error);
      }
    };

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Initial check
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [token]);

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
