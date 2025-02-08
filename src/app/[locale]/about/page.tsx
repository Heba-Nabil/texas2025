import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
  getSingleSectionContent,
  getSingleSectionMedia,
} from "@/server/services/globalService";
import AboutView from "@/views/about/AboutView";
import EmptyData from "@/components/emptyStates/EmptyData";
// Types
import type { Metadata } from "next";
import { AboutPageResourcesProps } from "@/types/resources";

type AboutPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: AboutPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "About", "About");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "About";

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

export default async function AboutPage(props: AboutPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("STORY");

  const pageName = "OurStoryPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const servingSection = sections?.data?.find(
    (section) => section?.PageTitle === "Serving really good chicken",
  )!;

  const texasHistorySection = sections?.data?.find(
    (section) => section?.PageTitle === "Texas chicken History",
  )!;
  const texasHistoryMedia = await getSingleSectionMedia(
    locale,
    pageName,
    texasHistorySection?.UniqueName,
  );

  const texasHistoryVideo = texasHistoryMedia?.data?.find(
    (video) => video?.Name === "Texas chicken History",
  )!;

  const keyBrandsSection = sections?.data?.find(
    (section) => section?.PageTitle === "Key Brands",
  )!;

  const keyBrandsContent = await getSingleSectionContent(
    locale,
    pageName,
    keyBrandsSection?.UniqueName,
  );

  const resources: AboutPageResourcesProps = {
    ourStory: t("ourStory"),
    backToHome: t("backToHome"),
  };

  if(!servingSection || !texasHistorySection || !keyBrandsSection) return <EmptyData />

  return (
    <AboutView
      resources={resources}
      servingSection={servingSection}
      texasHistorySection={texasHistorySection}
      texasHistoryVideo={texasHistoryVideo}
      keyBrandsSection={keyBrandsSection}
      keyBrandsContent={keyBrandsContent?.data}
      isMobileView={!!appview}
    />
  );
}
