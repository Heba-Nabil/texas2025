// import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getMenuCategory } from "@/server/services/menuService";
import { apiErrorCodes } from "@/utils/constants";
import CategoryView from "@/views/menu/category/CategoryView";
// Types
import type { Metadata } from "next";
import { MenuCategoryPageResourcesProps } from "@/types/resources";

type MenuCategoryPageProps = {
  params: {
    locale: string;
    categorySlug: string;
  };
};

export async function generateMetadata(
  props: MenuCategoryPageProps,
): Promise<Metadata> {
  return {
    title: props.params.categorySlug,
  };
}

export default async function MenuCategoryPage(props: MenuCategoryPageProps) {
  const {
    params: { locale, categorySlug },
  } = props;

  const [t, menuCategoryObj] = await Promise.all([
    getTranslations(),
    getMenuCategory(locale, categorySlug),
  ]);

  const isAccessTokenExpired = menuCategoryObj?.errors?.find(
    (item) => item.Code === apiErrorCodes.tokenExpired,
  );

  // if (!menuCategoryObj?.data) {
  //   console.log("Error From menu => Category page", menuCategoryObj?.errors);
  //   return notFound();
  // }

  const resources: MenuCategoryPageResourcesProps = {
    item: t("item"),
    items: t("items"),
    customize: t("customize"),
    addToCart: t("addToCart"),
    kcal: t("kcal"),
    addToFavSuccess: t("addToFavSuccess"),
    removeFromFavSuccess: t("removeFromFavSuccess"),
    off: t("off"),
  };

  return (
    <CategoryView
      isAccessTokenExpired={!!isAccessTokenExpired}
      data={menuCategoryObj?.data}
      resources={resources}
      locale={locale}
    />
  );
}
