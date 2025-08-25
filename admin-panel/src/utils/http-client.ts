// HTTP Client - Centralized HTTP request handling
import { environmentHelper } from "./env-helper";
import { storageUtility } from "./storage-utility";
import { logger } from "./logger";
import { HTTP_STATUS, STORAGE_KEYS } from "./constants";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  skipAuth?: boolean;
  responseType?: "json" | "text" | "blob" | "arrayBuffer";
}

export interface ApiResponse<T = any> {
  success: any;
  length: any;
  user: any;
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class HttpClient {
  private static instance: HttpClient;
  private baseURL: string;
  private defaultTimeout: number;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map();
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> =
    [];
  private responseInterceptors: Array<(response: ApiResponse) => ApiResponse> =
    [];
  private errorInterceptors: Array<(error: ApiError) => ApiError | void> = [];

  private constructor() {
    this.baseURL = environmentHelper.getApiBaseUrl();
    this.defaultTimeout = environmentHelper.getApiTimeout();
    this.setupDefaultInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private setupDefaultInterceptors(): void {
    // Request interceptor to add auth token
    this.addRequestInterceptor((config) => {
      if (!config.skipAuth) {
        const token = storageUtility.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }
      return config;
    });

    // Response interceptor to handle common errors
    this.addErrorInterceptor((error) => {
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        // Token expired, redirect to login
        storageUtility.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        storageUtility.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        storageUtility.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = "/login";
      }
      return error;
    });
  }

  // Core request method
  public async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = 0,
      retryDelay = 1000,
      cache = false,
      responseType = "json",
    } = config;

    // Apply request interceptors
    let finalConfig: RequestConfig = { ...config, method, headers };
    for (const interceptor of this.requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }

    const url = this.buildUrl(endpoint);
    const cacheKey = this.getCacheKey(method, url, body);

    // Check cache for GET requests
    if (method === "GET" && cache && this.isCacheValid(cacheKey)) {
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        logger.info(`Cache hit for ${url}`);
        return cachedData;
      }
    }

    const requestInit: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...finalConfig.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: this.createAbortSignal(timeout),
    };

    let lastError: any;

    const maxRetries = 0; // 1 attempt only
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`${method} ${url} (attempt ${attempt + 1})`);

        const response = await fetch(url, requestInit);
        const apiResponse = await this.handleResponse<T>(
          response,
          responseType
        );

        // Apply response interceptors
        let finalResponse = apiResponse;
        for (const interceptor of this.responseInterceptors) {
          finalResponse = interceptor(finalResponse);
        }

        // Cache successful GET responses
        if (method === "GET" && cache && response.ok) {
          this.setCache(
            cacheKey,
            finalResponse,
            environmentHelper.get("CACHE_TTL", 300)
          );
        }

        logger.info(
          `${method} ${url} - ${response.status} ${response.statusText}`
        );
        return finalResponse;
      } catch (error) {
        lastError = error;
        logger.error(
          `${method} ${url} failed (attempt ${attempt + 1}):`,
          error
        );

        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    // Apply error interceptors
    const apiError = this.createApiError(lastError);
    for (const interceptor of this.errorInterceptors) {
      const result = interceptor(apiError);
      if (result) {
        throw result;
      }
    }

    throw apiError;
  }

  // HTTP method shortcuts
  public async get<T = any>(
    endpoint: string,
    config: Omit<RequestConfig, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public async post<T = any>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  public async put<T = any>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  public async patch<T = any>(
    endpoint: string,
    body?: any,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  public async delete<T = any>(
    endpoint: string,
    config: Omit<RequestConfig, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // File upload
  public async upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Apply request interceptors
    let finalConfig: RequestConfig = { ...config, method: "POST" };
    for (const interceptor of this.requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }

    const url = this.buildUrl(endpoint);
    const requestInit: RequestInit = {
      method: "POST",
      headers: finalConfig.headers, // Don't set Content-Type for FormData
      body: formData,
      signal: this.createAbortSignal(
        finalConfig.timeout || this.defaultTimeout
      ),
    };

    try {
      const response = await fetch(url, requestInit);
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.createApiError(error);
    }
  }

  // Interceptor methods
  public addRequestInterceptor(
    interceptor: (config: RequestConfig) => RequestConfig
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(
    interceptor: (response: ApiResponse) => ApiResponse
  ): void {
    this.responseInterceptors.push(interceptor);
  }

  public addErrorInterceptor(
    interceptor: (error: ApiError) => ApiError | void
  ): void {
    this.errorInterceptors.push(interceptor);
  }

  // Cache methods
  public clearCache(): void {
    this.cache.clear();
  }

  public removeCacheItem(key: string): void {
    this.cache.delete(key);
  }

  // Private helper methods
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }

    const baseUrl = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return `${baseUrl}${path}`;
  }

  private createAbortSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  private async handleResponse<T>(
    response: Response,
    responseType: RequestConfig["responseType"] = "json"
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let data: any;

    try {
      switch (responseType) {
        case "json":
          data = await response.json();
          break;
        case "text":
          data = await response.text();
          break;
        case "blob":
          data = await response.blob();
          break;
        case "arrayBuffer":
          data = await response.arrayBuffer();
          break;
        default:
          data = await response.json();
      }
    } catch (error) {
      if (response.ok) {
        data = null; // Empty response body is ok for some requests
      } else {
        throw error;
      }
    }

    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
      length: undefined,
      user: undefined,
      success: undefined,
    };

    if (!response.ok) {
      throw this.createApiError(apiResponse);
    }

    return apiResponse;
  }

  public async refreshToken(
    url: string,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<any> {
    const refreshToken = storageUtility.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return;

    // Use refreshToken in Authorization header
    const headers = {
      ...config.headers,
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await this.post<any>(url, undefined, {
        ...config,
        headers,
      });
      return dataMapper<any>(response);
    } catch (error) {
      logger.error("Refresh token failed:", error);
      throw error;
    }
  }

  public async resetPassword(
    url: string,
    token: string,
    password: string
  ): Promise<any> {
    try {
      logger.info("Resetting password", { token }, "AuthService");

      return await this.post(url, { token, password }, { skipAuth: true });
    } catch (error) {
      logger.error("Reset password failed:", error);
      throw error;
    }
  }

  private createApiError(error: any): ApiError {
    if (error.data && error.status) {
      // API error response
      return {
        message: error.data.message || error.statusText || "Request failed",
        status: error.status,
        code: error.data.code,
        details: error.data,
      };
    }

    if (error.name === "AbortError") {
      return {
        message: "Request timeout",
        status: 408,
        code: "TIMEOUT",
      };
    }

    if (error.message === "Failed to fetch") {
      return {
        message: "Network error",
        status: 0,
        code: "NETWORK_ERROR",
      };
    }

    return {
      message: error.message || "Unknown error",
      status: error.status || 500,
      code: error.code || "UNKNOWN_ERROR",
      details: error,
    };
  }

  private getCacheKey(method: string, url: string, body?: any): string {
    const bodyStr = body ? JSON.stringify(body) : "";
    return `${method}:${url}:${bodyStr}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    return Date.now() - cached.timestamp < cached.ttl * 1000;
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  private setCache(key: string, data: any, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const httpClient = HttpClient.getInstance();

// Centralized data mapper for all API responses
function dataMapper<T>(response: ApiResponse<any>): T {
  logger.info("API Response:", response, "HttpClient");
  // Unwrap nested "data" layers
  let payload = response.data;
  while (payload && typeof payload === "object" && "data" in payload) {
    payload = payload.data;
  }
  return payload as T;
}

// Helper functions
export const get = <T = any>(endpoint: string, config?: any) =>
  httpClient.get<T>(endpoint, config).then(dataMapper);

export const post = <T = any>(endpoint: string, body?: any, config?: any) =>
  httpClient.post<T>(endpoint, body, config).then(dataMapper);

export const put = <T = any>(endpoint: string, body?: any, config?: any) =>
  httpClient.put<T>(endpoint, body, config).then(dataMapper);

export const patch = <T = any>(endpoint: string, body?: any, config?: any) =>
  httpClient.patch<T>(endpoint, body, config).then(dataMapper);

export const del = <T = any>(endpoint: string, config?: any) =>
  httpClient.delete<T>(endpoint, config).then(dataMapper);

export const upload = <T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
) => httpClient.upload<T>(endpoint, file, additionalData).then(dataMapper);
