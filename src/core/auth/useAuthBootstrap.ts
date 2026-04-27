import { useEffect } from "react";

import { bootstrapSessionFromRefreshToken } from "@/core/api/refreshToken";
import {
  getAuthState,
  setAuthenticated,
  setAuthLoading,
  setUnauthenticated,
  useAuthBootstrapped,
} from "@/core/auth/authStore";
import { tokenStorage } from "@/core/auth/tokenStorage";

let bootstrapPromise: Promise<void> | null = null;

async function runBootstrap(): Promise<void> {
  const currentState = getAuthState();

  if (currentState.bootstrapped || currentState.status === "loading") {
    return;
  }

  if (!tokenStorage.hasRefreshToken()) {
    tokenStorage.clear();
    setUnauthenticated();
    return;
  }

  setAuthLoading();

  try {
    const user = await bootstrapSessionFromRefreshToken();
    const latestState = getAuthState();

    if (latestState.status === "authenticated") {
      return;
    }

    if (!tokenStorage.hasRefreshToken()) {
      setUnauthenticated();
      return;
    }

    setAuthenticated(user);
  } catch {
    if (getAuthState().status !== "authenticated") {
      tokenStorage.clear();
      setUnauthenticated();
    }
  }
}

export function ensureAuthBootstrapped(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap().finally(() => {
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
}

export function useAuthBootstrap(): void {
  const bootstrapped = useAuthBootstrapped();

  useEffect(() => {
    if (!bootstrapped) {
      void ensureAuthBootstrapped();
    }
  }, [bootstrapped]);
}