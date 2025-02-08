import { getTranslations } from "next-intl/server";
// import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import { sortByOrder } from "@/utils";
import GetTheAppView from "@/views/get-app/GetTheAppView";
// Types
import type { Metadata } from "next";
import { GetAppPageResourcesProps } from "@/types/resources";

type GetAppPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: GetAppPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Get App", "Get App");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Get App";

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

export default async function GetAppPage(props: GetAppPageProps) {
  const {
    params: { locale },
  } = props;

  // await validateModule("MobileApp");

  const pageName = "getAppPage";

  const [t, sections, mobileAppsResponse] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
    getAllPageSection(locale, "mobileApps"),
  ]);

  if (!sections?.data) return null;

  const orderingEasySection = sections?.data?.find(
    (section) => section.PageTitle === "ORDERING MADE EASY WITH",
  );
  const convenienceSection = sections?.data?.find(
    (section) => section.PageTitle === "Convenience",
  );
  const joinBoldnessSection = sections?.data?.find(
    (section) => section.PageTitle === "Join Our World of Boldness",
  );
  const discoverDealSection = sections?.data?.find(
    (section) => section.PageTitle === "DISCOVER YOUR DEALS",
  );

  const mobileAppsData = mobileAppsResponse?.data,
    sortedMobileApps = mobileAppsData ? sortByOrder(mobileAppsData) : [];

  const resources: GetAppPageResourcesProps = {
    foodLove: t("foodLove"),
    donwloadOurApp: t("donwloadOurApp"),
  };

  return (
    <GetTheAppView
      locale={locale}
      pageName={pageName}
      resources={resources}
      mobileAppsData={sortedMobileApps}
      orderingEasySection={orderingEasySection}
      convenienceSection={convenienceSection}
      joinBoldnessSection={joinBoldnessSection}
      discoverDealSection={discoverDealSection}
    />
  );
}
