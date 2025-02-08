import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import TermsView from "@/views/terms/TermsView";
// Types
import type { Metadata } from "next";
import { TermsPageResourcesProps } from "@/types/resources";

type TermsPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: TermsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Terms & Conditions",
    "Terms & Conditions",
  );
  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Terms & Conditions";

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

export default async function TermsPage(props: TermsPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("Footer_TermsAndcondition");

  const pageName = "termsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllTermsSection = sections?.data?.find(
    (section) => section.PageTitle === "All Terms Section",
  );

  const resources: TermsPageResourcesProps = {
    termsConditions: t("termsConditions"),
    backToHome: t("backToHome"),
  };

  return (
    <TermsView
      resources={resources}
      AllTermsSection={AllTermsSection}
      isMobileView={!!appview}
    />
  );
}
