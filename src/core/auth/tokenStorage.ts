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

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function safeGetItem(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // Storage pode estar bloqueado no navegador. A sessão apenas não persiste.
  }
}

function safeRemoveItem(key: string): void {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // Nada a fazer.
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return safeGetItem(STORAGE_KEYS.accessToken);
  },

  getRefreshToken(): string | null {
    return safeGetItem(STORAGE_KEYS.refreshToken);
  },

  getAccessTokenExpiresAt(): number | null {
    const rawValue = safeGetItem(STORAGE_KEYS.expiresAt);

    if (!rawValue) {
      return null;
    }

    const value = Number(rawValue);
    return Number.isFinite(value) ? value : null;
  },

  hasRefreshToken(): boolean {
    return Boolean(this.getRefreshToken());
  },

  setTokens(tokens: TokenPair): void {
    safeSetItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    safeSetItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);

    if (typeof tokens.expiresIn === "number" && tokens.expiresIn > 0) {
      const expiresAt = Date.now() + tokens.expiresIn * 1000;
      safeSetItem(STORAGE_KEYS.expiresAt, String(expiresAt));
    } else {
      safeRemoveItem(STORAGE_KEYS.expiresAt);
    }
  },

  clear(): void {
    safeRemoveItem(STORAGE_KEYS.accessToken);
    safeRemoveItem(STORAGE_KEYS.refreshToken);
    safeRemoveItem(STORAGE_KEYS.expiresAt);
  },
};
