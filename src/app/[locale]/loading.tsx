import { getLocale } from "next-intl/server";
import { defaultLanguage } from "@/config";
import ServerLoading from "@/components/global/ServerLoading";

export default async function PagesLoading() {
  const locale = (await getLocale()) || defaultLanguage;

  return <ServerLoading locale={locale} />;
}
