import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import { getFaqs, getMetaData } from "@/server/services/globalService";
import FAQView from "@/views/faq/FAQView";
import EmptyData from "@/components/emptyStates/EmptyData";
// Types
import type { Metadata } from "next";
import { FaqPageResourcesProps } from "@/types/resources";

type FAQPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: FAQPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "FAQ", "FAQ");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "FAQ";

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

export default async function FAQPage(props: FAQPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("FAQ");

  const [t, faqResponse] = await Promise.all([
    getTranslations(),
    getFaqs(locale),
  ]);

  if (!faqResponse?.data || faqResponse?.data?.length === 0)
    return <EmptyData />;

  const resources: FaqPageResourcesProps = {
    faqs: t("faqs"),
    backToHome: t("backToHome"),
  };

  return (
    <FAQView
      resources={resources}
      faqData={faqResponse?.data}
      isMobileView={!!appview}
    />
  );
}
