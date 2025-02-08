import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getUserLoyaltyHistory,
  getUserLoyaltyStatus,
} from "@/server/services/loyaltyService";
import RewardsHistoryView from "@/views/dashboard/rewards-history/RewardsHistoryView";
// Types
import { Metadata } from "next";
import { RewardsHistoryPageResourcesProps } from "@/types/resources";

type RewardsHistoryPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: RewardsHistoryPageProps,
): Promise<Metadata> {
  return {
    title: "Rewards History",
  };
}

export default async function RewardsHistoryPage(
  props: RewardsHistoryPageProps,
) {
  const {
    params: { locale },
  } = props;

  const [userHistory, userStatus, t] = await Promise.all([
    getUserLoyaltyHistory(locale),
    getUserLoyaltyStatus(locale),
    getTranslations(),
  ]);

  if (!userHistory?.data) return notFound();

  const resources: RewardsHistoryPageResourcesProps = {
    back: t("back"),
    current: t("current"),
    collected: t("collected"),
    consumed: t("consumed"),
    expired: t("expired"),
    points: t("points"),
    all: t("all"),
    tex: t("tex"),
    thereIsNoItems: t("thereIsNoItems"),
    expiredAt: t("expiredAt"),
    rewardsHistory: t("rewardsHistory"),
  };

  return (
    <RewardsHistoryView
      resources={resources}
      data={userHistory?.data}
      userStatus={userStatus?.data}
      locale={locale}
    />
  );
}
