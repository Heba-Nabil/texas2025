import { getTranslations } from "next-intl/server";
// import validateModule from "@/server/lib/validateModule";
import { getMetaData } from "@/server/services/globalService";
import ReportIssueView from "@/views/report-issue/ReportIssueView";
// Types
import type { Metadata } from "next";
import { ReportIssuePageResourcesProps } from "@/types/resources";

type ReportIssuePageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: ReportIssuePageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Report Issue", "Report Issue");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Report Issue";

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

export default async function ReportIssuePage(props: ReportIssuePageProps) {
  const {
    params: { locale },
  } = props;

  // await validateModule("Footer_Privacy");

  const t = await getTranslations();

  const resources: ReportIssuePageResourcesProps = {
    reportIssue: t("reportIssue"),
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
    selectYourIssue: t("selectYourIssue"),
    issueRequired: t("backToHome"),
    issueTitle: t("issueTitle"),
    requiredIssueTitle: t("requiredIssueTitle"),
    details: t("details"),
    requiredDetails: t("requiredDetails"),
    others: t("others"),
    paymentProblem: t("paymentProblem"),
    canNotPlaceOrder: t("canNotPlaceOrder"),
    canNotRegister: t("canNotRegister"),
    canNotLogin: t("canNotLogin"),
    canNotAddItemsToCart: t("canNotAddItemsToCart"),
    submit: t("submit"),
    character: t("character"),
    issue: t("issue"),
    maxLength: t("maxLength"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    facingMenuProblem: t("facingMenuProblem"),
    letUsKnow: t("letUsKnow"),
    captchaRequired: t("captchaRequired"),
    submittedSuccess: t("submittedSuccess"),
  };

  return <ReportIssueView locale={locale} resources={resources} />;
}
