import { getTranslations } from "next-intl/server";
import DeleteAccountView from "@/views/dashboard/delete/DeleteAccountView";
// Types
import { Metadata } from "next";
import { DeleteAccountPageResources } from "@/types/resources";

type DeleteAccountPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: DeleteAccountPageProps,
): Promise<Metadata> {
  return {
    title: "Addresses",
  };
}

export default async function DeleteAccountPage(props: DeleteAccountPageProps) {
  const {
    params: { locale },
  } = props;

  const t = await getTranslations();

  const resources: DeleteAccountPageResources = {
    deleteMyAccount: t("deleteMyAccount"),
    areYouSureYouWantDeleteAccount: t("areYouSureYouWantDeleteAccount"),
    deleteAccountDescription: t("deleteAccountDescription"),
    delete: t("delete"),
  };

  return <DeleteAccountView locale={locale} resources={resources} />;
}
