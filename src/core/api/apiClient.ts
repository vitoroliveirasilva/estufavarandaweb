import axios from "axios";

import { env } from "@/core/config/env";

const defaultHeaders = {
  Accept: "application/json"
};

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
  headers: defaultHeaders
});

export const publicApiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
  headers: defaultHeaders
});