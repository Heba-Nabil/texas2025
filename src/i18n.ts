import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import {
  // getCountryLocales,
  getCountryMessages,
} from "./server/services/globalService";
import { defaultLocales } from "./config";
import { convertResourcesToMessages } from "./utils";

export default getRequestConfig(async ({ locale }) => {
  // const countryData = await getCountryLocales(locale);

  let locales = defaultLocales;
  // let locales = countryData?.locales || defaultLocales;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  const resourcesResponse = await getCountryMessages();
  const resources = resourcesResponse?.data || [];

  const messages = convertResourcesToMessages(resources, locale);

  return { messages };
});
