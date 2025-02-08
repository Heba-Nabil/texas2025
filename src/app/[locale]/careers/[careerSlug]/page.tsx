import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getMetaData } from "@/server/services/globalService";
import { getSingleCareer } from "@/server/services/careersService";
import validateModule from "@/server/lib/validateModule";
import CareerDetailsView from "@/views/careers/careerDetails/CareerDetailsView";
// Types
import type { Metadata } from "next";
import { CareersDetailsPageResourcesProps } from "@/types/resources";

type CareerDetailsPageProps = {
  params: {
    locale: string;
    careerSlug: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: CareerDetailsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(
    locale,
    "Careers Details",
    "Careers Details",
  );

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Careers Details";

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

export default async function CareerDetailsPage(props: CareerDetailsPageProps) {
  const {
    params: { locale, careerSlug },
  } = props;

  await validateModule("CAREER");

  const [t, careerResponse] = await Promise.all([
    getTranslations(),
    getSingleCareer(locale, careerSlug),
  ]);

  if (!careerResponse?.data) return notFound();

  const resources: CareersDetailsPageResourcesProps = {
    backToCareers: t("backToCareers"),
    careersTermsAndConditions: t("careersTermsAndConditions"),
    careersDeclaration: t("careersDeclaration"),
    submit: t("submit"),
    applyNow: t("applyNow"),
    personalParticulars: t("personalParticulars"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    email: t("email"),
    phone: t("phone"),
    phonePlaceholder: t("phonePlaceholder"),
    citizenshipId: t("citizenshipId"),
    requiredCitizenshipID: t("requiredCitizenshipID"),
    selectCity: t("selectCity"),
    cityRequired: t("cityRequired"),
    selectArea: t("selectArea"),
    requiredAreaID: t("requiredAreaID"),
    date: t("date"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    character: t("character"),
    maxLength: t("maxLength"),
    EducationLevel: t("EducationLevel"),
    requiredEducationLevel: t("requiredEducationLevel"),
    invalidDate: t("invalidDate"),
    invalidTime: t("invalidTime"),
    JobType: t("JobType"),
    phoneValidate: t("phoneValidate"),
    requiredDate: t("requiredDate"),
    requiredTime: t("requiredTime"),
    requiredJobType: t("requiredJobType"),
    theTime: t("theTime"),
    requiredEmail: t("requiredEmail"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    requiredPhone: t("requiredPhone"),
    requiredWorkLoction: t("requiredWorkLoction"),
    ResidentialAddress: t("ResidentialAddress"),
    WorkLoction: t("WorkLoction"),
    emailNotValid: t("emailNotValid"),
    requiredResidentialAddress: t("requiredResidentialAddress"),
    canOnlyContainNumbers: t("canOnlyContainNumbers"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    captchaRequired: t("captchaRequired"),
    dragAndDrop: t("dragAndDrop"),
    upTo10MB: t("upTo10MB"),
    fileTooLarge: t("fileTooLarge"),
    invalidFileType: t("invalidFileType"),
    uploadFile: t("uploadFile"),
    HighSchool: t("HighSchool"),
    AssociateDegree: t("AssociateDegree"),
    BachelorDegree: t("BachelorDegree"),
    MasterDegree: t("MasterDegree"),
    Doctorate: t("Doctorate"),
    Certificate: t("Certificate"),
    NoEducation: t("NoEducation"),
    Hybrid: t("Hybrid"),
    OnSite: t("OnSite"),
    Remote: t("Remote"),
    PartTime: t("PartTime"),
    FullTime: t("FullTime"),
    canOnlyContainNumbersAndlettersAndCommas: t(
      "canOnlyContainNumbersAndlettersAndCommas",
    ),
    submittedSuccess: t("submittedSuccess"),
  };

  return (
    <CareerDetailsView
      locale={locale}
      resources={resources}
      data={careerResponse.data}
    />
  );
}
