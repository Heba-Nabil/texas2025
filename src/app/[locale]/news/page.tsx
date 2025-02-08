import { getTranslations } from "next-intl/server";
// import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
  getSingleSectionContent,
} from "@/server/services/globalService";
import NewsView from "@/views/news/NewsView";
// Types
import type { Metadata } from "next";
import { NewsPageResourcesProps } from "@/types/resources";

type NewsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: NewsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "News", "News");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "News";

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

export default async function NewsPage(props: NewsPageProps) {
  const {
    params: { locale },
  } = props;

  // await validateModule("LOCATION");

  const pageName = "NewsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllNewsSection = sections?.data?.find(
    (section) => section.PageTitle === "All News Section",
  );

  if (!AllNewsSection) return null;

  const AllNewsContent = await getSingleSectionContent(
    locale,
    pageName,
    AllNewsSection.UniqueName,
  );

  if (!AllNewsContent?.data) return null;

  const resources: NewsPageResourcesProps = {
    ourNews: t("ourNews"),
    backToHome: t("backToHome"),
    readMore: t("readMore"),
  };

  return (
    <NewsView
      resources={resources}
      AllNewsSection={AllNewsSection}
      AllNewsContent={AllNewsContent?.data}
    />
  );
}
