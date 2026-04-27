import { type ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { LoadingState } from "@/shared/components/LoadingState";

import { useAuthStore } from "@/core/auth/authStore";
import { useAuthBootstrap } from "@/core/auth/useAuthBootstrap";

type PublicOnlyRouteProps = {
  children?: ReactNode;
};

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const status = useAuthStore((state) => state.status);
  const bootstrapped = useAuthStore((state) => state.bootstrapped);

  useAuthBootstrap();

  if (!bootstrapped || status === "idle" || status === "loading") {
    return (
      <div className="leaf-gradient flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <LoadingState
            title="Preparando acesso"
            description="Verificando se já existe uma sessão ativa."
          />
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/app" replace />;
  }

  return children ?? <Outlet />;
}