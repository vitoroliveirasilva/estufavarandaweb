import type { AuthUser } from "@/core/auth/authStore";
import type { TokenPair } from "@/core/auth/tokenStorage";

export type LoginRequest = {
  email: string;
  password: string;
  device_name?: string;
};

export type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: unknown;
};

export type LoginResult = {
  tokens: TokenPair;
  user: AuthUser | null;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export type LogoutRequest = {
  refresh_token: string;
};

export type MessageResponse = {
  message: string;
};

export type RegisterDeviceRequest = {
  device_name: string;
  platform: "web" | string;
  push_token?: string | null;
};

export type RegisterDeviceResponse = Record<string, unknown>;