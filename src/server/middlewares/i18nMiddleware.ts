import createIntlMiddleware from "next-intl/middleware";
// import { getCountryLocales } from "@/server/services/globalService";
import { defaultLocales, localePrefix } from "@/config";
// Types
import type { NextRequest } from "next/server";

export default async function i18nMiddleware(request: NextRequest) {
  // const { locales, defaultLocale } = await getCountryLocales("en");

  const intlMiddleware = createIntlMiddleware({
    locales: defaultLocales,
    defaultLocale: "en",
    // locales: locales || defaultLocales,
    // defaultLocale,
    localePrefix,
  });

  return intlMiddleware(request);
}
