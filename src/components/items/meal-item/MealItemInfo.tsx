import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import NextLink from "@/components/global/NextLink";
// Types
import { DefaultMealItemResourcesProps } from "@/types/resources";
import { CategoryItemProps } from "@/types/api";
import {
  facebookAnalyticContent,
  googleAnalyticContents,
  snapchatAnalyticContents,
  tiktokAnalyticContent,
} from "@/types/analytics";
import { displayInOrder } from "@/utils";

type MealItemInfoProps = {
  resources: DefaultMealItemResourcesProps;
  data: {
    IsCustomizable: boolean;
    CategoryNameUnique: string;
    ID: string;
    Name: string;
    NameUnique: string;
    Calories: string | null;
    Description: string;
    EnableCalories: boolean;
    IsFavorite: boolean;
    Price: number;
  };
  defaultData: CategoryItemProps;
  locale: string;
  showVariants?: boolean;
  setCloneData: React.Dispatch<React.SetStateAction<CategoryItemProps>>;
  currency: string;
};

const DynamicFavButton = dynamic(() => import("@/components/items/FavButton"), {
  ssr: false,
});

export default function MealItemInfo(props: MealItemInfoProps) {
  const {
    data,
    resources,
    defaultData,
    locale,
    showVariants,
    setCloneData,
    currency,
  } = props;

  const { isUser } = useAppSelector(getClientSession);

  const [isFav, setIsFav] = useState(data?.IsFavorite);

  useEffect(() => {
    setIsFav(data?.IsFavorite);
  }, [data]);

  const facebookAnalytic: facebookAnalyticContent = {
    content_type: "product",
    content_ids: [data?.NameUnique],
    contents: [
      {
        index: 1,
        id: data?.NameUnique,
        item_name: data?.Name,
        item_category: data?.CategoryNameUnique,
        price: data?.Price,
        currency: currency,
      },
    ],
  };
  // Tiktok Analytics
  const tiktokAnalytic: tiktokAnalyticContent = {
    contents: [
      {
        index: 1,
        content_id: data?.NameUnique,
        content_name: data?.Name,
        content_category: data?.CategoryNameUnique,
        currency: currency,
        value: data?.Price,
        content_type: "product",
        description: "Product",
      },
    ],
  };
  // Google Analytics
  const googleAnalytic: googleAnalyticContents = {
    currency: currency,
    value: data?.Price,
    items: [
      {
        index: 1,
        item_id: data?.NameUnique,
        item_name: data?.Name,
        item_category: data?.CategoryNameUnique,
        price: data?.Price,
      },
    ],
  };

  // Snapchat Analytics
  const snapchatAnalytic: snapchatAnalyticContents = {
    item_ids: [data?.NameUnique],
    item_name: [data?.NameUnique],
    price: data?.Price,
    currency: currency,
    item_categoty: data?.CategoryNameUnique,
    number_items: 1,
  };

  return (
    <div className="flex flex-col">
      <div className="flex-between relative mb-1">
        {data?.IsCustomizable ? (
          <NextLink
            href={`/menu/${data?.CategoryNameUnique}/${data?.NameUnique}`}
            scroll={false}
          >
            <h3
              className="line-clamp-1 text-lg font-semibold capitalize group-hover:text-alt @lg:text-lg"
              title={data?.Name}
            >
              {data?.Name}
            </h3>
          </NextLink>
        ) : (
          <h3
            className="line-clamp-1 text-lg font-semibold capitalize group-hover:text-alt @lg:text-lg"
            title={data?.Name}
          >
            {data?.Name}
          </h3>
        )}

        {isUser && (
          <DynamicFavButton
            setIsFav={setIsFav}
            id={data?.ID}
            locale={locale}
            resources={{
              addToFavSuccess: resources["addToFavSuccess"],
              removeFromFavSuccess: resources["removeFromFavSuccess"],
            }}
            isFav={isFav}
            facebookAnalytic={facebookAnalytic}
            tiktokAnalytic={tiktokAnalytic}
            googleAnalytic={googleAnalytic}
            snapchatAnalytic={snapchatAnalytic}
          />
        )}
      </div>

      {data?.EnableCalories && (
        <span className="block leading-none text-alt @md:h-4">
          {data?.Calories} {resources["kcal"]}
        </span>
      )}

      <p className="line-clamp-2 text-sm leading-tight text-gray-500 @md:h-9">
        {data?.Description}
      </p>

      {showVariants && (
        <div className="my-2 flex gap-1">
          <button
            type="button"
            className={cn(
              "flex-center min-w-14 rounded-sm border px-1 text-center text-sm text-gray-600",
              {
                "border-main text-main": data?.ID === defaultData?.ID,
              },
            )}
            onClick={() =>
              setCloneData(() => ({
                ...defaultData,
                Variants: defaultData.Variants,
              }))
            }
          >
            {defaultData?.VariantTypeName}
          </button>

          {displayInOrder(defaultData?.Variants)?.map((item) => (
            <button
              key={item.ID}
              type="button"
              className={cn(
                "flex-center min-w-14 rounded-sm border px-1 text-center text-sm text-gray-600",
                {
                  "border-main text-main": data?.ID === item?.ID,
                },
              )}
              onClick={() =>
                setCloneData((prev) => ({
                  ...item,
                  Variants: prev.Variants,
                }))
              }
            >
              {item?.VariantTypeName}
            </button>
          ))}
        </div>
      )}

      <div className="mt-1 h-6">
        {data?.IsCustomizable && (
          <NextLink
            href={`/menu/${data?.CategoryNameUnique}/${data?.NameUnique}`}
            className="mt-auto flex items-center gap-2 font-medium capitalize leading-none text-alt"
            scroll={false}
          >
            {resources["customize"]}
            <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
          </NextLink>
        )}
      </div>
    </div>
  );
}
