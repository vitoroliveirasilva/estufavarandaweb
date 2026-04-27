import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
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

function cleanParams(
  params: AdminUserListParams | LoginAttemptsParams
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

export async function listAdminUsers(
  params: AdminUserListParams = {}
): Promise<PaginatedAdminUsersResult> {
  const response = await apiClient.get<ApiEnvelope<AdminUser[]>>("/admin/users", {
    params: cleanParams(params)
  });

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}

export async function createAdminUser(
  payload: AdminCreateUserPayload
): Promise<AdminUser> {
  const response = await apiClient.post<ApiEnvelope<AdminUser>>(
    "/admin/users",
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function updateAdminUser(
  userId: number,
  payload: AdminUpdateUserPayload
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser>>(
    `/admin/users/${userId}`,
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function activateAdminUser(userId: number): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser>>(
    `/admin/users/${userId}/activate`
  );

  return unwrapEnvelope(response.data);
}

export async function deactivateAdminUser(userId: number): Promise<AdminUser> {
  const response = await apiClient.patch<ApiEnvelope<AdminUser>>(
    `/admin/users/${userId}/deactivate`
  );

  return unwrapEnvelope(response.data);
}

export async function resetAdminUserPassword(
  userId: number,
  payload: AdminResetPasswordPayload
): Promise<Record<string, unknown>> {
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    `/admin/users/${userId}/reset-password`,
    payload
  );

  return unwrapEnvelope(response.data);
}

export async function revokeAdminUserSessions(
  userId: number
): Promise<AdminRevokeSessionsResponse> {
  const response = await apiClient.post<ApiEnvelope<AdminRevokeSessionsResponse>>(
    `/admin/users/${userId}/revoke-sessions`
  );

  return unwrapEnvelope(response.data);
}

export async function listLoginAttempts(
  params: LoginAttemptsParams = {}
): Promise<PaginatedLoginAttemptsResult> {
  const response = await apiClient.get<ApiEnvelope<LoginAttempt[]>>(
    "/admin/login-attempts",
    {
      params: cleanParams(params)
    }
  );

  return {
    items: unwrapEnvelope(response.data),
    meta: response.data.meta
  };
}