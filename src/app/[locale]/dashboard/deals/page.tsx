import { getTranslations } from "next-intl/server";
import { getCountryData } from "@/server/services/globalService";
import { getUserDeals } from "@/server/services/dealsService";
import { displayInOrder } from "@/utils";
import DealsView from "@/views/dashboard/deals/DealsView";
// Types
import { Metadata } from "next";
import { DealsPageResourcesProps } from "@/types/resources";
import { notFound } from "next/navigation";

type DealsPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: DealsPageProps,
): Promise<Metadata> {
  return {
    title: "Deals",
  };
}

export default async function DealsPage(props: DealsPageProps) {
  const {
    params: { locale },
  } = props;

  const [countryResponse, dealsResponse, t] = await Promise.all([
    getCountryData(locale),
    getUserDeals(locale),
    getTranslations(),
  ]);

  const data = dealsResponse?.data ? displayInOrder(dealsResponse?.data) : [];

  const resources: DealsPageResourcesProps = {
    deals: t("deals"),
    noDealsYet: t("noDealsYet"),
    startExploring: t("startExploring"),
    addToCart: t("addToCart"),
    anotherDeals: t("anotherDeals"),
    youAlreadyHaveOneInYourCart: t("youAlreadyHaveOneInYourCart"),
    dealAppliedSuccess: t("dealAppliedSuccess"),
    addedToCart: t("addedToCart"),
    required: t("required"),
    free: t("free"),
    dealUpdatedSuccess: t("dealUpdatedSuccess"),
    youCannotUserMoreThanOneDealDesc: t("youCannotUserMoreThanOneDealDesc"),
    removeFromCart: t("removeFromCart"),
    dealRemoveSuccess: t("dealRemoveSuccess"),
    howToEarnPoints: t("howToEarnPoints"),
  };

  const enableLoyalty = !!countryResponse?.data?.Data?.EnableLoyaltyProgram;
  const enableDeals = !!countryResponse?.data?.Data?.EnableDeals;

  if (!enableLoyalty) {
    if (!enableDeals) return notFound();
  }

  return (
    <DealsView
      locale={locale}
      resources={resources}
      data={data}
      enableLoyalty={enableLoyalty}
    />
  );
}
