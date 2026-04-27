type AppEnv = Readonly<{
  apiBaseUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
}>;

const DEFAULT_APP_NAME = "Estufa da Varanda";
const DEFAULT_DEV_API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const ALLOWED_API_PROTOCOLS = new Set(["http:", "https:"]);

function readEnvValue(key: string): string | undefined {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function removeTrailingSlashes(value: string): string {
  const normalized = value.replace(/\/+$/, "");
  return normalized.length > 0 ? normalized : "/";
}

function normalizeRootRelativeUrl(value: string): string {
  if (value.startsWith("//")) {
    throw new Error(
      "VITE_API_BASE_URL não pode usar URL relativa iniciada com '//'. Use '/api/v1' ou uma URL http(s) absoluta.",
    );
  }

  return removeTrailingSlashes(value);
}

function normalizeAbsoluteUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "VITE_API_BASE_URL inválida. Use uma URL http(s) absoluta ou um caminho relativo iniciado com '/'.",
    );
  }

  if (!ALLOWED_API_PROTOCOLS.has(url.protocol)) {
    throw new Error(
      "VITE_API_BASE_URL deve usar apenas protocolo http ou https.",
    );
  }

  if (url.username || url.password) {
    throw new Error(
      "VITE_API_BASE_URL não deve conter usuário, senha ou credenciais embutidas.",
    );
  }

  url.hash = "";
  url.search = "";

  return removeTrailingSlashes(url.toString());
}

function normalizeApiBaseUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("VITE_API_BASE_URL não pode estar vazia.");
  }

  if (trimmed.startsWith("/")) {
    return normalizeRootRelativeUrl(trimmed);
  }

  return normalizeAbsoluteUrl(trimmed);
}

function resolveApiBaseUrl(): string {
  const configuredApiBaseUrl = readEnvValue("VITE_API_BASE_URL");

  if (configuredApiBaseUrl) {
    return normalizeApiBaseUrl(configuredApiBaseUrl);
  }

  if (import.meta.env.PROD) {
    throw new Error("VITE_API_BASE_URL é obrigatória em produção.");
  }

  return normalizeApiBaseUrl(DEFAULT_DEV_API_BASE_URL);
}

function resolveAppName(): string {
  return readEnvValue("VITE_APP_NAME") ?? DEFAULT_APP_NAME;
}

export const env: AppEnv = Object.freeze({
  apiBaseUrl: resolveApiBaseUrl(),
  appName: resolveAppName(),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});
