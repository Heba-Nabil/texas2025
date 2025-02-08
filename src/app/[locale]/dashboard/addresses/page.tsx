// import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserAddressesService } from "@/server/services/userService";
import AddressesView from "@/views/dashboard/addresses/AddressesView";
// Types
import { Metadata } from "next";
import { UserAddressesPageResourcesProps } from "@/types/resources";

type UserAddressesPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: UserAddressesPageProps,
): Promise<Metadata> {
  return {
    title: "Addresses",
  };
}

export default async function UserAddressesPage(props: UserAddressesPageProps) {
  const {
    params: { locale },
  } = props;

  const [addressesResponse, t] = await Promise.all([
    getUserAddressesService(locale),
    getTranslations(),
  ]);

  // if (!addressesResponse?.data) return notFound();

  const resources: UserAddressesPageResourcesProps = {
    myAddresses: t("myAddresses"),
    addAddress: t("addAddress"),
    noAddresses: t("noAddresses"),
    noAddressesDesc: t("noAddressesDesc"),
    phone: t("phone"),
    missingGeoLocation: t("missingGeoLocation"),
  };

  return (
    <AddressesView
      locale={locale}
      data={addressesResponse?.data}
      resources={resources}
    />
  );
}
