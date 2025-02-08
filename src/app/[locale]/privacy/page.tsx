import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import PrivacyView from "@/views/privacy/PrivacyView";
// Types
import type { Metadata } from "next";
import { PrivacyPageResourcesProps } from "@/types/resources";

type PrivacyPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: PrivacyPageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Privacy Policy",
    "Privacy Policy",
  );

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Privacy Policy";

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

export default async function PrivacyPage(props: PrivacyPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("Footer_Privacy");

  const pageName = "privacyPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const AllPrivacySection = sections?.data?.find(
    (section) => section.PageTitle === "All Privacy Policy",
  );

  if (!AllPrivacySection) return null;

  const resources: PrivacyPageResourcesProps = {
    privacyPolicy: t("privacyPolicy"),
    backToHome: t("backToHome"),
  };

  return (
    <PrivacyView
      resources={resources}
      AllPrivacySection={AllPrivacySection}
      isMobileView={!!appview}
    />
  );
}
