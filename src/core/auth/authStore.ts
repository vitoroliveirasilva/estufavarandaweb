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
type AuthStateUpdater = AuthState | ((currentState: AuthState) => AuthState);

const listeners = new Set<Listener>();

let state: AuthState = {
  status: "idle",
  user: null,
  bootstrapped: false,
};

function emitChange(): void {
  Array.from(listeners).forEach((listener) => {
    listener();
  });
}

function isSameAuthState(currentState: AuthState, nextState: AuthState): boolean {
  return (
    currentState.status === nextState.status &&
    currentState.user === nextState.user &&
    currentState.bootstrapped === nextState.bootstrapped
  );
}

function setState(updater: AuthStateUpdater): void {
  const nextState = typeof updater === "function" ? updater(state) : updater;

  if (isSameAuthState(state, nextState)) {
    return;
  }

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
  setState((currentState) => ({
    ...currentState,
    status: "loading",
    user: null,
  }));
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

export function useAuthStatus(): AuthStatus {
  return useAuthStore((currentState) => currentState.status);
}

export function useAuthBootstrapped(): boolean {
  return useAuthStore((currentState) => currentState.bootstrapped);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore(
    (currentState) => currentState.status === "authenticated",
  );
}
