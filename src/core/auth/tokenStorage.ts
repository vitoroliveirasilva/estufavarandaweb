export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
};

const STORAGE_KEYS = {
  accessToken: "estufa.access_token",
  refreshToken: "estufa.refresh_token",
  expiresAt: "estufa.access_token_expires_at",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

type MemoryTokenState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
};

const memoryTokenState: MemoryTokenState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getMemoryValue(key: StorageKey): string | null {
  if (key === STORAGE_KEYS.accessToken) {
    return memoryTokenState.accessToken;
  }

  if (key === STORAGE_KEYS.refreshToken) {
    return memoryTokenState.refreshToken;
  }

  return memoryTokenState.expiresAt;
}

function setMemoryValue(key: StorageKey, value: string | null): void {
  if (key === STORAGE_KEYS.accessToken) {
    memoryTokenState.accessToken = value;
    return;
  }

  if (key === STORAGE_KEYS.refreshToken) {
    memoryTokenState.refreshToken = value;
    return;
  }

  memoryTokenState.expiresAt = value;
}

function normalizeToken(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function safeGetItem(key: StorageKey): string | null {
  try {
    return getStorage()?.getItem(key) ?? getMemoryValue(key);
  } catch {
    return getMemoryValue(key);
  }
}

function safeSetItem(key: StorageKey, value: string): void {
  setMemoryValue(key, value);

  try {
    getStorage()?.setItem(key, value);
  } catch {
    // O fallback em memória mantém a sessão ativa na aba atual.
  }
}

function safeRemoveItem(key: StorageKey): void {
  setMemoryValue(key, null);

  try {
    getStorage()?.removeItem(key);
  } catch {
    // Nada a fazer. O fallback em memória já foi limpo.
  }
}

function normalizeExpiresIn(expiresIn: unknown): number | undefined {
  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn)) {
    return undefined;
  }

  const normalizedValue = Math.floor(expiresIn);
  return normalizedValue > 0 ? normalizedValue : undefined;
}

function getAccessToken(): string | null {
  return normalizeToken(safeGetItem(STORAGE_KEYS.accessToken));
}

function getRefreshToken(): string | null {
  return normalizeToken(safeGetItem(STORAGE_KEYS.refreshToken));
}

function getAccessTokenExpiresAt(): number | null {
  const rawValue = safeGetItem(STORAGE_KEYS.expiresAt);

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function hasRefreshToken(): boolean {
  return getRefreshToken() !== null;
}

function isAccessTokenExpired(clockSkewMs = 30_000): boolean {
  const expiresAt = getAccessTokenExpiresAt();

  if (!expiresAt) {
    return false;
  }

  return Date.now() + clockSkewMs >= expiresAt;
}

function setTokens(tokens: TokenPair): void {
  const accessToken = normalizeToken(tokens.accessToken);
  const refreshToken = normalizeToken(tokens.refreshToken);

  if (!accessToken || !refreshToken) {
    clear();
    return;
  }

  safeSetItem(STORAGE_KEYS.accessToken, accessToken);
  safeSetItem(STORAGE_KEYS.refreshToken, refreshToken);

  const expiresIn = normalizeExpiresIn(tokens.expiresIn);

  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    safeSetItem(STORAGE_KEYS.expiresAt, String(expiresAt));
    return;
  }

  safeRemoveItem(STORAGE_KEYS.expiresAt);
}

function clear(): void {
  safeRemoveItem(STORAGE_KEYS.accessToken);
  safeRemoveItem(STORAGE_KEYS.refreshToken);
  safeRemoveItem(STORAGE_KEYS.expiresAt);
}

export const tokenStorage = {
  getAccessToken,
  getRefreshToken,
  getAccessTokenExpiresAt,
  hasRefreshToken,
  isAccessTokenExpired,
  setTokens,
  clear,
};
