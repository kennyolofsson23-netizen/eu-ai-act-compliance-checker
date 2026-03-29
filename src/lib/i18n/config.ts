export type SupportedLocale = "en" | "de" | "fr";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "de", "fr"];
export const DEFAULT_LOCALE: SupportedLocale = "en";

export interface I18nConfig {
  locale: SupportedLocale;
  fallbackLocale: SupportedLocale;
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function getLocaleDisplayName(locale: SupportedLocale): string {
  const names: Record<SupportedLocale, string> = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
  };
  return names[locale];
}
