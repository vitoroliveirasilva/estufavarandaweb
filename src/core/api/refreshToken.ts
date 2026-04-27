import { publicApiClient } from "@/core/api/apiClient";
import { unwrapEnvelope, type ApiEnvelope } from "@/core/api/responseEnvelope";
import { type AuthUser } from "@/core/auth/authStore";
import { tokenStorage, type TokenPair } from "@/core/auth/tokenStorage";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: unknown;
};

function normalizeTokenResponse(response: TokenResponse): TokenPair {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresIn: response.expires_in,
  };
}

export async function refreshAccessToken(): Promise<TokenPair> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token não encontrado.");
  }

  const response = await publicApiClient.post<ApiEnvelope<TokenResponse>>(
    "/auth/refresh",
    {
      refresh_token: refreshToken,
    },
  );

  const tokens = normalizeTokenResponse(unwrapEnvelope(response.data));
  tokenStorage.setTokens(tokens);

  return tokens;
}

export async function fetchCurrentUserWithToken(
  accessToken: string,
): Promise<AuthUser> {
  const response = await publicApiClient.get<ApiEnvelope<AuthUser>>(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return unwrapEnvelope(response.data);
}

export async function bootstrapSessionFromRefreshToken(): Promise<AuthUser> {
  const tokens = await refreshAccessToken();
  return fetchCurrentUserWithToken(tokens.accessToken);
}
