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
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractMessage(data: unknown): string | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const body = data as PossibleApiErrorBody;
  const possibleMessage = body.message ?? body.error ?? body.detail;

  if (
    typeof possibleMessage === "string" &&
    possibleMessage.trim().length > 0
  ) {
    return possibleMessage.trim();
  }

  return undefined;
}

function extractDetails(data: unknown): ApiErrorDetail | undefined {
  if (!isRecord(data)) {
    return undefined;
  }

  const body = data as PossibleApiErrorBody;
  const possibleDetails = body.details ?? body.errors;

  if (isRecord(possibleDetails)) {
    return possibleDetails;
  }

  return undefined;
}

function fromAxiosError(error: AxiosError): AppError {
  if (error.code === "ECONNABORTED") {
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
      message: "Registro não encontrado.",
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
    message: apiMessage ?? "Algo saiu do esperado. Tente novamente.",
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
      message: error.message || "Algo saiu do esperado. Tente novamente.",
      raw: error,
    };
  }

  return {
    code: "unexpected",
    message: "Algo saiu do esperado. Tente novamente.",
    raw: error,
  };
}

export function getAppErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}
