import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import ContactView from "@/views/contact/ContactView";
// Types
import type { Metadata } from "next";
import { ContactPageResourcesProps } from "@/types/resources";

type ContactPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: ContactPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Contact Us", "Contact Us");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Contact Us";

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

export default async function ContactPage(props: ContactPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("CONTACT");

  const pageName = "ContactUsPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const getInTouchSection = sections?.data?.find(
    (section) => section.PageTitle === "Get in Touch With us",
  );

  if (!getInTouchSection) return null;

  const resources: ContactPageResourcesProps = {
    contactUs: t("contactUs"),
    submit: t("submit"),
    residencyDetails: t("residencyDetails"),
    phonePlaceholder: t("phonePlaceholder"),
    email: t("email"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    accessData: t("accessData"),
    correctData: t("correctData"),
    deleteData: t("deleteData"),
    receiveCopy: t("receiveCopy"),
    dontSellData: t("dontSellData"),
    backToHome: t("backToHome"),
    character: t("character"),
    dataOption: t("dataOption"),
    dataOptionRequired: t("dataOptionRequired"),
    emailNotValid: t("emailNotValid"),
    minLength: t("minLength"),
    maxLength: t("maxLength"),
    phoneValidate: t("phoneValidate"),
    requiredName: t("requiredName"),
    requiredEmail: t("requiredEmail"),
    requiredPhone: t("requiredPhone"),
    subject: t("subject"),
    userName: t("userName"),
    subjectRequired: t("subjectRequired"),
    selectData: t("selectData"),
    residencyDetailsRequired: t("residencyDetailsRequired"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    captchaRequired: t("captchaRequired"),
    fileTooLarge: t("fileTooLarge"),
    invalidFileType: t("invalidFileType"),
    uploadFile: t("uploadFile"),
    dragAndDrop: t("dragAndDrop"),
    upTo10MB: t("upTo10MB"),
    date: t("date"),
    theTime: t("theTime"),
    requiredTime: t("requiredTime"),
    invalidTime: t("invalidTime"),
    requiredDate: t("requiredDate"),
    invalidDate: t("invalidDate"),
    message: t("message"),
    requiredMessage: t("requiredMessage"),
    subjectMinLength: t("subjectMinLength"),
    selectCity: t("selectCity"),
    cityRequired: t("cityRequired"),
    selectBranch: t("selectBranch"),
    branchRequired: t("branchRequired"),
    submittedSuccess: t("submittedSuccess"),
  };

  return (
    <ContactView
      locale={locale}
      resources={resources}
      getInTouchSection={getInTouchSection}
    />
  );
}
