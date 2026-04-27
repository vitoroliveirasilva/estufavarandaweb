import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { router } from "@/app/router";
import { installAuthInterceptors } from "@/core/api/authInterceptor";

const AUTH_INTERCEPTORS_KEY = "__ESTUFA_AUTH_INTERCEPTORS_INSTALLED__";

type RuntimeWithAuthInterceptors = typeof globalThis & {
  [AUTH_INTERCEPTORS_KEY]?: boolean;
};

function ensureAuthInterceptorsInstalled() {
  const runtime = globalThis as RuntimeWithAuthInterceptors;

  if (runtime[AUTH_INTERCEPTORS_KEY]) {
    return;
  }

  installAuthInterceptors();
  runtime[AUTH_INTERCEPTORS_KEY] = true;
}

export function Providers() {
  ensureAuthInterceptorsInstalled();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}