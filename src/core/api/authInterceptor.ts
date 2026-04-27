import {
  AxiosHeaders,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "@/core/api/apiClient";
import { refreshAccessToken } from "@/core/api/refreshToken";
import { setUnauthenticated } from "@/core/auth/authStore";
import { tokenStorage, type TokenPair } from "@/core/auth/tokenStorage";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const AUTH_ROUTES_WITHOUT_REFRESH = new Set([
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/logout",
]);

let installed = false;
let refreshPromise: Promise<TokenPair> | null = null;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeUrlPath(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  const fallbackBaseUrl = "http://localhost";
  const baseUrl =
    typeof window === "undefined" ? fallbackBaseUrl : window.location.origin;

  try {
    return new URL(url, baseUrl).pathname;
  } catch {
    return url.split("?")[0];
  }
}

function shouldSkipRefresh(url?: string): boolean {
  const path = normalizeUrlPath(url);

  if (!path) {
    return false;
  }

  return Array.from(AUTH_ROUTES_WITHOUT_REFRESH).some(
    (route) => path === route || path.endsWith(route),
  );
}

function setBearerToken(
  config: InternalAxiosRequestConfig,
  accessToken: string,
): void {
  const headers = AxiosHeaders.from(config.headers);
  headers.set("Authorization", `Bearer ${accessToken.trim()}`);
  config.headers = headers;
}

function clearBearerToken(config: InternalAxiosRequestConfig): void {
  const headers = AxiosHeaders.from(config.headers);
  headers.delete("Authorization");
  config.headers = headers;
}

function getRefreshPromise(): Promise<TokenPair> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function clearSessionAfterRefreshFailure(): void {
  tokenStorage.clear();
  setUnauthenticated();
}

function handleRequest(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const accessToken = tokenStorage.getAccessToken();

  if (isNonEmptyString(accessToken)) {
    setBearerToken(config, accessToken);
    return config;
  }

  clearBearerToken(config);
  return config;
}

async function handleResponseError(error: AxiosError): Promise<AxiosResponse> {
  const responseStatus = error.response?.status;
  const originalRequest = error.config as RetriableRequestConfig | undefined;

  if (
    responseStatus !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    shouldSkipRefresh(originalRequest.url)
  ) {
    return Promise.reject(error);
  }

  const refreshToken = tokenStorage.getRefreshToken();

  if (!isNonEmptyString(refreshToken)) {
    clearSessionAfterRefreshFailure();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    const tokens = await getRefreshPromise();
    setBearerToken(originalRequest, tokens.accessToken);

    return apiClient(originalRequest);
  } catch (refreshError) {
    clearSessionAfterRefreshFailure();
    return Promise.reject(refreshError);
  }
}

export function installAuthInterceptors(): void {
  if (installed) {
    return;
  }

  apiClient.interceptors.request.use(handleRequest);
  apiClient.interceptors.response.use(
    (response) => response,
    handleResponseError,
  );

  installed = true;
}
