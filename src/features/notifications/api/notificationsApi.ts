import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  NotificationActionResponse,
  NotificationItem,
  NotificationListParams,
  PaginatedNotificationsResult
} from "@/features/notifications/types/notificationTypes";
import { isKnownNotificationStatus } from "@/features/notifications/types/notificationTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number
): number {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return fallback;
  }

  return max ? Math.min(numericValue, max) : numericValue;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} inválido.`);
  }
}

function cleanParams(
  params: NotificationListParams
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  if (params.page !== undefined) {
    cleaned.page = normalizePositiveInteger(params.page, DEFAULT_PAGE);
  }

  if (params.page_size !== undefined) {
    cleaned.page_size = normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
  }

  const normalizedStatus = params.status?.trim();

  if (normalizedStatus && isKnownNotificationStatus(normalizedStatus)) {
    cleaned.status = normalizedStatus;
  }

  return cleaned;
}

export async function listNotifications(
  params: NotificationListParams = {}
): Promise<PaginatedNotificationsResult> {
  const response = await apiClient.get<ApiEnvelope<NotificationItem[]>>(
    "/notifications",
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function markNotificationAsRead(
  notificationId: number
): Promise<NotificationActionResponse> {
  assertPositiveInteger(notificationId, "Notificação");

  const response = await apiClient.patch<ApiEnvelope<NotificationActionResponse>>(
    `/notifications/${notificationId}/read`
  );

  return unwrapEnvelope(response.data);
}

export async function discardNotification(
  notificationId: number
): Promise<NotificationActionResponse> {
  assertPositiveInteger(notificationId, "Notificação");

  const response = await apiClient.patch<ApiEnvelope<NotificationActionResponse>>(
    `/notifications/${notificationId}/discard`
  );

  return unwrapEnvelope(response.data);
}
