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

const DEFAULT_DEVICE_NAME = "Web";
const MAX_DEVICE_NAME_LENGTH = 80;
const GENERIC_FORGOT_PASSWORD_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function normalizeExpiresIn(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return parsedValue;
    }
  }

  return undefined;
}

function normalizeDeviceName(deviceName: string | undefined): string {
  const normalized = deviceName?.trim() || DEFAULT_DEVICE_NAME;
  return normalized.slice(0, MAX_DEVICE_NAME_LENGTH);
}

function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "number" ? value.id : Number(value.id);
  const name = asNonEmptyString(value.name);
  const email = asNonEmptyString(value.email);
  const lastLoginAt = value.last_login_at;

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !name ||
    !email ||
    typeof value.is_admin !== "boolean" ||
    typeof value.is_active !== "boolean" ||
    !(
      typeof lastLoginAt === "string" ||
      lastLoginAt === null ||
      lastLoginAt === undefined
    )
  ) {
    return null;
  }

  return {
    id,
    name,
    email,
    is_admin: value.is_admin,
    is_active: value.is_active,
    last_login_at: lastLoginAt ?? null,
  };
}

function normalizeRequiredAuthUser(value: unknown): AuthUser {
  const user = normalizeAuthUser(value);

  if (!user) {
    throw new Error("Resposta de usuário inválida.");
  }

  return user;
}

function normalizeTokenResponse(data: unknown): TokenPair {
  if (!isRecord(data)) {
    throw new Error("Resposta de autenticação inválida.");
  }

  const accessToken = asNonEmptyString(data.access_token);
  const refreshToken = asNonEmptyString(data.refresh_token);

  if (!accessToken || !refreshToken) {
    throw new Error("Resposta de autenticação inválida.");
  }

  return {
    accessToken,
    refreshToken,
    expiresIn: normalizeExpiresIn(data.expires_in),
  };
}

function normalizeMessageResponse(
  response: MessageResponse | unknown,
  fallbackMessage: string,
): MessageResponse {
  if (isRecord(response)) {
    const message = asNonEmptyString(response.message);

    if (message) {
      return { message };
    }
  }

  return {
    message: fallbackMessage,
  };
}

export async function login(payload: LoginRequest): Promise<LoginResult> {
  const response = await publicApiClient.post<ApiEnvelope<AuthTokenResponse>>(
    "/auth/login",
    {
      email: payload.email.trim(),
      password: payload.password,
      device_name: normalizeDeviceName(payload.device_name),
    },
  );

  const data = unwrapEnvelope(response.data);

  return {
    tokens: normalizeTokenResponse(data),
    user: normalizeAuthUser(isRecord(data) ? data.user : null),
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiEnvelope<AuthUser>>("/auth/me");
  return normalizeRequiredAuthUser(unwrapEnvelope(response.data));
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const captchaToken = payload.captcha_token?.trim() || null;
  const requestPayload: { email: string; captcha_token?: string } = {
    email: payload.email.trim(),
  };

  if (captchaToken) {
    requestPayload.captcha_token = captchaToken;
  }

  const response = await publicApiClient.post<ApiEnvelope<MessageResponse>>(
    "/auth/forgot-password",
    requestPayload,
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
    {
      token: payload.token.trim(),
      new_password: payload.new_password,
    },
  );

  return normalizeMessageResponse(
    unwrapEnvelope(response.data),
    "Senha redefinida com sucesso.",
  );
}

export async function logout(payload: LogoutRequest): Promise<void> {
  const refreshToken = payload.refresh_token.trim();

  if (!refreshToken) {
    return;
  }

  await publicApiClient.post("/auth/logout", {
    refresh_token: refreshToken,
  });
}

export async function registerDevice(
  payload: RegisterDeviceRequest,
): Promise<RegisterDeviceResponse> {
  const response = await apiClient.post<ApiEnvelope<RegisterDeviceResponse>>(
    "/auth/devices/register",
    {
      ...payload,
      device_name: normalizeDeviceName(payload.device_name),
      push_token: payload.push_token?.trim() || null,
    },
  );

  return unwrapEnvelope(response.data);
}
