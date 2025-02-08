import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUserNotificationService } from "@/server/services/userService";
import UserNotificationsView from "@/views/dashboard/notifications/UserNotificationsView";
// Types
import { UserNotificationsPageResourcesProps } from "@/types/resources";

type UserNotificationsPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: UserNotificationsPageProps,
): Promise<Metadata> {
  return {
    title: "Notifications",
  };
}

export default async function UserNotificationsPage(
  props: UserNotificationsPageProps,
) {
  const {
    params: { locale },
  } = props;

  const [notificationsResponse, t] = await Promise.all([
    getUserNotificationService(locale),
    getTranslations(),
  ]);

  const resources: UserNotificationsPageResourcesProps = {
    notifications: t("notifications"),
    noNotificationsYet: t("noNotificationsYet"),
    loadMore: t("loadMore"),
    noMoreNotifications: t("noMoreNotifications"),
  };

  return (
    <UserNotificationsView
      resources={resources}
      locale={locale}
      data={notificationsResponse?.data ? notificationsResponse?.data : []}
    />
  );
}
