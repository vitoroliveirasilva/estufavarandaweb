import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  Camera,
  CloudSun,
  LayoutDashboard,
  Leaf,
  ListChecks,
  Settings,
  Shield,
  Sprout,
  Users,
  Waves
} from "lucide-react";

export type AppNavItem = {
  readonly label: string;
  readonly path: string;
  readonly icon: LucideIcon;
  readonly exact?: boolean;
};

export const mainNavItems = [
  {
    label: "Dashboard",
    path: "/app",
    icon: LayoutDashboard,
    exact: true
  },
  {
    label: "Minhas plantas",
    path: "/app/plants",
    icon: Sprout
  },
  {
    label: "Espécies",
    path: "/app/species",
    icon: Leaf
  },
  {
    label: "Notificações",
    path: "/app/notifications",
    icon: Bell
  },
  {
    label: "Configurações",
    path: "/app/settings",
    icon: Settings
  }
] as const satisfies readonly AppNavItem[];

export const preparedNavItems = [
  {
    label: "Regas",
    path: "/app/plants/1/watering",
    icon: Waves
  },
  {
    label: "Eventos",
    path: "/app/plants/1/events",
    icon: ListChecks
  },
  {
    label: "Fotos",
    path: "/app/plants/1/photos",
    icon: Camera
  },
  {
    label: "Clima",
    path: "/app/plants/1/climate",
    icon: CloudSun
  },
  {
    label: "IA",
    path: "/app/plants/1/ai",
    icon: Bot
  }
] as const satisfies readonly AppNavItem[];

export const adminNavItems = [
  {
    label: "Usuários",
    path: "/app/admin/users",
    icon: Users
  },
  {
    label: "Tentativas de login",
    path: "/app/admin/login-attempts",
    icon: Shield
  }
] as const satisfies readonly AppNavItem[];