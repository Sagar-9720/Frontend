import { useMemo } from 'react';

export interface PageResourceInput {
  status: 'idle' | 'loading' | 'success' | 'error';
  hasFetched?: boolean; // optional; if omitted, we don't suppress initial loading
  error?: string | null;
}

export interface PageResourceState {
  initialLoading: boolean;
  showError: boolean;
  ready: boolean;
  isEmpty: boolean;
}

export function usePageResourceState<T>(input: PageResourceInput, data: T | T[] | null): PageResourceState {
  return useMemo(() => {
    const { status } = input;
    const hasFetched = Boolean(input.hasFetched);
    const initialLoading = status === 'loading' && (!input.hasFetched || !hasFetched);
    const showError = status === 'error' && (input.hasFetched ? hasFetched : true);
    const ready = !initialLoading && !showError;
    const isEmpty = ready && Array.isArray(data) && data.length === 0;
    return { initialLoading, showError, ready, isEmpty };
  }, [input.status, input.hasFetched, data]);
}

export function getDebugFlag(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debug') === '1';
  } catch {
    return false;
  }
}