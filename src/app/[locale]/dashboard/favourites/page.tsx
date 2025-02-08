// import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getUserFavService } from "@/server/services/userService";
import UserFavoritesView from "@/views/dashboard/favs/UserFavoritesView";
// Types
import { Metadata } from "next";
import { UserFavoritesPageResourcesProps } from "@/types/resources";

type UserFavoritesPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: UserFavoritesPageProps,
): Promise<Metadata> {
  return {
    title: "Favorites",
  };
}

export default async function UserFavoritesPage(props: UserFavoritesPageProps) {
  const {
    params: { locale },
  } = props;

  const [favResponse, t] = await Promise.all([
    getUserFavService(locale),
    getTranslations(),
  ]);

  // if (!favResponse?.data) return notFound();

  const resources: UserFavoritesPageResourcesProps = {
    favourites: t("favourites"),
    noFavourite: t("noFavourite"),
    startExploring: t("startExploring"),
    addToCart: t("addToCart"),
    customize: t("customize"),
    kcal: t("kcal"),
    addToFavSuccess: t("addToFavSuccess"),
    removeFromFavSuccess: t("removeFromFavSuccess"),
    off: t("off"),
  };

  return (
    <UserFavoritesView
      resources={resources}
      locale={locale}
      data={favResponse?.data}
    />
  );
}
