import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import { getCareers } from "@/server/services/careersService";
import CareersView from "@/views/careers/CareersView";
// Types
import type { Metadata } from "next";
import { CareersPageResourcesProps } from "@/types/resources";

type CareersPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: CareersPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Careers", "Careers");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Careers";

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

export default async function CareersPage(props: CareersPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("CAREER");

  const pageName = "careersPage";

  const [t, allCareersResponse, careersResponse] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
    getCareers(locale),
  ]);

  if (!careersResponse?.data) return null;

  const resources: CareersPageResourcesProps = {
    careers: t("careers"),
    backToHome: t("backToHome"),
  };

  const firstSection = allCareersResponse?.data?.find(
    (item) => item?.PageTitle === "PERSONAL PARTICULARS",
  );

  return (
    <CareersView
      resources={resources}
      sectionData={firstSection!}
      data={careersResponse?.data}
    />
  );
}
