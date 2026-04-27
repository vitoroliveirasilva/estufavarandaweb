import axios, { type AxiosInstance } from "axios";

import { env } from "@/core/config/env";

const API_TIMEOUT_MS = 20_000;

const defaultHeaders = {
  Accept: "application/json",
} as const;

function createApiClient(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    timeout: API_TIMEOUT_MS,
    timeoutErrorMessage: "A requisição demorou demais. Tente novamente.",
    headers: defaultHeaders,
    transitional: {
      clarifyTimeoutError: true,
    },
  });
}

export const apiClient = createApiClient();
export const publicApiClient = createApiClient();
