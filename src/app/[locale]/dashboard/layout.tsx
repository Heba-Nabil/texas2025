// import { RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserProfileData } from "@/server/services/userService";
import { getSession } from "@/server/lib/auth";
import { redirect } from "@/navigation";
import { apiErrorCodes } from "@/utils/constants";
import DashboardSidebar from "@/views/dashboard/DashboardSidebar";
// Types
import { DashboardSidebarResourcesProps } from "@/types/resources";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const {
    children,
    params: { locale },
  } = props;

  const { userId } = await getSession();

  if (!userId) return redirect("/");

  const [profileData, t] = await Promise.all([
    getUserProfileData(locale),
    getTranslations(),
  ]);

  const isAccessTokenExpired = profileData?.errors?.find(
    (item) => item.Code === apiErrorCodes.tokenExpired,
  );

  // if (!profileData?.data) return redirect("/", RedirectType.push);

  const resources: DashboardSidebarResourcesProps = {
    logOut: t("logOut"),
    updateYourDetails: t("updateYourDetails"),
    favourites: t("favourites"),
    orders: t("orders"),
    notifications: t("notifications"),
    myAddresses: t("myAddresses"),
    changePassword: t("changePassword"),
    Offers: t("offers"),
    rewards: t("rewards"),
    deals: t("deals"),
    deleteMyAccount: t("deleteMyAccount"),
  };

  return (
    <div className="flex w-full flex-col bg-gray-100">
      <div className="container flex-grow py-10">
        <div className="relative grid h-full grid-cols-12 gap-6 max-lg:overflow-hidden">
          <div className="col-span-full lg:col-span-4">
            <DashboardSidebar
              isAccessTokenExpired={!!isAccessTokenExpired}
              data={profileData?.data}
              resources={resources}
              locale={locale}
            />
          </div>

          <div className="col-span-full lg:col-span-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
