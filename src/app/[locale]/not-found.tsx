import { getTranslations } from "next-intl/server";
import NotFoundView from "@/views/not-found/NotFoundView";
// Types
import { NotFoundPageResourcesProps } from "@/types/resources";

export default async function NotFound() {
  const t = await getTranslations();

  const resources: NotFoundPageResourcesProps = {
    someThingWentWrong: t("someThingWentWrong"),
    couldNotFindThisPage: t("couldNotFindThisPage"),
    backToHome: t("backToHome"),
  };

  return <NotFoundView resources={resources} />;
}
