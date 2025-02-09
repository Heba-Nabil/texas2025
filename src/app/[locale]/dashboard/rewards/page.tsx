import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { displayInOrder } from "@/utils";
import DashboardRewardsView from "@/views/dashboard/rewards/DashboardRewardsView";
import { getCountryData } from "@/server/services/globalService";
import {
  getUserLoyaltyDeals,
  getUserLoyaltyStatus,
} from "@/server/services/loyaltyService";
// Types
import { Metadata } from "next";
import { DashboardRewardsPageResourcesProps } from "@/types/resources";

type DashboardRewardsPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: DashboardRewardsPageProps,
): Promise<Metadata> {
  return {
    title: "Rewards",
  };
}

export default async function DashboardRewardsPage(
  props: DashboardRewardsPageProps,
) {
  const {
    params: { locale },
  } = props;

  const [countryResponse, rewardsResponse, userStatus, t] = await Promise.all([
    getCountryData(locale),
    getUserLoyaltyDeals(locale),
    getUserLoyaltyStatus(locale),
    getTranslations(),
  ]);

  if (countryResponse?.data) {
    if (!countryResponse?.data?.Data?.EnableLoyaltyProgram) return notFound();
  }

  const data = rewardsResponse?.data
    ? displayInOrder(rewardsResponse?.data)
    : [];

  const resources: DashboardRewardsPageResourcesProps = {
    rewards: t("rewards"),
    emptyRewardsTitle: t("emptyRewardsTitle"),
    emptyRewardsDesc: t("emptyRewardsDesc"),
    orderNow: t("orderNow"),
    viewHistory: t("viewHistory"),
    points: t("points"),
    earnMore: t("earnMore"),
    redeem: t("redeem"),
    free: t("free"),
    all: t("all"),
    goodMorning: t("goodMorning"),
    goodAfternoon: t("goodAfternoon"),
    goodEvening: t("goodEvening"),
    thereIsNoItems: t("thereIsNoItems"),
    learnMore: t("learnMore"),
    youAreLegend: t("youAreLegend"),
    youAreLegendDesc: t("youAreLegendDesc"),
    earnPointsMoreToReact: t("earnPointsMoreToReact", {
      points: userStatus?.data?.RemainingPointsToNextTier || 0,
      tier: userStatus?.data?.NextTierName || "",
    }),
  };

  return (
    <DashboardRewardsView
      locale={locale}
      resources={resources}
      data={data}
      userStatus={userStatus?.data!}
    />
  );
}
