import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getAllPageSection,
  getMetaData,
  getSingleSectionSingleContent,
  getSingleSectionSingleContentMedia,
} from "@/server/services/globalService";
import validateModule from "@/server/lib/validateModule";
import BlogDetailsView from "@/views/blogs/inner/BlogDetailsView";
// Types
import type { Metadata } from "next";
import { BlogsDetailsPageResourcesProps } from "@/types/resources";

type BlogsDetailsPageProps = {
  params: {
    locale: string;
    blogSlug: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: BlogsDetailsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Blog Details", "Blog Details");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Blog Details";

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

export default async function BlogDetailsPage(props: BlogsDetailsPageProps) {
  const {
    params: { locale, blogSlug },
  } = props;

  await validateModule("BLOG");

  const pageName = "blogsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllNewsSection = sections?.data?.find(
    (section) => section.PageTitle === "All Blogs Section",
  );

  if (!AllNewsSection) return notFound();

  const innerBlogsContent = await getSingleSectionSingleContent(
    locale,
    pageName,
    AllNewsSection.UniqueName,
    blogSlug,
  );

  if (!innerBlogsContent?.data) return notFound();

  const innerBlogsMedia = await getSingleSectionSingleContentMedia(
    locale,
    pageName,
    blogSlug,
  );

  const resources: BlogsDetailsPageResourcesProps = {
    backToBlogs: t("backToBlogs"),
  };

  return (
    <BlogDetailsView
      locale={locale}
      resources={resources}
      innerBlogsContent={innerBlogsContent?.data}
      innerBlogsMedia={innerBlogsMedia?.data}
    />
  );
}
