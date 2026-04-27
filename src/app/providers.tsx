import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/app/queryClient";
import { router } from "@/app/router";
import { installAuthInterceptors } from "@/core/api/authInterceptor";

installAuthInterceptors();

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}