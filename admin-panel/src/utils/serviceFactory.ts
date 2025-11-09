import { logger } from './logger';
import { get as httpGet, post as httpPost, put as httpPut, del as httpDel } from './http-client';
import type { RequestConfig } from './http-client';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export const buildQuery = (params?: QueryParams): string => {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => [k, String(v)] as [string, string]);
  if (!entries.length) return '';
  const qs = new URLSearchParams(Object.fromEntries(entries)).toString();
  return qs ? `?${qs}` : '';
};

export const withQuery = (baseUrl: string, params?: QueryParams): string => {
  const q = buildQuery(params);
  return q ? `${baseUrl}${q}` : baseUrl;
};

export interface ServiceClient {
  get: <T>(url: string, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>) => Promise<T>;
  getWithQuery: <T>(baseUrl: string, params?: QueryParams, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>) => Promise<T>;
  post: <T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>, ctx?: Record<string, unknown>) => Promise<T>;
  put: <T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>, ctx?: Record<string, unknown>) => Promise<T>;
  del: <T = unknown>(url: string, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>) => Promise<T>;
}

export const createServiceClient = (source: string): ServiceClient => {
  const log = logger.forSource(source);

  return {
    async get<T>(url: string, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>): Promise<T> {
      log.info('GET', { url, ...ctx });
      const data = await httpGet<T>(url, config);
      log.info('GET success', { url });
      return data as T;
    },
    async getWithQuery<T>(baseUrl: string, params?: QueryParams, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>): Promise<T> {
      const url = withQuery(baseUrl, params);
      return this.get<T>(url, config, { ...ctx, params });
    },
    async post<T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>, ctx?: Record<string, unknown>): Promise<T> {
      log.info('POST', { url, body: body && typeof body === 'object' ? { ...body, __size: undefined } : body, ...ctx });
      const data = await httpPost<T>(url, body, config);
      log.info('POST success', { url });
      return data as T;
    },
    async put<T>(url: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>, ctx?: Record<string, unknown>): Promise<T> {
      log.info('PUT', { url, body: body && typeof body === 'object' ? { ...body, __size: undefined } : body, ...ctx });
      const data = await httpPut<T>(url, body, config);
      log.info('PUT success', { url });
      return data as T;
    },
    async del<T = unknown>(url: string, config?: Omit<RequestConfig, 'method'>, ctx?: Record<string, unknown>): Promise<T> {
      log.info('DELETE', { url, ...ctx });
      const data = await httpDel<T>(url, config);
      log.info('DELETE success', { url });
      return data as T;
    },
  };
};
