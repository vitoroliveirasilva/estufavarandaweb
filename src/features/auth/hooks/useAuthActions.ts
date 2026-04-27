import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { setAuthenticated, setUnauthenticated } from "@/core/auth/authStore";
import { tokenStorage } from "@/core/auth/tokenStorage";
import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  resetPassword,
} from "@/features/auth/api/authApi";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from "@/features/auth/types/authTypes";

export const authQueryKeys = {
  root: ["auth"] as const,
  me: ["auth", "me"] as const,
};

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getCurrentUser,
    enabled,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const result = await login(payload);

      tokenStorage.setTokens(result.tokens);

      const user = result.user ?? (await getCurrentUser());

      setAuthenticated(user);
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.root });

      return user;
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
  });
}

async function logoutCurrentSession(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    return;
  }

  try {
    await logout({
      refresh_token: refreshToken,
    });
  } catch {
    // Mesmo se a API falhar, a sessão local deve ser limpa.
  }
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logoutCurrentSession,
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
      setUnauthenticated();
      navigate("/login", { replace: true });
    },
  });

  return {
    logout: () => mutation.mutate(),
    logoutAsync: mutation.mutateAsync,
    isLoggingOut: mutation.isPending,
    errorMessage: mutation.error ? getAppErrorMessage(mutation.error) : null,
  };
}
