import { useSyncExternalStore } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  last_login_at: string | null;
};

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  bootstrapped: boolean;
};

type Listener = () => void;

const listeners = new Set<Listener>();

let state: AuthState = {
  status: "idle",
  user: null,
  bootstrapped: false,
};

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function setState(nextState: AuthState): void {
  state = nextState;
  emitChange();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAuthState(): AuthState {
  return state;
}

export function setAuthLoading(): void {
  setState({
    ...state,
    status: "loading",
  });
}

export function setAuthenticated(user: AuthUser): void {
  setState({
    status: "authenticated",
    user,
    bootstrapped: true,
  });
}

export function setUnauthenticated(): void {
  setState({
    status: "unauthenticated",
    user: null,
    bootstrapped: true,
  });
}

export function resetAuthState(): void {
  setState({
    status: "idle",
    user: null,
    bootstrapped: false,
  });
}

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

export function useAuthUser(): AuthUser | null {
  return useAuthStore((currentState) => currentState.user);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore(
    (currentState) => currentState.status === "authenticated",
  );
}
