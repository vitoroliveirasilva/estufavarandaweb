export type PaginationMeta = {
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
  [key: string]: unknown;
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  success?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isApiEnvelope<T = unknown>(
  value: unknown,
): value is ApiEnvelope<T> {
  return (
    isRecord(value) && Object.prototype.hasOwnProperty.call(value, "data")
  );
}

export function unwrapEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (isApiEnvelope<T>(payload)) {
    return payload.data;
  }

  return payload as T;
}

export function unwrapMeta<T>(
  payload: ApiEnvelope<T> | T,
): PaginationMeta | undefined {
  if (isApiEnvelope<T>(payload) && isRecord(payload.meta)) {
    return payload.meta;
  }

  return undefined;
}
