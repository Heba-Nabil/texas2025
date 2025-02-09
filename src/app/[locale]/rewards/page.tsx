import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAllPageSection,
  getCountryData,
  getMetaData,
  getSingleSectionContent,
} from "@/server/services/globalService";
import RewardsView from "@/views/rewards/RewardsView";
// Types
import type { Metadata } from "next";
import { RewardsPageResourcesProps } from "@/types/resources";

type RewardsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: RewardsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Rewards", "Rewards");
  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Rewards";

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

export default async function RewardsPage(props: RewardsPageProps) {
  const {
    params: { locale },
  } = props;

  const countryResponse = await getCountryData(locale);
  const countryEnableRewards =
    !!countryResponse?.data?.Data?.EnableLoyaltyProgram;

  if (!countryEnableRewards) return notFound();

  const pageName = "rewardsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  if (!sections) return null;

  const rewardBanner = sections?.data?.find(
    (section) => section.PageTitle === "rewardBanner",
  );

  const moreRewardingSection = sections?.data?.find(
    (section) => section.PageTitle === "MORE REWARDING",
  );
  const introducingSection = sections?.data?.find(
    (section) => section.PageTitle === "INTRODUCING",
  );

  const moreAppsclusiveSection = sections?.data?.find(
    (section) => section.PageTitle === "MORE APPSCLUSIVE BENEFITS",
  );

  const moreRewardingContent = moreRewardingSection?.UniqueName
    ? await getSingleSectionContent(
        locale,
        pageName,
        moreRewardingSection.UniqueName,
      )
    : undefined;

  const resources: RewardsPageResourcesProps = {
    learnMore: t("learnMore"),
    points: t("points"),
    viewMenu: t("viewMenu"),

    signIn: t("signIn"),
    signUp: t("signUp"),
    readyToSpend: t("readyToSpend"),
    youHaveEarned: t("youHaveEarned"),
    viewPoints: t("viewPoints"),
  };

  return (
    <RewardsView
      locale={locale}
      resources={resources}
      rewardBanner={rewardBanner}
      moreRewardingSection={moreRewardingSection}
      moreRewardingContent={moreRewardingContent?.data!}
      introducingSection={introducingSection}
      moreAppsclusiveSection={moreAppsclusiveSection}
    />
  );
}
