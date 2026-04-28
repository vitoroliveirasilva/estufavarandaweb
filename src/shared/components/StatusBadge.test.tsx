import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/shared/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders the badge text", () => {
    render(<StatusBadge tone="success">Ativo</StatusBadge>);

    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("uses neutral tone by default", () => {
    render(<StatusBadge>Sem status</StatusBadge>);

    expect(screen.getByText("Sem status")).toBeInTheDocument();
  });

  it("accepts custom classes without losing base styles", () => {
    render(<StatusBadge className="uppercase">Pendente</StatusBadge>);

    const badge = screen.getByText("Pendente");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("inline-flex", "uppercase");
  });
});
