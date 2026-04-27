import { QueryClient } from "@tanstack/react-query";

const QUERY_STALE_TIME_MS = 60_000;
const QUERY_GC_TIME_MS = 5 * 60_000;
const MAX_QUERY_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 10_000;
const RETRYABLE_STATUS_CODES = new Set([408, 429]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getHttpStatus(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  if (typeof error.status === "number") {
    return error.status;
  }

  const response = error.response;

  if (isRecord(response) && typeof response.status === "number") {
    return response.status;
  }

  return undefined;
}

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }

  const status = getHttpStatus(error);

  if (typeof status === "number") {
    return status >= 500 || RETRYABLE_STATUS_CODES.has(status);
  }

  return true;
}

function getRetryDelay(attemptIndex: number) {
  return Math.min(1_000 * 2 ** attemptIndex, MAX_RETRY_DELAY_MS);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_GC_TIME_MS,
      staleTime: QUERY_STALE_TIME_MS,
      retry: shouldRetryQuery,
      retryDelay: getRetryDelay,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
