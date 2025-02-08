import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import {
  getAllPageSection,
  getMetaData,
} from "@/server/services/globalService";
import BirthdayView from "@/views/birthday/BirthdayView";
// Types
import type { Metadata } from "next";
import { BirthdayPageResourcesProps } from "@/types/resources";

type BirthdayPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: BirthdayPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Birthday", "Birthday");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Birthday";

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

export default async function BirthdayPage(props: BirthdayPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("BirthDayForm");

  const pageName = "birthDayPage";

  const [t, sections] = await Promise.all([
    getTranslations(),
    getAllPageSection(locale, pageName),
  ]);

  const inStoreSection = sections?.data?.find(
    (section) => section.PageTitle === "In Store",
  );

  const cateringSection = sections?.data?.find(
    (section) => section.PageTitle === "CATERING",
  );

  const resources: BirthdayPageResourcesProps = {
    birthday: t("birthday"),
    backToHome: t("backToHome"),
    forYourSpecialOccasion: t("forYourSpecialOccasion"),
    thankYouForConsidering: t("thankYouForConsidering"),
    send: t("send"),
    requiredFirstName: t("requiredFirstName"),
    maxLength: t("maxLength"),
    character: t("character"),
    firstName: t("firstName"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    requiredLastName: t("requiredLastName"),
    lastName: t("lastName"),
    email: t("email"),
    emailNotValid: t("emailNotValid"),
    requiredEmail: t("requiredEmail"),
    requiredPhone: t("requiredPhone"),
    date: t("date"),
    theTime: t("theTime"),
    phoneValidate: t("phoneValidate"),
    subjectRequired: t("subjectRequired"),
    subject: t("subject"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    subjectMinLength: t("subjectMinLength"),
    requiredMessage: t("requiredMessage"),
    message: t("message"),
    requiredDate: t("requiredDate"),
    invalidDate: t("invalidDate"),
    requiredTime: t("requiredTime"),
    invalidTime: t("invalidTime"),
    requiredLocation: t("requiredLocation"),
    requiredInquiry: t("requiredInquiry"),
    captchaRequired: t("captchaRequired"),
    phonePlaceholder: t("phonePlaceholder"),
    Location: t("Location"),
    Inquiry: t("Inquiry"),
    meatPreference: t("meatPreference"),
    Numberofchickenpieces: t("Numberofchickenpieces"),
    invalidNumberofchickenpieces: t("invalidNumberofchickenpieces"),
    fullName: t("fullName"),
    selectGender: t("selectGender"),
    requiredGender: t("requiredGender"),
    male: t("male"),
    female: t("female"),
    age: t("age"),
    invalidAge: t("invalidAge"),
    selectCity: t("selectCity"),
    requiredCity: t("requiredCity"),
    invitees: t("invitees"),
    requiredInvitees: t("requiredInvitees"),
    applyNowonly: t("applyNowonly"),
    requiredName: t("requiredName"),
    requiredAge: t("requiredAge"),
    cityRequired: t("cityRequired"),
    sendMessage: t("sendMessage"),
    submittedSuccess: t("submittedSuccess"),
  };

  return (
    <BirthdayView
      locale={locale}
      resources={resources}
      inStoreSection={inStoreSection}
      cateringSection={cateringSection}
    />
  );
}
