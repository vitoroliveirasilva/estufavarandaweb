import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LoadingState } from "@/shared/components/LoadingState";

import { useAuthStore } from "@/core/auth/authStore";
import { useAuthBootstrap } from "@/core/auth/useAuthBootstrap";

type RequireAuthProps = {
  children?: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const bootstrapped = useAuthStore((state) => state.bootstrapped);

  useAuthBootstrap();

  if (!bootstrapped || status === "idle" || status === "loading") {
    return (
      <div className="leaf-gradient flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <LoadingState
            title="Verificando sessão"
            description="Só um instante enquanto validamos seu acesso."
          />
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}