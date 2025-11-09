/* eslint-disable @typescript-eslint/no-explicit-any */
// HTTP Client - Centralized HTTP request handling
import { environmentHelper } from "./env-helper";
import { storageUtility } from "./storage-utility";
import { logger } from "./logger";
import { HTTP_STATUS, STORAGE_KEYS } from "./constants";

const httpLog = logger.forSource('HttpClient');

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  skipAuth?: boolean;
  responseType?: "json" | "text" | "blob" | "arrayBuffer";
}

export interface ApiResponse<T = unknown> {
  success: unknown;
  length: unknown;
  user: unknown;
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export class HttpClient {
  private static instance: HttpClient;
  private baseURL: string;
  private defaultTimeout: number;
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> =
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
        httpLog.warn('Unauthorized - clearing auth and redirecting to login');
        storageUtility.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        storageUtility.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        storageUtility.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = "/login";
      }
      return error;
    });
  }

  // Core request method
  public async request<T = unknown>(
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
      const cachedData = this.getFromCache(cacheKey) as ApiResponse<T> | null;
      if (cachedData) {
        httpLog.info(`Cache hit for ${url}`);
        return cachedData;
      }
    }

    const requestInit: RequestInit = {
      method,
      headers: (() => {
        const base: Record<string, string> = { ...finalConfig.headers };
        // Only attach JSON content-type if we actually send a body and method is not GET
        if (body && method !== 'GET') {
          base['Content-Type'] = 'application/json';
        }
        return base;
      })(),
      body: body ? JSON.stringify(body) : undefined,
      signal: this.createAbortSignal(timeout),
    };

    let lastError: unknown;

    const maxRetries = 0; // 1 attempt only
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const start = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const authPresent = Boolean((requestInit.headers as Record<string, string> | undefined)?.Authorization || (requestInit.headers as Record<string, string> | undefined)?.authorization);
        const contentType = (requestInit.headers as Record<string, string> | undefined)?.['Content-Type'] || (requestInit.headers as Record<string, string> | undefined)?.['content-type'];
        httpLog.api.request(method, url, { attempt: attempt + 1, cache, authPresent, contentType, hasBody: Boolean(body) });

        const response = await fetch(url, requestInit);
        let finalResponse = await this.handleResponse<T>(response, responseType);
        for (const interceptor of this.responseInterceptors) {
          const intercepted = interceptor(finalResponse as unknown as ApiResponse);
          // Preserve generic type T for data field if structure matches
          finalResponse = intercepted as ApiResponse<T>;
        }

        // Cache successful GET responses
        if (method === "GET" && cache && response.ok) {
          this.setCache(
            cacheKey,
            finalResponse,
            environmentHelper.get("CACHE_TTL", 300)
          );
        }

        const end = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const durationMs = Math.round(end - start);
        httpLog.api.response(method, url, response.status, { statusText: response.statusText, durationMs });
        httpLog.performance('http_latency', durationMs, 'ms');
        httpLog.info(
          `${method} ${url} - ${response.status} ${response.statusText}`
        );
        return finalResponse;
      } catch (error) {
        lastError = error;
        httpLog.error(
          `${method} ${url} failed (attempt ${attempt + 1})`,
          error as unknown
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
  public async get<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  public async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  public async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  public async delete<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, "method"> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // File upload
  public async upload<T = unknown>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        } else if (value != null) {
          formData.append(key, JSON.stringify(value));
        }
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
      httpLog.api.request('POST', url, { upload: true, fields: additionalData ? Object.keys(additionalData) : [] });
      const response = await fetch(url, requestInit);
      const result = await this.handleResponse<T>(response);
      httpLog.api.response('POST', url, response.status, { upload: true });
      return result;
    } catch (error) {
      httpLog.error('File upload failed', error as unknown);
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

    let data: unknown;

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

    const apiResponse: ApiResponse<unknown> = {
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

    return apiResponse as ApiResponse<T>;
  }

  public async refreshToken(
    url: string,
    config: Omit<RequestConfig, "method" | "body"> = {}
  ): Promise<unknown> {
    const refreshToken = storageUtility.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return;

    // Use refreshToken in Authorization header
    const headers = {
      ...config.headers,
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    };

    try {
      httpLog.api.request('POST', this.buildUrl(url), { purpose: 'refreshToken' });
      const response = await this.post<unknown>(url, undefined, {
        ...config,
        headers,
      });
      httpLog.api.response('POST', this.buildUrl(url), 200, { purpose: 'refreshToken' });
      return dataMapper<unknown>(response);
    } catch (error) {
      httpLog.error("Refresh token failed:", error as unknown);
      throw error;
    }
  }

  public async resetPassword(
    url: string,
    token: string,
    password: string
  ): Promise<unknown> {
    try {
      httpLog.info("Resetting password", { tokenPresent: Boolean(token), scope: 'AuthService' });

      return await this.post<unknown>(url, { token, password }, { skipAuth: true });
    } catch (error) {
      httpLog.error("Reset password failed:", error as unknown);
      throw error;
    }
  }

  private createApiError(error: unknown): ApiError {
    const errObj = error as { data?: any; status?: number; statusText?: string; name?: string; message?: string; code?: string };
    if (errObj?.data && errObj?.status) {
      // API error response
      return {
        message: errObj.data.message || errObj.statusText || "Request failed",
        status: errObj.status!,
        code: errObj.data.code,
        details: errObj.data,
      };
    }

    if ((errObj as any)?.name === "AbortError") {
      return {
        message: "Request timeout",
        status: 408,
        code: "TIMEOUT",
      };
    }

    if (errObj?.message === "Failed to fetch") {
      return {
        message: "Network error",
        status: 0,
        code: "NETWORK_ERROR",
      };
    }

    return {
      message: errObj?.message || "Unknown error",
      status: errObj?.status || 500,
      code: errObj?.code || "UNKNOWN_ERROR",
      details: error,
    };
  }

  private getCacheKey(method: string, url: string, body?: unknown): string {
    let bodyStr = "";
    if (body) {
      try {
        bodyStr = JSON.stringify(body);
      } catch {
        bodyStr = "[unstringifiable]";
      }
    }
    return `${method}:${url}:${bodyStr}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    return Date.now() - cached.timestamp < cached.ttl * 1000;
  }

  private getFromCache(key: string): unknown {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  private setCache(key: string, data: unknown, ttlSeconds: number): void {
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
function dataMapper<T>(response: ApiResponse<unknown>): T {
  httpLog.info("API Response", { response });
  // Unwrap nested "data" layers
  let payload = response.data;
  while (payload && typeof payload === "object" && "data" in payload) {
    payload = (payload as { data: unknown }).data;
  }
  return payload as T;
}

// Helper functions
export const get = <T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
  httpClient.get<T>(endpoint, config || {}).then(dataMapper);

export const post = <T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  httpClient.post<T>(endpoint, body, config || {}).then(dataMapper);

export const put = <T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  httpClient.put<T>(endpoint, body, config || {}).then(dataMapper);

export const patch = <T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  httpClient.patch<T>(endpoint, body, config || {}).then(dataMapper);

export const del = <T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
  httpClient.delete<T>(endpoint, config || {}).then(dataMapper);

export const upload = <T = unknown>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, unknown>
 ) => httpClient.upload<T>(endpoint, file, additionalData).then(dataMapper);
