import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserProfileData } from "@/server/services/userService";
import ProfileView from "@/views/dashboard/profile/ProfileView";
// Types
import type { Metadata } from "next";
import { ProfilePageResourcesProps } from "@/types/resources";

type ProfilePageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: ProfilePageProps,
): Promise<Metadata> {
  return {
    title: "Profile",
  };
}

export default async function ProfilePage(props: ProfilePageProps) {
  const {
    params: { locale },
  } = props;

  const [profileData, t] = await Promise.all([
    getUserProfileData(locale),
    getTranslations(),
  ]);

  // if (!profileData?.data) return notFound();

  const resources: ProfilePageResourcesProps = {
    updateYourDetails: t("updateYourDetails"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    character: t("character"),
    emailNotValid: t("emailNotValid"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    maxLength: t("maxLength"),
    phoneValidate: t("phoneValidate"),
    requiredEmail: t("requiredEmail"),
    requiredFirstName: t("requiredFirstName"),
    requiredLastName: t("requiredLastName"),
    requiredPhone: t("requiredPhone"),
    email: t("email"),
    phone: t("phone"),
    markettingCommun: t("markettingCommun"),
    markettingCommunDesc: t("markettingCommunDesc"),
    appCommun: t("appCommun"),
    appCommunDesc: t("appCommunDesc"),
    cancel: t("cancel"),
    saveUpdates: t("saveUpdates"),
    userDetailsUpdatedSuccess: t("userDetailsUpdatedSuccess"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
  };

  return (
    <ProfileView
      resources={resources}
      data={profileData?.data}
      locale={locale}
    />
  );
}
