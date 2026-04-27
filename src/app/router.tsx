import { Navigate, createBrowserRouter } from "react-router-dom";

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

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
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
            element: <LoginPage />
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />
          }
        ]
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
            element: <DashboardPage />
          },
          {
            path: "plants",
            element: <PlantsListPage />
          },
          {
            path: "plants/new",
            element: <PlantFormPage mode="create" />
          },
          {
            path: "plants/:plantId",
            element: <PlantDetailPage />
          },
          {
            path: "plants/:plantId/edit",
            element: <PlantFormPage mode="edit" />
          },
          {
            path: "plants/:plantId/watering",
            element: <WateringLogsPage />
          },
          {
            path: "plants/:plantId/events",
            element: <PlantEventsPage />
          },
          {
            path: "plants/:plantId/photos",
            element: <PlantPhotosPage />
          },
          {
            path: "plants/:plantId/climate",
            element: <PlantClimatePage />
          },
          {
            path: "plants/:plantId/ai",
            element: <PlantAiPage />
          },
          {
            path: "species",
            element: <SpeciesListPage />
          },
          {
            path: "notifications",
            element: <NotificationsPage />
          },
          {
            path: "settings",
            element: <SettingsPage />
          },
          {
            path: "admin/users",
            element: <AdminUsersPage />
          },
          {
            path: "admin/login-attempts",
            element: <LoginAttemptsPage />
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />
      }
    ]
  }
]);