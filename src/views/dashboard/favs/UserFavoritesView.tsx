"use client";

import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import DefaultMealItem from "@/components/items/meal-item/DefaultMealItem";
import EmptyFav from "@/components/emptyStates/EmptyFav";
// Types
import { UserFavoritesPageResourcesProps } from "@/types/resources";
import { CategoryItemProps } from "@/types/api";
import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";

type UserFavoritesViewProps = {
  resources: UserFavoritesPageResourcesProps;
  data?: CategoryItemProps[] | null;
  locale: string;
};

export default function UserFavoritesView(props: UserFavoritesViewProps) {
  const { resources, data, locale } = props;

  return (
    <DashBoardPagesWrapper label={resources["favourites"]}>
      <div className="flex-grow overflow-y-auto px-5 @container/main">
        {data && data?.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-3 @container @sm:mt-20 @lg/main:gap-y-28 min-[489px]:gap-y-28 rtl:@sm:mt-24 rtl:@lg/main:gap-y-32 rtl:min-[489px]:gap-y-32">
              {data?.map((item) => (
                <div
                  key={item.ID}
                  className="col-span-full @lg:col-span-6 @2xl:col-span-4"
                >
                  <DefaultMealItem
                    data={item}
                    locale={locale}
                    resources={{
                      addToCart: resources["addToCart"],
                      customize: resources["customize"],
                      kcal: resources["kcal"],
                      addToFavSuccess: resources["addToFavSuccess"],
                      removeFromFavSuccess: resources["removeFromFavSuccess"],
                      off: resources["off"],
                    }}
                    showVariants={false}
                  />
                </div>
              ))}
            </div>

            <div className="flex-center mt-5">
              <Button asChild>
                <NextLink href="/menu">{resources["startExploring"]}</NextLink>
              </Button>
            </div>
          </>
        ) : (
          <EmptyFav
            resources={{
              noFavourite: resources["noFavourite"],
              startExploring: resources["startExploring"],
            }}
          />
        )}
      </div>
    </DashBoardPagesWrapper>
  );
}
