import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
    getAppContent,
    getAppContentShortcut,
    listAppContent
} from "@/features/app-content/api/appContentApi";
import type {
    AppContentParams,
    AppContentShortcut
} from "@/features/app-content/types/appContentTypes";

const DEFAULT_LOCALE = "pt-BR";

function normalizeLocale(value: unknown): string {
    if (typeof value !== "string") {
        return DEFAULT_LOCALE;
    }

    const trimmed = value.trim();
    return trimmed || DEFAULT_LOCALE;
}

function normalizeParams(params: AppContentParams = {}): Required<AppContentParams> {
    return {
        locale: normalizeLocale(params.locale)
    };
}

function hasValue(value: string | null | undefined): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export const appContentQueryKeys = {
    root: ["app-content"] as const,
    list: (locale: string) =>
        [...appContentQueryKeys.root, "list", locale] as const,
    detail: (slug: string, locale: string) =>
        [...appContentQueryKeys.root, "detail", slug, locale] as const,
    shortcut: (shortcut: AppContentShortcut, locale: string) =>
        [...appContentQueryKeys.root, "shortcut", shortcut, locale] as const
};

export function useAppContentList(
    params: AppContentParams = {},
    enabled = true
) {
    const normalizedParams = normalizeParams(params);

    return useQuery({
        queryKey: appContentQueryKeys.list(normalizedParams.locale),
        queryFn: () => listAppContent(normalizedParams),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true
    });
}

export function useAppContent(
    slug: string | null | undefined,
    params: AppContentParams = {},
    enabled = true
) {
    const normalizedParams = normalizeParams(params);
    const normalizedSlug = hasValue(slug) ? slug.trim() : "";

    return useQuery({
        queryKey: appContentQueryKeys.detail(
            normalizedSlug,
            normalizedParams.locale
        ),
        queryFn: () => getAppContent(normalizedSlug, normalizedParams),
        enabled: enabled && hasValue(normalizedSlug),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true
    });
}

export function useAppContentShortcut(
    shortcut: AppContentShortcut,
    params: AppContentParams = {},
    enabled = true
) {
    const normalizedParams = normalizeParams(params);

    return useQuery({
        queryKey: appContentQueryKeys.shortcut(shortcut, normalizedParams.locale),
        queryFn: () => getAppContentShortcut(shortcut, normalizedParams),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true
    });
}
