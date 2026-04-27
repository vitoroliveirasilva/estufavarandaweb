import axios from "axios";
import { describe, expect, it } from "vitest";

import { parseApiError } from "@/core/api/apiError";

function createAxiosError(
  status: number,
  data: unknown,
  message = "Request failed",
) {
  return new axios.AxiosError(message, undefined, undefined, undefined, {
    status,
    statusText: String(status),
    headers: {},
    config: {
      headers: new axios.AxiosHeaders(),
    },
    data,
  });
}

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
    const axiosError = createAxiosError(400, {
      message: "Dados inválidos.",
      details: {
        email: "Informe um e-mail válido.",
      },
    });

    const error = parseApiError(axiosError);

    expect(error.code).toBe("validation");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Dados inválidos.");
    expect(error.details).toEqual({
      email: "Informe um e-mail válido.",
    });
  });

  it("parses validation details from array based API errors", () => {
    const axiosError = createAxiosError(422, {
      detail: [
        {
          loc: ["body", "name"],
          msg: "Informe o nome da planta.",
          type: "missing",
        },
      ],
    });

    const error = parseApiError(axiosError);

    expect(error.code).toBe("validation");
    expect(error.status).toBe(422);
    expect(error.message).toBe("Informe o nome da planta.");
    expect(error.details).toEqual({
      errors: [
        {
          loc: ["body", "name"],
          msg: "Informe o nome da planta.",
          type: "missing",
        },
      ],
    });
  });

  it("parses forbidden axios responses", () => {
    const axiosError = createAxiosError(403, {});

    const error = parseApiError(axiosError);

    expect(error.code).toBe("forbidden");
    expect(error.message).toBe("Você não tem permissão para essa ação.");
  });

  it("does not expose server error payload messages", () => {
    const axiosError = createAxiosError(500, {
      message: "Traceback interno sensível",
    });

    const error = parseApiError(axiosError);

    expect(error.code).toBe("server");
    expect(error.message).toBe(
      "Erro interno no servidor. Tente novamente mais tarde.",
    );
  });

  it("parses timeout errors", () => {
    const axiosError = new axios.AxiosError(
      "timeout of 20000ms exceeded",
      "ECONNABORTED",
    );

    const error = parseApiError(axiosError);

    expect(error.code).toBe("timeout");
    expect(error.message).toBe("A requisição demorou demais. Tente novamente.");
  });
});
