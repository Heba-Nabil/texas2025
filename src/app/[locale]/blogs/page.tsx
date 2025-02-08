import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
  getSingleSectionContent,
} from "@/server/services/globalService";
import BlogsView from "@/views/blogs/BlogsView";
// Types
import type { Metadata } from "next";
import { BlogsPageResourcesProps } from "@/types/resources";
import EmptyData from "@/components/emptyStates/EmptyData";

type BlogsPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: BlogsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Blogs", "Blogs");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Blogs";

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

export default async function BlogsPage(props: BlogsPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("BLOG");

  const pageName = "blogsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllBlogsSection = sections?.data?.find(
    (section) => section?.PageTitle === "All Blogs Section",
  );

  if (!AllBlogsSection) return <EmptyData />;

  const AllBlogsContent = await getSingleSectionContent(
    locale,
    pageName,
    AllBlogsSection.UniqueName,
  );

  const resources: BlogsPageResourcesProps = {
    ourBlogs: t("ourBlogs"),
    backToHome: t("backToHome"),
    readMore: t("readMore"),
  };

  return (
    <BlogsView
      resources={resources}
      AllBlogsSection={AllBlogsSection}
      AllBlogsContent={AllBlogsContent?.data}
    />
  );
}
