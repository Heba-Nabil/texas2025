import { getTranslations } from "next-intl/server";
import validateModule from "@/server/lib/validateModule";
import { getCountryData, getMetaData } from "@/server/services/globalService";
import LocationsView from "@/views/locations/LocationsView";
// Types
import type { Metadata } from "next";
import { LocationsPageResourcesProps } from "@/types/resources";

type LocationsPageProps = {
  params: {
    locale: string;
  };
  searchParams: {
    appview: string;
  };
};

export async function generateMetadata({
  params: { locale },
}: LocationsPageProps): Promise<Metadata> {
  const metaData = await getMetaData(locale, "Locations", "Locations");

  const pageData = metaData?.data;
  const pageTitle = pageData?.PageTitle || "Locations";

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

export default async function LocationsPage(props: LocationsPageProps) {
  const {
    params: { locale },
    searchParams: { appview },
  } = props;

  await validateModule("LOCATION");

  const [t, countryResponse] = await Promise.all([
    getTranslations(),
    getCountryData(locale, "Locations Page"),
  ]);

  const countryData = countryResponse?.data;

  if (!countryData) return null;

  const resources: LocationsPageResourcesProps = {
    locations: t("locations"),
    backToHome: t("backToHome"),
    allowLocationMsg: t("allowLocationMsg"),
    driveThruOrPickupFromLocation: t("driveThruOrPickupFromLocation"),
    findNearstTexasChicken: t("findNearstTexasChicken"),
    noResultsFound: t("noResultsFound"),
    openDaily: t("openDaily"),
    getDirections: t("getDirections"),
    phoneNumber: t("phoneNumber"),
    notAvailable: t("notAvailable"),
    busy: t("busy"),
    farFromLocation: t("farFromLocation"),
    hotLine: t("hotLine"),
  };

  const countryCustomerService = parseInt(
    countryData?.Data?.CustomerServiceLine,
  )
    ? countryData?.Data?.CustomerServiceLine
    : "";

  return (
    <LocationsView
      locale={locale}
      resources={resources}
      stores={countryData?.Stores}
      countryCustomerService={countryCustomerService}
      countryCenter={{
        lat: Number(countryData?.Data?.Latitude),
        lng: Number(countryData?.Data?.Longitude),
      }}
      zoom={countryData?.Data?.Zoom}
      isMobileView={!!appview}
    />
  );
}
