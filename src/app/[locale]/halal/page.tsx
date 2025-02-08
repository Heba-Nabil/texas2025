import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
  getSingleCategoryDocument,
} from "@/server/services/globalService";
import HalalView from "@/views/halal/HalalView";
// Types
import type { Metadata } from "next";
import { HalalPageResourcesProps } from "@/types/resources";

type HalalPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: HalalPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Halal", "Halal");
  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Halal";

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

export default async function HalalPage(props: HalalPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("HALAL");

  const [t, sections, halalDocRes] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, "halalPage"),
    getSingleCategoryDocument(locale, "halalPage", "doc"),
  ]);

  const whatIsHalalFoodSection = sections?.data?.find(
    (section) => section.PageTitle === "WHAT IS HALAL FOOD?",
  )!;
  // const internalControlsSection = sections?.data?.find(
  //   (section) => section.PageTitle === "Internal Controls",
  // )!;

  const innerSections = sections?.data
    ? sections?.data?.filter((item) => !item.Featured)
    : [];

  const resources: HalalPageResourcesProps = {
    halal: t("halal"),
    backToHome: t("backToHome"),
    seeOurHalal: t("seeOurHalal"),
    downloadPdf: t("downloadPdf"),
  };

  return (
    <HalalView
      resources={resources}
      whatIsHalalFoodSection={whatIsHalalFoodSection}
      internalControlsSection={innerSections}
      halalDoc={halalDocRes?.data ? halalDocRes?.data[0] : undefined}
      isMobileView={!!appview}
    />
  );
}
