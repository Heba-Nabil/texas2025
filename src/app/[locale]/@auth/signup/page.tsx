import { getTranslations } from "next-intl/server";
import SignupView from "@/views/auth/signup/SignupView";
// Types
import type { Metadata } from "next";
import { SignupPageResourcesProps } from "@/types/resources";

type SignupPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: SignupPageProps,
): Promise<Metadata> {
  return {
    title: "Signup",
  };
}

export default async function SignupPage(props: SignupPageProps) {
  const {
    params: { locale },
  } = props;

  const t = await getTranslations();

  const resources: SignupPageResourcesProps = {
    signUp: t("signUp"),
    email: t("email"),
    phone: t("phone"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    requiredPass: t("requiredPass"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    submitting: t("submitting"),
    continueAsGuest: t("continueAsGuest"),
    password: t("password"),
    captchaRequired: t("captchaRequired"),
    alreadyHaveAccount: t("alreadyHaveAccount"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    marketingConfirmation: t("marketingConfirmation"),
    orderNotificationConfirmation: t("orderNotificationConfirmation"),
    termsConditions: t("termsConditions"),
    privacyPolicy: t("privacyPolicy"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    firstNameNotValid: t("firstNameNotValid"),
    lastNameNotValid: t("lastNameNotValid"),
    character: t("character"),
    maxLength: t("maxLength"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    passwordNotValid: t("passwordNotValid"),
    termsConfirmation: t("termsConfirmation"),
    ageConfirmation: t("ageConfirmation"),
    privacyConfirmation: t("privacyConfirmation"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
  };

  return <SignupView locale={locale} resources={resources} />;
}
