export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "estufa-da-varanda.theme";
export const THEME_CHANGE_EVENT = "estufa-da-varanda:theme-change";

const THEME_COLOR_BY_THEME: Record<AppTheme, string> = {
  light: "#166534",
  dark: "#052e16",
};

function canUseDOM(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function isAppTheme(value: unknown): value is AppTheme {
  return value === "light" || value === "dark";
}

export function getSystemTheme(): AppTheme {
  if (!canUseDOM()) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): AppTheme | null {
  if (!canUseDOM()) {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isAppTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function getInitialTheme(): AppTheme {
  return getStoredTheme() ?? getSystemTheme();
}

function updateThemeColor(theme: AppTheme): void {
  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  if (!themeColor) {
    return;
  }

  themeColor.setAttribute("content", THEME_COLOR_BY_THEME[theme]);
}

export function applyTheme(theme: AppTheme): void {
  if (!canUseDOM()) {
    return;
  }

  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  updateThemeColor(theme);
}

export function saveTheme(theme: AppTheme): void {
  if (!canUseDOM()) {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Mantém a troca funcionando mesmo se o navegador bloquear localStorage.
  }
}

export function setAppTheme(theme: AppTheme): void {
  applyTheme(theme);
  saveTheme(theme);

  window.dispatchEvent(
    new CustomEvent<AppTheme>(THEME_CHANGE_EVENT, {
      detail: theme,
    }),
  );
}

export function initializeTheme(): void {
  applyTheme(getInitialTheme());
}

export function getOppositeTheme(theme: AppTheme): AppTheme {
  return theme === "dark" ? "light" : "dark";
}
