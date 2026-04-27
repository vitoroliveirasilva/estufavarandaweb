import type { PaginationMeta } from "@/core/api/responseEnvelope";

export const NOTIFICATION_STATUSES = ["pending", "read", "discarded"] as const;

export type KnownNotificationStatus = (typeof NOTIFICATION_STATUSES)[number];
export type NotificationStatus = KnownNotificationStatus | (string & {});
export type NotificationStatusFilter = "" | KnownNotificationStatus;

export type NotificationItem = {
  id: number;
  plant_id: number | null;
  type: string;
  title: string;
  body: string;
  status: NotificationStatus;
  created_at: string;
  read_at: string | null;
  discarded_at: string | null;
};

export type NotificationListParams = {
  page?: number;
  page_size?: number;
  status?: NotificationStatusFilter | string;
};

export type PaginatedNotificationsResult = {
  items: NotificationItem[];
  meta?: PaginationMeta;
};

export type NotificationActionResponse = {
  id: number;
  status: NotificationStatus;
  read_at?: string | null;
  discarded_at?: string | null;
};

export function isKnownNotificationStatus(
  value: string | null | undefined
): value is KnownNotificationStatus {
  return NOTIFICATION_STATUSES.includes(value as KnownNotificationStatus);
}
