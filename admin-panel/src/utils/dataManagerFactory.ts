import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from './logger';
import { DATA_MANAGER } from './constants/dataManager';

interface ListHookConfig<T, R = T> {
  sourceName: string;                 // for scoped logging
  fetchFn: () => Promise<R>;          // raw fetcher
  mapFn?: (raw: R) => T;              // optional mapper (single object)
  mapListFn?: (raw: R) => T[];        // optional mapper for list
  fallback?: T | T[] | null;          // optional fallback
  isList?: boolean;                   // treat data as list
  errorMessage: string;               // default error message
  autoRetry?: number;                 // number of auto-retries
  debounceMs?: number;                // debounce delay
  autoStart?: boolean;                // if false, do not fetch automatically on mount
}

interface ListHookResult<T> {
  data: T | T[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | T[] | null>>;
}

/**
 * Generic list/data resource hook factory reducing repetition across DataManagers.
 */
export function useResource<T, R = T>(config: ListHookConfig<T, R>): ListHookResult<T> {
  const {
    sourceName,
    fetchFn,
    mapFn,
    mapListFn,
    fallback = null,
    isList = false,
    errorMessage,
    autoRetry = DATA_MANAGER.AUTO_RETRY,
    debounceMs = DATA_MANAGER.DEBOUNCE_MS,
    autoStart = true,
  } = config;

  const log = logger.forSource(sourceName);
  const [data, setData] = useState<T | T[] | null>(fallback);
  const [loading, setLoading] = useState<boolean>(autoStart);
  const [error, setError] = useState<string | null>(null);
  const attemptsRef = useRef(0);
  const pendingRef = useRef(false);
  const unmountedRef = useRef(false);

  const performFetch = useCallback(async () => {
    if (pendingRef.current) return; // prevent parallel
    pendingRef.current = true;
    setLoading(true);
    log.info('Fetching resource');
    try {
      const raw = await fetchFn();
      let next: unknown = raw;

      if (isList) {
        if (mapListFn) {
          next = mapListFn(raw);
        } else if (Array.isArray(raw) && mapFn) {
          next = raw.map(mapFn);
        } else if (!Array.isArray(raw)) {
          // Non-array returned where list expected
          log.warn('Expected list but received non-array', { type: typeof raw });
          next = [];
        }
      } else if (mapFn) {
        next = mapFn(raw);
      }

      if (!unmountedRef.current) {
        setData(next as T | T[]);
        setError(null);
        log.info('Resource fetch success', { isList, size: Array.isArray(next) ? next.length : undefined });
      }
    } catch (err) {
      log.error('Resource fetch failed', err as unknown);
      if (!unmountedRef.current) {
        setError(errorMessage);
        if (fallback !== null) setData(fallback);
        if (attemptsRef.current < autoRetry) {
          attemptsRef.current += 1;
          log.warn('Retrying resource fetch', { attempt: attemptsRef.current });
          setTimeout(() => performFetch(), 200); // quick retry
        }
      }
    } finally {
      pendingRef.current = false;
      if (!unmountedRef.current) setLoading(false);
    }
  }, [fetchFn, mapFn, mapListFn, isList, errorMessage, autoRetry, fallback, log]);

  useEffect(() => {
    if (!autoStart) return () => { unmountedRef.current = true; };
    const timer = setTimeout(() => {
      performFetch();
    }, debounceMs);
    return () => {
      clearTimeout(timer);
      unmountedRef.current = true;
    };
  }, [performFetch, debounceMs, autoStart]);

  return { data, loading, error, refetch: performFetch, setData };
}

/** Helper to wrap a mutation and then refetch */
export function useMutationWithRefetch<Args extends unknown[], R>(
  mutFn: (...args: Args) => Promise<R>,
  refetch: () => Promise<void>,
  sourceName: string
) {
  const log = logger.forSource(sourceName);
  return async (...args: Args): Promise<R> => {
    log.info('Mutation start');
    const result = await mutFn(...args);
    try {
      await refetch();
    } catch (e) {
      log.error('Refetch after mutation failed', e as unknown);
    }
    return result;
  };
}

// Note: DATA_MANAGER constants are imported from './constants/dataManager'
