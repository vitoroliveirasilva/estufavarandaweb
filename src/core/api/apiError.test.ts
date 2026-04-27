import axios from "axios";
import { describe, expect, it } from "vitest";

import { parseApiError } from "@/core/api/apiError";

describe("parseApiError", () => {
  it("returns a friendly message for generic errors", () => {
    const error = parseApiError(new Error("Falha inesperada"));

    expect(error.code).toBe("unexpected");
    expect(error.message).toBe("Falha inesperada");
  });

  it("returns a friendly message for non-error values", () => {
    const error = parseApiError("anything");

    expect(error.code).toBe("unexpected");
    expect(error.message).toBe("Algo saiu do esperado. Tente novamente.");
  });

  it("parses validation errors from axios responses", () => {
    const axiosError = new axios.AxiosError(
      "Bad request",
      undefined,
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {
          headers: new axios.AxiosHeaders(),
        },
        data: {
          message: "Dados inválidos.",
          details: {
            email: "Informe um e-mail válido.",
          },
        },
      },
    );

    const error = parseApiError(axiosError);

    expect(error.code).toBe("validation");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Dados inválidos.");
    expect(error.details).toEqual({
      email: "Informe um e-mail válido.",
    });
  });

  it("parses forbidden axios responses", () => {
    const axiosError = new axios.AxiosError(
      "Forbidden",
      undefined,
      undefined,
      undefined,
      {
        status: 403,
        statusText: "Forbidden",
        headers: {},
        config: {
          headers: new axios.AxiosHeaders(),
        },
        data: {},
      },
    );

    const error = parseApiError(axiosError);

    expect(error.code).toBe("forbidden");
    expect(error.message).toBe("Você não tem permissão para essa ação.");
  });
});
