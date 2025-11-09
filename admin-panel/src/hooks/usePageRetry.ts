import { useEffect, useRef } from 'react';

/** Single-pass retry on empty data without error */
export function usePageRetry({ dataLength, loading, error, refetch, maxAttempts = 1 }: {
  dataLength: number;
  loading: boolean;
  error: string | null | undefined;
  refetch?: () => Promise<unknown> | void;
  maxAttempts?: number;
}) {
  const attemptsRef = useRef(0);
  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (attemptsRef.current >= maxAttempts) return;
    if (dataLength === 0) {
      attemptsRef.current += 1;
      try { void refetch?.(); } catch {/* ignore */}
    }
  }, [dataLength, loading, error, refetch, maxAttempts]);
  return { attempts: attemptsRef.current };
}

