import { getTranslations } from "next-intl/server";
import ForgetPasswordView from "@/views/auth/forgetPassword/ForgetPasswordView";
// Types
import type { Metadata } from "next";
import { ForgetPasswordPageResourcesProps } from "@/types/resources";

type ForgetPasswordPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: ForgetPasswordPageProps,
): Promise<Metadata> {
  return {
    title: "Forget Password",
  };
}

export default async function ForgetPasswordPage(
  props: ForgetPasswordPageProps,
) {
  const {
    params: { locale },
  } = props;

  const t = await getTranslations();

  const resources: ForgetPasswordPageResourcesProps = {
    forgetPass: t("forgetPass"),
    requiredEmailWithMinLengthOfFive: t("requiredEmailWithMinLengthOfFive"),
    maxLength: t("maxLength"),
    character: t("character"),
    emailNotValid: t("emailNotValid"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    email: t("email"),
    phone: t("phone"),
    resetPass: t("resetPass"),
    forgotPassPageDesc: t("forgotPassPageDesc"),
  };

  return <ForgetPasswordView locale={locale} resources={resources} />;
}
