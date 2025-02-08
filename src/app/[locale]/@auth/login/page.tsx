import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { THIRD_PARTY_INFO } from "@/utils/constants";
import LoginView from "@/views/auth/login/LoginView";
// Types
import type { Metadata } from "next";
import { LoginPageResourcesProps } from "@/types/resources";

type LoginPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: LoginPageProps,
): Promise<Metadata> {
  return {
    title: "Login",
  };
}

export default async function LoginPage(props: LoginPageProps) {
  const {
    params: { locale },
  } = props;

  const t = await getTranslations();

  const resources: LoginPageResourcesProps = {
    login: t("login"),
    logIn: t("logIn"),
    continueWithFacebook: t("continueWithFacebook"),
    continueWithGoogle: t("continueWithGoogle"),
    continueWithApple: t("continueWithApple"),
    or: t("or"),
    email: t("email"),
    requiredEmailWithMinLengthOfFive: t("requiredEmailWithMinLengthOfFive"),
    emailNotValid: t("emailNotValid"),
    requiredPass: t("requiredPass"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    rememberMe: t("rememberMe"),
    forgetPass: t("forgetPass"),
    submitting: t("submitting"),
    dontHaveAccount: t("dontHaveAccount"),
    continueAsGuest: t("continueAsGuest"),
    password: t("password"),
    captchaRequired: t("captchaRequired"),
    maxLengthFiftyCharacter: t("maxLengthFiftyCharacter"),
    character: t("character"),
    maxLength: t("maxLength"),
  };

  const hasThirdPartyCookie = cookies().get(THIRD_PARTY_INFO);
  const thirdPartySession = hasThirdPartyCookie?.value
    ? JSON.parse(hasThirdPartyCookie.value)
    : undefined;

  return (
    <LoginView
      resources={resources}
      locale={locale}
      thirdPartySession={thirdPartySession}
    />
  );
}
