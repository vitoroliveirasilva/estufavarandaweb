import { apiClient, publicApiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import type { AuthUser } from "@/core/auth/authStore";
import type { TokenPair } from "@/core/auth/tokenStorage";
import type {
  AuthTokenResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResult,
  LogoutRequest,
  MessageResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  ResetPasswordRequest,
} from "@/features/auth/types/authTypes";

const GENERIC_FORGOT_PASSWORD_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!isRecord(value)) {
    return false;
  }

  const lastLoginAt = value.last_login_at;

  return (
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.is_admin === "boolean" &&
    typeof value.is_active === "boolean" &&
    (typeof lastLoginAt === "string" || lastLoginAt === null)
  );
}

function normalizeTokenResponse(data: AuthTokenResponse): TokenPair {
  if (
    typeof data.access_token !== "string" ||
    data.access_token.trim().length === 0 ||
    typeof data.refresh_token !== "string" ||
    data.refresh_token.trim().length === 0
  ) {
    throw new Error("Resposta de autenticação inválida.");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

function normalizeMessageResponse(
  response: MessageResponse | unknown,
  fallbackMessage: string,
): MessageResponse {
  if (isRecord(response) && typeof response.message === "string") {
    return {
      message: response.message,
    };
  }

  return {
    message: fallbackMessage,
  };
}

export async function login(payload: LoginRequest): Promise<LoginResult> {
  const response = await publicApiClient.post<ApiEnvelope<AuthTokenResponse>>(
    "/auth/login",
    {
      email: payload.email,
      password: payload.password,
      device_name: payload.device_name ?? "Web",
    },
  );

  const data = unwrapEnvelope(response.data);

  return {
    tokens: normalizeTokenResponse(data),
    user: isAuthUser(data.user) ? data.user : null,
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiEnvelope<AuthUser>>("/auth/me");
  return unwrapEnvelope(response.data);
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const response = await publicApiClient.post<ApiEnvelope<MessageResponse>>(
    "/auth/forgot-password",
    payload,
  );

  return normalizeMessageResponse(
    unwrapEnvelope(response.data),
    GENERIC_FORGOT_PASSWORD_MESSAGE,
  );
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<MessageResponse> {
  const response = await publicApiClient.post<ApiEnvelope<MessageResponse>>(
    "/auth/reset-password",
    payload,
  );

  return normalizeMessageResponse(
    unwrapEnvelope(response.data),
    "Senha redefinida com sucesso.",
  );
}

export async function logout(payload: LogoutRequest): Promise<void> {
  await publicApiClient.post("/auth/logout", payload);
}

export async function registerDevice(
  payload: RegisterDeviceRequest,
): Promise<RegisterDeviceResponse> {
  const response = await apiClient.post<ApiEnvelope<RegisterDeviceResponse>>(
    "/auth/devices/register",
    payload,
  );

  return unwrapEnvelope(response.data);
}
