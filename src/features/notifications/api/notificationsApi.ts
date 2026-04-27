import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type {
  NotificationActionResponse,
  NotificationItem,
  NotificationListParams,
  PaginatedNotificationsResult
} from "@/features/notifications/types/notificationTypes";

function cleanParams(
  params: NotificationListParams
): Record<string, string | number | boolean> {
  const cleaned: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    cleaned[key] = value;
  });

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
  const response = await apiClient.patch<ApiEnvelope<NotificationActionResponse>>(
    `/notifications/${notificationId}/read`
  );

  return unwrapEnvelope(response.data);
}

export async function discardNotification(
  notificationId: number
): Promise<NotificationActionResponse> {
  const response = await apiClient.patch<ApiEnvelope<NotificationActionResponse>>(
    `/notifications/${notificationId}/discard`
  );

  return unwrapEnvelope(response.data);
}