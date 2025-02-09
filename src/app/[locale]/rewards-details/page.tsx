import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAllPageSection,
  getCountryData,
  getMetaData,
} from "@/server/services/globalService";
import { getUserLoyaltyDeals } from "@/server/services/loyaltyService";
import { displayInOrder } from "@/utils";
import RewardsDetailsView from "@/views/rewards-details/RewardsDetailsView";
// Types
import type { Metadata } from "next";
import { RewardsDetailsPageResourcesProps } from "@/types/resources";

type RewardsDetailsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: RewardsDetailsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Rewards Details",
    "Rewards Details",
  );
  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Rewards Details";

  return {
    title: pageTitle,
    description: pageData?.PageDescription,
    keywords: pageData?.PageKeywords,
    openGraph: {
      title: pageData?.OGtitle,
      description: pageData?.OGdescription || "",
      type: "website",
      images: pageData?.OGimage
        ? [{ url: pageData.OGimage, width: 32, height: 32 }]
        : undefined,
      url: `/`,
    },
    twitter: {
      title: pageData?.Twittertitle || pageTitle,
      description: pageData?.Twitterdescription || "",
      images: pageData?.Twitterimage || undefined,
    },
  };
}

export default async function RewardsDetailsPage(
  props: RewardsDetailsPageProps,
) {
  const {
    params: { locale },
  } = props;

  const countryResponse = await getCountryData(locale);
  const countryEnableRewards =
    !!countryResponse?.data?.Data?.EnableLoyaltyProgram;

  if (!countryEnableRewards) return notFound();

  const pageName = "rewardsDetailsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  if (!sections) return null;

  const rewardsDetailsBanner = sections?.data?.find(
    (section) => section.PageTitle === "rewardsDetailsBanner",
  );
  const howItWorksSection = sections?.data?.find(
    (section) => section.PageTitle === "HOW IT WORKS",
  );
  const tierListSection = sections?.data?.find(
    (section) => section.PageTitle === "TIER LIST",
  );

  const resources: RewardsDetailsPageResourcesProps = {
    back: t("back"),
    points: t("points"),
    viewMenu: t("viewMenu"),
    readyToSpend: t("readyToSpend"),
    youHaveEarned: t("youHaveEarned"),
    filter: t("filter"),
  };

  const dealsResponse = await getUserLoyaltyDeals(locale);

  const deals = dealsResponse?.data ? displayInOrder(dealsResponse?.data) : [];

  return (
    <RewardsDetailsView
      locale={locale}
      resources={resources}
      pageName={pageName}
      rewardsDetailsBanner={rewardsDetailsBanner}
      howItWorksSection={howItWorksSection}
      tierListSection={tierListSection}
      deals={deals}
    />
  );
}
