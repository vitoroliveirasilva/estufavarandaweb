export type AppContentSlug =
  | "sobre-o-sistema"
  | "politica-de-privacidade"
  | "termos-de-uso"
  | "politica-de-cookies"
  | string;

export type AppContentLocale = "pt-BR" | string;

export type AppContentSection = {
  id: string;
  title: string;
  body: string;
};

export type AppContentLinks = {
  self?: string;
};

export type AppContentSummary = {
  slug: AppContentSlug;
  title: string;
  description: string;
  category: string;
  content_type: string;
  version: string;
  locale: AppContentLocale;
  icon: string;
  published_at: string;
  updated_at: string;
  links: AppContentLinks;
};

export type AppContentDetail = AppContentSummary & {
  sections: AppContentSection[];
  content: string;
};

export type AppContentParams = {
  locale?: AppContentLocale;
};

export type AppContentShortcut =
  | "about"
  | "privacy-policy"
  | "terms-of-use"
  | "cookies-policy";
