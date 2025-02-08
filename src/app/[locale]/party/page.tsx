import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
// Types
import type { Metadata } from "next";
import { PartyPageResourcesProps } from "@/types/resources";
import PartyView from "@/views/party/PartyView";

type PartyPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: PartyPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Party", "Party");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Party";

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

export default async function PartyPage(props: PartyPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("BirthDay");

  const pageName = "partyPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const inStoreSection = sections?.data?.find(
    (section) => section.PageTitle === "IN STORE",
  );

  if (!inStoreSection) return null;

  const resources: PartyPageResourcesProps = {
    party: t("party"),
    backToHome: t("backToHome"),
    applyNowonly: t("applyNowonly"),
    send: t("send"),
    forYourSpecialOccasion: t("forYourSpecialOccasion"),
    thankYouForConsidering: t("thankYouForConsidering"),
    captchaRequired: t("captchaRequired"),
    requiredName: t("requiredName"),
    maxLength: t("maxLength"),
    character: t("character"),
    requiredLastName: t("requiredLastName"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    requiredDate: t("requiredDate"),
    invalidDate: t("invalidDate"),
    requiredCity: t("requiredCity"),
    selectCity: t("selectCity"),
    lastName: t("lastName"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    firstName: t("firstName"),
    requiredFirstName: t("requiredFirstName"),
    email: t("email"),
    phonePlaceholder: t("phonePlaceholder"),
    date: t("date"),
    cityRequired: t("cityRequired"),
    subject: t("subject"),
    Location: t("cityRequired"),
    theTime: t("theTime"),
    Inquiry: t("Inquiry"),
    subjectRequired: t("subjectRequired"),
    requiredTime: t("requiredTime"),
    requiredLocation: t("requiredLocation"),
    requiredInquiry: t("requiredInquiry"),
    subjectMinLength: t("subjectMinLength"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    invalidTime: t("invalidTime"),
    Numberofchickenpieces: t("Numberofchickenpieces"),
    invalidNumberofchickenpieces: t("invalidNumberofchickenpieces"),
    WeddingParty: t("WeddingParty"),
    BirthdayParty: t("BirthdayParty"),
    OfficeParty: t("OfficeParty"),
    SummerBackyardParty: t("SummerBackyardParty"),
    ChristmasParty: t("ChristmasParty"),
    WatchingTV: t("WatchingTV"),
    EmployeeLunch: t("EmployeeLunch"),
    Other: t("Other"),
    meatPreference: t("meatPreference"),
    BothWhiteDark: t("BothWhiteDark"),
    WhiteMeat: t("WhiteMeat"),
    DarkMeat: t("DarkMeat"),
    storeRequired: t("storeRequired"),
    selectBranch: t("selectBranch"),
    submittedSuccess: t("submittedSuccess"),
  };

  return (
    <PartyView
      locale={locale}
      resources={resources}
      inStoreSection={inStoreSection}
    />
  );
}
