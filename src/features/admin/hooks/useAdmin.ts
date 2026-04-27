import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activateAdminUser,
  createAdminUser,
  deactivateAdminUser,
  listAdminUsers,
  listLoginAttempts,
  resetAdminUserPassword,
  revokeAdminUserSessions,
  updateAdminUser
} from "@/features/admin/api/adminApi";
import type { AdminCreateUserFormValues } from "@/features/admin/schemas/adminSchemas";
import type {
  AdminCreateUserPayload,
  AdminResetPasswordPayload,
  AdminUpdateUserPayload,
  AdminUserListParams,
  LoginAttemptsParams
} from "@/features/admin/types/adminTypes";

type AdminQueryOptions = {
  enabled?: boolean;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

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

export function normalizeAdminUserListParams(
  params: AdminUserListParams = {}
): Required<Pick<AdminUserListParams, "page" | "page_size">> &
  Pick<AdminUserListParams, "search"> {
  const search = params.search?.trim().replace(/\s+/g, " ");

  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    ),
    ...(search ? { search } : {})
  };
}

export function normalizeLoginAttemptsParams(
  params: LoginAttemptsParams = {}
): Required<LoginAttemptsParams> {
  return {
    page: normalizePositiveInteger(params.page, DEFAULT_PAGE),
    page_size: normalizePositiveInteger(
      params.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    )
  };
}

export const adminQueryKeys = {
  root: ["admin"] as const,
  users: () => [...adminQueryKeys.root, "users"] as const,
  usersList: (params: AdminUserListParams) =>
    [...adminQueryKeys.users(), normalizeAdminUserListParams(params)] as const,
  loginAttempts: () => [...adminQueryKeys.root, "login-attempts"] as const,
  loginAttemptsList: (params: LoginAttemptsParams) =>
    [...adminQueryKeys.loginAttempts(), normalizeLoginAttemptsParams(params)] as const
};

export function normalizeAdminCreateUserFormValues(
  values: AdminCreateUserFormValues
): AdminCreateUserPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    is_admin: values.is_admin,
    is_active: values.is_active
  };
}

export function useAdminUsers(
  params: AdminUserListParams,
  options: AdminQueryOptions = {}
) {
  const normalizedParams = normalizeAdminUserListParams(params);

  return useQuery({
    queryKey: adminQueryKeys.usersList(normalizedParams),
    queryFn: () => listAdminUsers(normalizedParams),
    enabled: options.enabled ?? true
  });
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminCreateUserPayload) => createAdminUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users()
      });
    }
  });
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload
    }: {
      userId: number;
      payload: AdminUpdateUserPayload;
    }) => updateAdminUser(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users()
      });
    }
  });
}

export function useActivateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => activateAdminUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users()
      });
    }
  });
}

export function useDeactivateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deactivateAdminUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users()
      });
    }
  });
}

export function useResetAdminUserPasswordMutation() {
  return useMutation({
    mutationFn: ({
      userId,
      payload
    }: {
      userId: number;
      payload: AdminResetPasswordPayload;
    }) => resetAdminUserPassword(userId, payload)
  });
}

export function useRevokeAdminUserSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => revokeAdminUserSessions(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users()
      });
    }
  });
}

export function useLoginAttempts(
  params: LoginAttemptsParams,
  options: AdminQueryOptions = {}
) {
  const normalizedParams = normalizeLoginAttemptsParams(params);

  return useQuery({
    queryKey: adminQueryKeys.loginAttemptsList(normalizedParams),
    queryFn: () => listLoginAttempts(normalizedParams),
    enabled: options.enabled ?? true
  });
}
