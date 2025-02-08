"use client";

import { useCallback, useEffect } from "react";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { displayInOrder } from "@/utils";
import DefaultMealItem from "@/components/items/meal-item/DefaultMealItem";
// Types
import { MenuSinlgeCategoryProps } from "@/types/api";
import { MenuCategoryPageResourcesProps } from "@/types/resources";

type CategoryViewProps = {
  isAccessTokenExpired: boolean;
  data?: MenuSinlgeCategoryProps | null;
  resources: MenuCategoryPageResourcesProps;
  locale: string;
};

export default function CategoryView(props: CategoryViewProps) {
  const { isAccessTokenExpired, data, resources, locale } = props;

  const clearSession = useCallback(async () => {
    await clearServerCookie();

    window.location.replace(`/${locale}`);
  }, [locale]);

  useEffect(() => {
    if (isAccessTokenExpired) {
      clearSession();
    }
  });

  if (!data) return null;

  const menuItems = displayInOrder(data?.MenuItems);

  return (
    <div className="w-full">
      <div className="flex-between gap-3">
        <h2 className="text-xl font-bold capitalize md:text-3xl">
          {data?.Name}{" "}
          <span className="text-sm">
            ({menuItems?.length}{" "}
            {menuItems?.length > 1 ? resources["items"] : resources["item"]})
          </span>
        </h2>
      </div>

      <div className="mt-5 @container/main min-[476px]:mt-28 rtl:min-[416px]:mt-32">
        <div className="grid grid-cols-12 gap-x-3 gap-y-4 @container @md/main:gap-y-28 rtl:@md/main:gap-y-32">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="col-span-full @md:col-span-6 @2xl:col-span-4"
            >
              <DefaultMealItem
                data={item}
                resources={{
                  customize: resources["customize"],
                  addToCart: resources["addToCart"],
                  kcal: resources["kcal"],
                  addToFavSuccess: resources["addToFavSuccess"],
                  removeFromFavSuccess: resources["removeFromFavSuccess"],
                  off: resources["off"],
                }}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
