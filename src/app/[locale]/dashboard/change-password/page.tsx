import { getTranslations } from "next-intl/server";
import ChangePasswordView from "@/views/dashboard/change-password/ChangePasswordView";
// Types
import type { Metadata } from "next";
import { ChangePasswordPageResourcesProps } from "@/types/resources";

type ChangePasswordPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: ChangePasswordPageProps,
): Promise<Metadata> {
  return {
    title: "Change Password",
  };
}

export default async function ChangePasswordPage(
  props: ChangePasswordPageProps,
) {
  const {
    params: { locale },
  } = props;

  const t = await getTranslations();

  const resources: ChangePasswordPageResourcesProps = {
    maxLength: t("maxLength"),
    character: t("character"),
    passChangedSuccess: t("passChangedSuccess"),
    changePassword: t("changePassword"),
    requiredPass: t("requiredPass"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    forgetPass: t("forgetPass"),
    newPassword: t("newPassword"),
    passwordNotValid: t("passwordNotValid"),
    confirmPassword: t("confirmPassword"),
    passNotMatch: t("passNotMatch"),
    cancel: t("cancel"),
    saveUpdates: t("saveUpdates"),
    currentPassword: t("currentPassword"),
  };

  return <ChangePasswordView locale={locale} resources={resources} />;
}
