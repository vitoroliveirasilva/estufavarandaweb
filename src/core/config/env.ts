type AppEnv = {
  apiBaseUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
};

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function readEnvValue(key: string): string | undefined {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const fallbackApiBaseUrl = "http://127.0.0.1:8000/api/v1";

const apiBaseUrl = normalizeUrl(
  readEnvValue("VITE_API_BASE_URL") ?? fallbackApiBaseUrl,
);

const appName = readEnvValue("VITE_APP_NAME") ?? "Estufa da Varanda";

export const env: AppEnv = {
  apiBaseUrl,
  appName,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
