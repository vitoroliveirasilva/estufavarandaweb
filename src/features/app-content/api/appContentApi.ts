import { apiClient } from "@/core/api/apiClient";
import { unwrapEnvelope } from "@/core/api/responseEnvelope";
import type {
  AppContentDetail,
  AppContentLinks,
  AppContentParams,
  AppContentSection,
  AppContentShortcut,
  AppContentSummary
} from "@/features/app-content/types/appContentTypes";

const DEFAULT_LOCALE = "pt-BR";

type QueryParamValue = string | number | boolean;

type ListObjectPayload = {
  items?: unknown;
  results?: unknown;
  data?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeLocale(value: unknown): string {
  return normalizeString(value, DEFAULT_LOCALE);
}

function cleanParams(
  params: AppContentParams = {}
): Record<string, QueryParamValue> {
  return {
    locale: normalizeLocale(params.locale)
  };
}

function extractList(payload: unknown): unknown[] {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (isRecord(unwrapped)) {
    const objectPayload = unwrapped as ListObjectPayload;

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items;
    }

    if (Array.isArray(objectPayload.results)) {
      return objectPayload.results;
    }

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data;
    }
  }

  return [];
}

function extractRecord(payload: unknown): Record<string, unknown> {
  const unwrapped = unwrapEnvelope<unknown>(payload);

  if (isRecord(unwrapped)) {
    return unwrapped;
  }

  throw new Error("Conteúdo inválido recebido da API.");
}

function normalizeLinks(value: unknown): AppContentLinks {
  if (!isRecord(value)) {
    return {};
  }

  return {
    self: normalizeNullableString(value.self) ?? undefined
  };
}

function normalizeSection(value: unknown): AppContentSection | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = normalizeString(value.id);
  const title = normalizeString(value.title);
  const body = normalizeString(value.body);

  if (!id || !title || !body) {
    return null;
  }

  return {
    id,
    title,
    body
  };
}

function buildMarkdownContent(
  title: string,
  description: string,
  sections: AppContentSection[]
): string {
  const body = sections
    .map((section) => `## ${section.title}\n\n${section.body}`)
    .join("\n\n");

  return `# ${title}\n\n${description}${body ? `\n\n${body}` : ""}`;
}

function normalizeSummary(value: unknown): AppContentSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  const slug = normalizeString(value.slug);
  const title = normalizeString(value.title);

  if (!slug || !title) {
    return null;
  }

  return {
    slug,
    title,
    description: normalizeString(value.description),
    category: normalizeString(value.category, "institutional"),
    content_type: normalizeString(value.content_type, "markdown"),
    version: normalizeString(value.version, "1.0.0"),
    locale: normalizeString(value.locale, DEFAULT_LOCALE),
    icon: normalizeString(value.icon, "badge-info"),
    published_at: normalizeString(value.published_at),
    updated_at: normalizeString(value.updated_at),
    links: normalizeLinks(value.links)
  };
}

function normalizeDetail(value: unknown): AppContentDetail {
  if (!isRecord(value)) {
    throw new Error("Conteúdo inválido recebido da API.");
  }

  const summary = normalizeSummary(value);

  if (!summary) {
    throw new Error("Conteúdo inválido recebido da API.");
  }

  const sections = Array.isArray(value.sections)
    ? value.sections
        .map(normalizeSection)
        .filter((section): section is AppContentSection => section !== null)
    : [];

  const apiContent = normalizeString(value.content);
  const content =
    apiContent || buildMarkdownContent(summary.title, summary.description, sections);

  return {
    ...summary,
    sections,
    content
  };
}

export async function listAppContent(
  params: AppContentParams = {}
): Promise<AppContentSummary[]> {
  const response = await apiClient.get<unknown>("/app-content", {
    params: cleanParams(params)
  });

  return extractList(response.data)
    .map(normalizeSummary)
    .filter((item): item is AppContentSummary => item !== null);
}

export async function getAppContent(
  slug: string,
  params: AppContentParams = {}
): Promise<AppContentDetail> {
  const normalizedSlug = normalizeString(slug);

  if (!normalizedSlug) {
    throw new Error("Conteúdo inválido.");
  }

  const response = await apiClient.get<unknown>(
    `/app-content/${encodeURIComponent(normalizedSlug)}`,
    {
      params: cleanParams(params)
    }
  );

  return normalizeDetail(extractRecord(response.data));
}

export async function getAppContentShortcut(
  shortcut: AppContentShortcut,
  params: AppContentParams = {}
): Promise<AppContentDetail> {
  const response = await apiClient.get<unknown>(`/${shortcut}`, {
    params: cleanParams(params)
  });

  return normalizeDetail(extractRecord(response.data));
}

export function getAboutContent(params: AppContentParams = {}) {
  return getAppContentShortcut("about", params);
}

export function getPrivacyPolicyContent(params: AppContentParams = {}) {
  return getAppContentShortcut("privacy-policy", params);
}

export function getTermsOfUseContent(params: AppContentParams = {}) {
  return getAppContentShortcut("terms-of-use", params);
}

export function getCookiesPolicyContent(params: AppContentParams = {}) {
  return getAppContentShortcut("cookies-policy", params);
}
