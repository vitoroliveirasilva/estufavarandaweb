import { publicApiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import { type AuthUser } from "@/core/auth/authStore";
import { tokenStorage, type TokenPair } from "@/core/auth/tokenStorage";

type TokenResponse = {
  access_token?: unknown;
  accessToken?: unknown;
  refresh_token?: unknown;
  refreshToken?: unknown;
  expires_in?: unknown;
  expiresIn?: unknown;
  user?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getStringField(
  payload: TokenResponse,
  snakeCaseKey: keyof TokenResponse,
  camelCaseKey: keyof TokenResponse,
): string | undefined {
  const value = payload[snakeCaseKey] ?? payload[camelCaseKey];

  if (!isNonEmptyString(value)) {
    return undefined;
  }

  return value.trim();
}

function normalizeExpiresIn(payload: TokenResponse): number | undefined {
  const rawValue = payload.expires_in ?? payload.expiresIn;

  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    return undefined;
  }

  return rawValue > 0 ? rawValue : undefined;
}

function normalizeTokenResponse(response: unknown): TokenPair {
  if (!isRecord(response)) {
    throw new Error("Resposta inválida ao renovar sessão.");
  }

  const payload = response as TokenResponse;
  const accessToken = getStringField(payload, "access_token", "accessToken");
  const refreshToken = getStringField(payload, "refresh_token", "refreshToken");

  if (!accessToken || !refreshToken) {
    throw new Error("Resposta de autenticação sem tokens válidos.");
  }

  return {
    accessToken,
    refreshToken,
    expiresIn: normalizeExpiresIn(payload),
  };
}

export async function refreshAccessToken(): Promise<TokenPair> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!isNonEmptyString(refreshToken)) {
    throw new Error("Refresh token não encontrado.");
  }

  const response = await publicApiClient.post<ApiEnvelope<TokenResponse>>(
    "/auth/refresh",
    {
      refresh_token: refreshToken.trim(),
    },
  );

  const tokens = normalizeTokenResponse(unwrapEnvelope(response.data));
  tokenStorage.setTokens(tokens);

  return tokens;
}

export async function fetchCurrentUserWithToken(
  accessToken: string,
): Promise<AuthUser> {
  if (!isNonEmptyString(accessToken)) {
    throw new Error("Access token não encontrado.");
  }

  const response = await publicApiClient.get<ApiEnvelope<AuthUser> | AuthUser>(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken.trim()}`,
      },
    },
  );

  return unwrapEnvelope(response.data);
}

export async function bootstrapSessionFromRefreshToken(): Promise<AuthUser> {
  const tokens = await refreshAccessToken();
  return fetchCurrentUserWithToken(tokens.accessToken);
}
