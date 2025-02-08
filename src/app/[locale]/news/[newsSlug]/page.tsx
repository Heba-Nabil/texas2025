import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAllPageSection,
  getMetaData,
  getSingleSectionSingleContent,
  getSingleSectionSingleContentMedia,
} from "@/server/services/globalService";
import NewsDetailsView from "@/views/news/newsDetails/NewsDetailsView";
// Types
import type { Metadata } from "next";
import { NewsDetailsPageResourcesProps } from "@/types/resources";

type NewsDetailsPageProps = {
  params: {
    locale: string;
    newsSlug: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: NewsDetailsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "News Details", "News Details");
  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "News Details";

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

export default async function NewsDetailsPage(props: NewsDetailsPageProps) {
  const {
    params: { locale, newsSlug },
  } = props;

  const pageName = "NewsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllNewsSection = sections?.data?.find(
    (section) => section.PageTitle === "All News Section",
  );

  if (!AllNewsSection) return notFound();

  const innerNewsContent = await getSingleSectionSingleContent(
    locale,
    pageName,
    AllNewsSection.UniqueName,
    newsSlug,
  );

  if (!innerNewsContent?.data) return notFound();

  const innerNewsMedia = await getSingleSectionSingleContentMedia(
    locale,
    pageName,
    newsSlug,
  );

  const resources: NewsDetailsPageResourcesProps = {
    backToNews: t("backToNews"),
  };

  return (
    <NewsDetailsView
      locale={locale}
      resources={resources}
      innerNewsContent={innerNewsContent?.data}
      innerNewsMedia={innerNewsMedia?.data}
    />
  );
}
