import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "@/core/api/apiClient";
import { refreshAccessToken } from "@/core/api/refreshToken";
import { setUnauthenticated } from "@/core/auth/authStore";
import { tokenStorage, type TokenPair } from "@/core/auth/tokenStorage";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let installed = false;
let refreshPromise: Promise<TokenPair> | null = null;

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

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

async function handleResponseError(error: AxiosError): Promise<AxiosResponse> {
  const responseStatus = error.response?.status;
  const originalRequest = error.config as RetriableRequestConfig | undefined;

  if (responseStatus !== 401 || !originalRequest || originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    const tokens = await getRefreshPromise();
    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

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
