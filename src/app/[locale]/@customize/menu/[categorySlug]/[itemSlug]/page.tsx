import { getTranslations } from "next-intl/server";
import { getMenuCategoryItem } from "@/server/services/menuService";
import NoDataHandler from "@/views/menu/customize/NoDataHandler";
import MenuItemView from "@/views/menu/customize/MenuItemView";
// Types
import type { Metadata } from "next";
import { MenuItemPageResourcesProps } from "@/types/resources";
import { MealItemProps } from "@/types/api";
import { GenericResponse } from "@/types";

type MenuItemPageProps = {
  params: {
    locale: string;
    itemSlug: string;
  };
  searchParams: {
    cid: string | undefined;
    did: string | undefined;
  };
};

export async function generateMetadata(
  props: MenuItemPageProps,
): Promise<Metadata> {
  return {
    title: "Customize",
  };
}

function addQuantityToObject(obj: MealItemProps) {
  return {
    ...obj,
    SelectedQuantity: 1,
    ModifierGroups: obj.ModifierGroups.map((mod) => ({
      ...mod,
      ModifierItems: mod.ModifierItems.map((modItem) => ({
        ...modItem,
        SelectedQuantity: modItem.DefaultQuantity,
        ModifierGroups: modItem.ModifierGroups.map((childMod) => ({
          ...childMod,
          ModifierItems: childMod.ModifierItems.map((childModItem) => ({
            ...childModItem,
            SelectedQuantity: childModItem.DefaultQuantity,
          })),
        })),
      })),
    })),
  };
}

export default async function MenuItemPage(props: MenuItemPageProps) {
  const {
    params: { locale, itemSlug },
    searchParams: { cid, did },
  } = props;

  const t = await getTranslations();

  let menuItemObj: GenericResponse<MealItemProps>;

  try {
    menuItemObj = await getMenuCategoryItem(locale, itemSlug);
  } catch (error) {}

  // if (!menuItemObj?.data) {
  //   console.log("Error from Menu Item Customization Page", menuItemObj?.errors);

  //   return redirect("/menu");
  // }

  const resources: MenuItemPageResourcesProps = {
    reset: t("reset"),
    kcal: t("kcal"),
    select: t("select"),
    customize: t("customize"),
    min: t("min"),
    max: t("max"),
    add: t("add"),
    anyUpdatesWillReflect: t("anyUpdatesWillReflect"),
    addToCart: t("addToCart"),
    update: t("update"),
    error: t("error"),
    off: t("off"),
  };

  const menuItemDataWithQuantity = menuItemObj?.data
    ? addQuantityToObject(menuItemObj?.data)
    : undefined;

  if (!menuItemDataWithQuantity) return <NoDataHandler />;

  return (
    <MenuItemView
      data={menuItemDataWithQuantity}
      locale={locale}
      resources={resources}
      cid={cid}
      did={did}
    />
  );
}
