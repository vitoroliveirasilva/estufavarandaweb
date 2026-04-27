import type { PaginationMeta } from "@/core/api/responseEnvelope";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminUserListParams = {
  page?: number;
  page_size?: number;
  search?: string;
};

export type PaginatedAdminUsersResult = {
  items: AdminUser[];
  meta?: PaginationMeta;
};

export type AdminCreateUserPayload = {
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  is_active: boolean;
};

export type AdminUpdateUserPayload = {
  name?: string;
  email?: string;
  is_admin?: boolean;
  is_active?: boolean;
};

export type AdminResetPasswordPayload = {
  new_password: string;
};

export type AdminRevokeSessionsResponse = {
  revoked_sessions: number;
};

export type LoginAttempt = {
  id: number;
  email: string;
  ip: string | null;
  user_agent: string | null;
  success: boolean;
  created_at: string;
};

export type LoginAttemptsParams = {
  page?: number;
  page_size?: number;
};

export type PaginatedLoginAttemptsResult = {
  items: LoginAttempt[];
  meta?: PaginationMeta;
};
