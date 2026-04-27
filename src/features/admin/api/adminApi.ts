import { apiClient } from "@/core/api/apiClient";
import {
  isApiEnvelope,
  unwrapEnvelope,
  type ApiEnvelope,
  type PaginationMeta
} from "@/core/api/responseEnvelope";
import type {
  AdminCreateUserPayload,
  AdminResetPasswordPayload,
  AdminRevokeSessionsResponse,
  AdminUpdateUserPayload,
  AdminUser,
  AdminUserListParams,
  LoginAttempt,
  LoginAttemptsParams,
  PaginatedAdminUsersResult,
  PaginatedLoginAttemptsResult
} from "@/features/admin/types/adminTypes";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 120;

type QueryParams = Record<string, string | number | boolean>;
type PaginatedPayload<T> = ApiEnvelope<T[]> | T[];

function normalizePositiveInteger(
  value: unknown,
  fallback: number,
  max?: number
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function normalizeSearch(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed ? trimmed.slice(0, MAX_SEARCH_LENGTH) : undefined;
}

function assertValidUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("ID de usuário administrativo inválido.");
  }
}

function userAdminPath(userId: number, suffix = ""): string {
  assertValidUserId(userId);
  return `/admin/users/${encodeURIComponent(String(userId))}${suffix}`;
}

function cleanUserListParams(params: AdminUserListParams = {}): QueryParams {
  const cleaned: QueryParams = {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    )
  };

  const search = normalizeSearch(params.search);

  if (search) {
    cleaned.search = search;
  }

  return cleaned;
}

function cleanLoginAttemptsParams(params: LoginAttemptsParams = {}): QueryParams {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    )
  };
}

function readPaginationMeta<T>(payload: PaginatedPayload<T>): PaginationMeta | undefined {
  return isApiEnvelope<T[]>(payload) ? payload.meta : undefined;
}

export async function listAdminUsers(
  params: AdminUserListParams = {}
): Promise<PaginatedAdminUsersResult> {
  const response = await apiClient.get<PaginatedPayload<AdminUser>>("/admin/users", {
    params: cleanUserListParams(params)
  });

  return {
    items: unwrapEnvelope(response.data),
    meta: readPaginationMeta(response.data)
  };
}

export async function createAdminUser(
  payload: AdminCreateUserPayload
): Promise<AdminUser> {
  const response = await apiClient.post<ApiEnvelope<AdminUser> | AdminUser>(
    "/admin/users",
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function updateAdminUser(
  userId: number,
  payload: AdminUpdateUserPayload
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser> | AdminUser>(
    userAdminPath(userId),
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function activateAdminUser(userId: number): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser> | AdminUser>(
    userAdminPath(userId, "/activate")
  );

  return unwrapEnvelope(response.data);
}

export async function deactivateAdminUser(userId: number): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser> | AdminUser>(
    userAdminPath(userId, "/deactivate")
  );

  return unwrapEnvelope(response.data);
}

export async function resetAdminUserPassword(
  userId: number,
  payload: AdminResetPasswordPayload
): Promise<Record<string, unknown>> {
  const response = await apiClient.post<
    ApiEnvelope<Record<string, unknown>> | Record<string, unknown>
  >(userAdminPath(userId, "/reset-password"), payload);

  return unwrapEnvelope(response.data);
}

export async function revokeAdminUserSessions(
  userId: number
): Promise<AdminRevokeSessionsResponse> {
  const response = await apiClient.post<
    ApiEnvelope<AdminRevokeSessionsResponse> | AdminRevokeSessionsResponse
  >(userAdminPath(userId, "/revoke-sessions"));

  return unwrapEnvelope(response.data);
}

export async function listLoginAttempts(
  params: LoginAttemptsParams = {}
): Promise<PaginatedLoginAttemptsResult> {
  const response = await apiClient.get<PaginatedPayload<LoginAttempt>>(
    "/admin/login-attempts",
    {
      params: cleanLoginAttemptsParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: readPaginationMeta(response.data)
  };
}
