import { headers } from "next/headers";
import { getSelectorsByUserAgent } from "react-device-detect";
import { redirect } from "@/navigation";
import { getAllPageSection } from "@/server/services/globalService";

type QrDeviceRedirectProps = {
  params: {
    locale: string;
  };
};

export default async function QrDeviceRedirect(props: QrDeviceRedirectProps) {
  const {
    params: { locale },
  } = props;

  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  const mobileAppsResponse = await getAllPageSection(locale, "mobileApps");

  const mobileAppsData = mobileAppsResponse?.data;

  const appStoreLink = mobileAppsData
      ?.find((item) => item.PageTitle?.trim()?.toLowerCase() === "appstore")
      ?.Link1?.trim(),
    googlePlayLink = mobileAppsData
      ?.find((item) => item.PageTitle?.trim()?.toLowerCase() === "googleplay")
      ?.Link1?.trim();

  if (!appStoreLink || !googlePlayLink) return redirect("/");

  const { isAndroid, isIOS } = getSelectorsByUserAgent(userAgent);

  if (isAndroid && googlePlayLink) return redirect(googlePlayLink);

  if (isIOS && appStoreLink) {
    return redirect(appStoreLink);
  }
}
