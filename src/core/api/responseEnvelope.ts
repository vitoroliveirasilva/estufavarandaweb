export type PaginationMeta = {
  page: number;
  page_size: number;
  total: number;
  total_pages?: number;
};

export type ApiEnvelope<T> = {
  data: T;
  meta?: PaginationMeta;
};

export function isApiEnvelope<T = unknown>(
  value: unknown,
): value is ApiEnvelope<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, "data")
  );
}

export function unwrapEnvelope<T>(payload: ApiEnvelope<T> | T): T {
  if (isApiEnvelope<T>(payload)) {
    return payload.data;
  }

  return payload;
}

export function unwrapMeta<T>(
  payload: ApiEnvelope<T>,
): PaginationMeta | undefined {
  return payload.meta;
}
