import { useCallback, useEffect, useState } from "react";

import {
    applyTheme,
    getInitialTheme,
    getOppositeTheme,
    getStoredTheme,
    getSystemTheme,
    setAppTheme,
    THEME_CHANGE_EVENT,
    type AppTheme
} from "@/shared/theme/theme";

function getSafeInitialTheme(): AppTheme {
    if (typeof window === "undefined") {
        return "light";
    }

    return getInitialTheme();
}

export function useTheme() {
    const [theme, setTheme] = useState<AppTheme>(getSafeInitialTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        function syncTheme(): void {
            setTheme(getInitialTheme());
        }

        function syncSystemTheme(): void {
            if (getStoredTheme()) {
                return;
            }

            const systemTheme = getSystemTheme();

            applyTheme(systemTheme);
            setTheme(systemTheme);
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
        window.addEventListener("storage", syncTheme);
        mediaQuery.addEventListener("change", syncSystemTheme);

        return () => {
            window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
            window.removeEventListener("storage", syncTheme);
            mediaQuery.removeEventListener("change", syncSystemTheme);
        };
    }, []);

    const changeTheme = useCallback((nextTheme: AppTheme) => {
        setAppTheme(nextTheme);
        setTheme(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((currentTheme) => {
            const nextTheme = getOppositeTheme(currentTheme);

            setAppTheme(nextTheme);

            return nextTheme;
        });
    }, []);

    return {
        theme,
        isDark: theme === "dark",
        changeTheme,
        toggleTheme
    };
}
