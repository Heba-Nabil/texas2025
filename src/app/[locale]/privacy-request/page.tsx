import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
// import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import PrivacyRequestView from "@/views/privacy-request/PrivacyRequestView";
// Types
import { Metadata } from "next";
import { PrivacyRequestPageeResourcesProps } from "@/types/resources";

type PrivacyRequestPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: PrivacyRequestPageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Privacy Request",
    "Privacy Request",
  );

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Privacy Request";

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

const PrivacyRequestPage = async (props: PrivacyRequestPageProps) => {
  const {
    params: { locale },
  } = props;

    // await validateModule("Footer_Privacy");

  const pageName = "PrivacyRequestPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const fillTheFormSection = sections?.data?.find(
    (section) => section.PageTitle === "Fill the follwing form",
  );

  if (!fillTheFormSection) return notFound();

  const resources: PrivacyRequestPageeResourcesProps = {
    privacyRequest: t("privacyRequest"),
    backToHome: t("backToHome"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    email: t("email"),
    emailNotValid: t("emailNotValid"),
    password: t("password"),
    requiredPass: t("requiredPass"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    phonePlaceholder: t("phonePlaceholder"),
    requiredPhone: t("requiredPhone"),
    telMaxLength: t("telMaxLength"),
    residencyDetails: t("residencyDetails"),
    selectDataOption: t("selectDataOption"),
    areaRequired: t("areaRequired"),
    submit: t("submit"),
    accessData: t("accessData"),
    correctData: t("correctData"),
    deleteData: t("deleteData"),
    receiveCopy: t("receiveCopy"),
    dontSellData: t("dontSellData"),
    phoneValidate: t("phoneValidate"),
    maxLength: t("maxLength"),
    character: t("character"),
    userName: t("userName"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    requiredEmail: t("requiredEmail"),
    residencyDetailsRequired: t("residencyDetailsRequired"),
    dataOptionRequired: t("dataOptionRequired"),
    dataOption: t("dataOption"),
    selectdataOption: t("selectDataOption"),
    passwordNotValid: t("passwordNotValid"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    captchaRequired: t("captchaRequired"),
    aFileWillBeDownloaded: t("aFileWillBeDownloaded"),
    submittedSuccess: t("submittedSuccess"),
  };

  return (
    <PrivacyRequestView
      resources={resources}
      locale={locale}
      fillTheFormSection={fillTheFormSection}
    />
  );
};

export default PrivacyRequestPage;
