import axios, { type AxiosError } from "axios";

export type AppErrorCode =
  | "network"
  | "timeout"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "server"
  | "unexpected";

export type ApiErrorDetail = Record<string, unknown>;

export type AppError = {
  code: AppErrorCode;
  message: string;
  status?: number;
  details?: ApiErrorDetail;
  raw?: unknown;
};

type PossibleApiErrorBody = {
  message?: unknown;
  error?: unknown;
  detail?: unknown;
  details?: unknown;
  errors?: unknown;
  title?: unknown;
  description?: unknown;
};

const FALLBACK_MESSAGE = "Algo saiu do esperado. Tente novamente.";
const MAX_MESSAGE_LENGTH = 300;
const MAX_JOINED_MESSAGES = 3;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeMessage(message: string): string | undefined {
  const normalized = message.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return undefined;
  }

  if (normalized.length <= MAX_MESSAGE_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_MESSAGE_LENGTH - 1).trim()}…`;
}

function normalizeMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    return sanitizeMessage(value);
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => normalizeMessage(item))
      .filter((item): item is string => Boolean(item))
      .slice(0, MAX_JOINED_MESSAGES);

    return sanitizeMessage(messages.join(" "));
  }

  if (isRecord(value)) {
    const directMessage =
      normalizeMessage(value.message) ??
      normalizeMessage(value.msg) ??
      normalizeMessage(value.error) ??
      normalizeMessage(value.detail);

    if (directMessage) {
      return directMessage;
    }

    const fieldMessages = Object.entries(value)
      .map(([field, fieldError]) => {
        const message = normalizeMessage(fieldError);
        return message ? `${field}: ${message}` : undefined;
      })
      .filter((item): item is string => Boolean(item))
      .slice(0, MAX_JOINED_MESSAGES);

    return sanitizeMessage(fieldMessages.join(" "));
  }

  return undefined;
}

function extractMessage(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const body = data as PossibleApiErrorBody;
  const candidates = [
    body.message,
    body.error,
    body.detail,
    body.title,
    body.description,
  ];

  for (const candidate of candidates) {
    const message = normalizeMessage(candidate);

    if (message) {
      return message;
    }
  }

  return undefined;
}

function normalizeDetails(details: unknown): ApiErrorDetail | undefined {
  if (Array.isArray(details)) {
    return { errors: details };
  }

  if (isRecord(details)) {
    return details;
  }

  return undefined;
}

function extractDetails(data: unknown): ApiErrorDetail | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const body = data as PossibleApiErrorBody;

  return (
    normalizeDetails(body.details) ??
    normalizeDetails(body.errors) ??
    normalizeDetails(body.detail)
  );
}

function isTimeoutError(error: AxiosError): boolean {
  return (
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT" ||
    error.message.toLowerCase().includes("timeout")
  );
}

function fromAxiosError(error: AxiosError): AppError {
  if (isTimeoutError(error)) {
    return {
      code: "timeout",
      message: "A requisição demorou demais. Tente novamente.",
      raw: error,
    };
  }

  if (!error.response) {
    return {
      code: "network",
      message: "Não foi possível conectar. Verifique sua internet.",
      raw: error,
    };
  }

  const status = error.response.status;
  const data = error.response.data;
  const apiMessage = extractMessage(data);
  const details = extractDetails(data);

  if (status === 400 || status === 422) {
    return {
      code: "validation",
      status,
      message: apiMessage ?? "Revise os dados informados.",
      details,
      raw: error,
    };
  }

  if (status === 401) {
    return {
      code: "unauthorized",
      status,
      message: "Sua sessão expirou. Faça login novamente.",
      details,
      raw: error,
    };
  }

  if (status === 403) {
    return {
      code: "forbidden",
      status,
      message: "Você não tem permissão para essa ação.",
      details,
      raw: error,
    };
  }

  if (status === 404) {
    return {
      code: "not_found",
      status,
      message: apiMessage ?? "Registro não encontrado.",
      details,
      raw: error,
    };
  }

  if (status === 429) {
    return {
      code: "unexpected",
      status,
      message:
        apiMessage ?? "Muitas tentativas. Aguarde um pouco e tente novamente.",
      details,
      raw: error,
    };
  }

  if (status >= 500) {
    return {
      code: "server",
      status,
      message: "Erro interno no servidor. Tente novamente mais tarde.",
      details,
      raw: error,
    };
  }

  return {
    code: "unexpected",
    status,
    message: apiMessage ?? FALLBACK_MESSAGE,
    details,
    raw: error,
  };
}

export function parseApiError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }

  if (error instanceof Error) {
    return {
      code: "unexpected",
      message: sanitizeMessage(error.message) ?? FALLBACK_MESSAGE,
      raw: error,
    };
  }

  return {
    code: "unexpected",
    message: FALLBACK_MESSAGE,
    raw: error,
  };
}

export function getAppErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}
