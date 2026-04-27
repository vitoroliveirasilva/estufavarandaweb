import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type NotificationStatus = "pending" | "read" | "discarded" | string;

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
  status?: string;
};

export type PaginatedNotificationsResult = {
  items: NotificationItem[];
  meta?: PaginationMeta;
};

export type NotificationActionResponse = {
  id: number;
  status: string;
  read_at?: string | null;
  discarded_at?: string | null;
};