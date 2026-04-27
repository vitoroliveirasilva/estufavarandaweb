import {
  Link,
  Navigate,
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

import { App } from "@/app/App";
import { LoginAttemptsPage } from "@/features/admin/pages/LoginAttemptsPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { PlantAiPage } from "@/features/ai/pages/PlantAiPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { PlantClimatePage } from "@/features/climate/pages/PlantClimatePage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { PlantEventsPage } from "@/features/events/pages/PlantEventsPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { PlantPhotosPage } from "@/features/photos/pages/PlantPhotosPage";
import { PlantDetailPage } from "@/features/plants/pages/PlantDetailPage";
import { PlantFormPage } from "@/features/plants/pages/PlantFormPage";
import { PlantsListPage } from "@/features/plants/pages/PlantsListPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { SpeciesListPage } from "@/features/species/pages/SpeciesListPage";
import { WateringLogsPage } from "@/features/watering/pages/WateringLogsPage";
import { PublicOnlyRoute } from "@/core/auth/PublicOnlyRoute";
import { RequireAuth } from "@/core/auth/RequireAuth";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import { RootLayout } from "@/shared/layouts/RootLayout";

type RouteErrorContent = {
  title: string;
  message: string;
};

function getRouteErrorContent(error: unknown): RouteErrorContent {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: "Página não encontrada",
        message: "A rota acessada não existe ou foi movida.",
      };
    }

    if (error.status === 401) {
      return {
        title: "Sessão expirada",
        message: "Entre novamente para continuar usando o Estufa da Varanda.",
      };
    }

    if (error.status === 403) {
      return {
        title: "Acesso negado",
        message: "Seu usuário não possui permissão para acessar esta área.",
      };
    }

    return {
      title: "Não foi possível carregar a página",
      message: error.statusText || "Tente novamente em instantes.",
    };
  }

  if (error instanceof Error && import.meta.env.DEV) {
    return {
      title: "Erro inesperado",
      message: error.message,
    };
  }

  return {
    title: "Erro inesperado",
    message: "Ocorreu um problema ao carregar esta tela. Tente novamente em instantes.",
  };
}

function RouteErrorBoundary() {
  const error = useRouteError();
  const { title, message } = getRouteErrorContent(error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Estufa da Varanda</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/app"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Voltar ao início
          </Link>
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Ir para login
          </Link>
        </div>
      </section>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/app" replace />,
      },
      {
        element: (
          <PublicOnlyRoute>
            <PublicLayout />
          </PublicOnlyRoute>
        ),
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },
      {
        path: "/app",
        element: (
          <RequireAuth>
            <RootLayout />
          </RequireAuth>
        ),
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "plants",
            element: <PlantsListPage />,
          },
          {
            path: "plants/new",
            element: <PlantFormPage mode="create" />,
          },
          {
            path: "plants/:plantId",
            element: <PlantDetailPage />,
          },
          {
            path: "plants/:plantId/edit",
            element: <PlantFormPage mode="edit" />,
          },
          {
            path: "plants/:plantId/watering",
            element: <WateringLogsPage />,
          },
          {
            path: "plants/:plantId/events",
            element: <PlantEventsPage />,
          },
          {
            path: "plants/:plantId/photos",
            element: <PlantPhotosPage />,
          },
          {
            path: "plants/:plantId/climate",
            element: <PlantClimatePage />,
          },
          {
            path: "plants/:plantId/ai",
            element: <PlantAiPage />,
          },
          {
            path: "species",
            element: <SpeciesListPage />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "admin/users",
            element: <AdminUsersPage />,
          },
          {
            path: "admin/login-attempts",
            element: <LoginAttemptsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/app" replace />,
      },
    ],
  },
]);
