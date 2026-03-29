"use client";
import { useState } from "react";
import { Globe } from "lucide-react";
import { SUPPORTED_LOCALES, getLocaleDisplayName } from "@/lib/i18n/config";
import type { SupportedLocale } from "@/lib/i18n/config";

interface LanguageSelectorProps {
  currentLocale?: SupportedLocale;
  onLocaleChange?: (locale: SupportedLocale) => void;
}

export default function LanguageSelector({
  currentLocale = "en",
  onLocaleChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(locale: SupportedLocale) {
    setOpen(false);
    onLocaleChange?.(locale);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{getLocaleDisplayName(currentLocale)}</span>
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-md z-50 py-1"
          role="listbox"
        >
          {SUPPORTED_LOCALES.map((locale) => (
            <li
              key={locale}
              role="option"
              aria-selected={locale === currentLocale}
            >
              <button
                onClick={() => handleSelect(locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                  locale === currentLocale
                    ? "font-semibold text-blue-600"
                    : "text-slate-700"
                }`}
              >
                {getLocaleDisplayName(locale)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
