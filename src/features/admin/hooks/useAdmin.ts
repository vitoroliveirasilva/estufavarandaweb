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

export const adminQueryKeys = {
  root: ["admin"] as const,
  users: () => [...adminQueryKeys.root, "users"] as const,
  usersList: (params: AdminUserListParams) =>
    [...adminQueryKeys.users(), params] as const,
  loginAttempts: () => [...adminQueryKeys.root, "login-attempts"] as const,
  loginAttemptsList: (params: LoginAttemptsParams) =>
    [...adminQueryKeys.loginAttempts(), params] as const
};

export function normalizeAdminCreateUserFormValues(
  values: AdminCreateUserFormValues
): AdminCreateUserPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    is_admin: values.is_admin,
    is_active: values.is_active
  };
}

export function useAdminUsers(params: AdminUserListParams) {
  return useQuery({
    queryKey: adminQueryKeys.usersList(params),
    queryFn: () => listAdminUsers(params)
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
  return useMutation({
    mutationFn: (userId: number) => revokeAdminUserSessions(userId)
  });
}

export function useLoginAttempts(params: LoginAttemptsParams) {
  return useQuery({
    queryKey: adminQueryKeys.loginAttemptsList(params),
    queryFn: () => listLoginAttempts(params)
  });
}