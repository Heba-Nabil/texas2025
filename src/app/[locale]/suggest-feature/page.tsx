import { getTranslations } from "next-intl/server";
// import validateModule from "@/server/lib/validateModule";
import { getMetaData } from "@/server/services/globalService";
import SuggestFeatureView from "@/views/suggest-feature/SuggestFeatureView";
// Types
import type { Metadata } from "next";
import { SuggestFeaturePageResourcesProps } from "@/types/resources";

type ReportIssuePageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: ReportIssuePageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Suggest Feature",
    "Suggest Feature",
  );

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Suggest Feature";

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

export default async function SuggestFeaturePage(props: ReportIssuePageProps) {
  const {
    params: { locale },
  } = props;

  // await validateModule("Footer_Privacy");

  const t = await getTranslations();

  const resources: SuggestFeaturePageResourcesProps = {
    haveAFeature: t("haveAFeature"),
    hearYourSuggestion: t("hearYourSuggestion"),
    suggestFeature: t("suggestFeature"),
    backToHome: t("backToHome"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    email: t("email"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    phonePlaceholder: t("phonePlaceholder"),
    requiredPhone: t("requiredPhone"),
    telMaxLength: t("telMaxLength"),
    phoneValidate: t("phoneValidate"),
    details: t("details"),
    requiredDetails: t("requiredDetails"),
    describeFeature: t("describeFeature"),
    requiredFeatureTitle: t("requiredFeatureTitle"),
    featureTitle: t("featureTitle"),
    requiredIssueTitle: t("requiredIssueTitle"),
    submit: t("submit"),
    maxLength: t("maxLength"),
    character: t("character"),
    userName: t("userName"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    requiredPass: t("requiredPass"),
    dataOptionRequired: t("dataOptionRequired"),
    passwordNotValid: t("passwordNotValid"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    dataOption: t("dataOption"),
    suggetFeatureDesc: t("suggetFeatureDesc"),
    captchaRequired: t("captchaRequired"),
    submittedSuccess: t("submittedSuccess"),
  };

  return <SuggestFeatureView locale={locale} resources={resources} />;
}
