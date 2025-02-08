"use client";

import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";
import { useData } from "@/providers/DataProvider";
import MealItemImage from "./MealItemImage";
import MealItemInfo from "./MealItemInfo";
// Types
import { CategoryItemProps } from "@/types/api";
import { DefaultMealItemResourcesProps } from "@/types/resources";

type DefaultMealItemProps = {
  data: CategoryItemProps;
  resources: DefaultMealItemResourcesProps;
  locale: string;
  showVariants?: boolean;
};

const DynamicAddToCartButton = dynamic(() => import("./AddToCartButton"));

const DefaultMealItem = (props: DefaultMealItemProps) => {
  const { data, resources, locale, showVariants = true } = props;

  const [cloneData, setCloneData] = useState(data);

  useEffect(() => {
    setCloneData(data);
  }, [data]);

  const {
    Data: {
      CurrencyName,
      EnableCalories,
      IsCartOrderTypeRequired,
      CurrencyISOCode,
    },
  } = useData();

  return (
    <div className="group w-full">
      <div className="smooth me-5 flex w-full shrink-0 rounded-2xl bg-white p-0.5 shadow-lg hover:shadow-xl @md:flex-col @md:rounded-3xl">
        <MealItemImage data={cloneData} resources={{ off: resources["off"] }} />

        <div className="mt-0 flex w-full flex-grow flex-col p-2 md:w-auto">
          <MealItemInfo
            data={{
              IsCustomizable: cloneData?.IsCustomizable,
              CategoryNameUnique: cloneData?.CategoryNameUnique,
              ID: cloneData?.ID,
              Name: cloneData?.Name,
              NameUnique: cloneData?.NameUnique,
              Calories: cloneData?.Calories,
              Description: cloneData?.Description,
              EnableCalories,
              IsFavorite: cloneData?.IsFavorite,
              Price: cloneData?.PriceAfterDiscount,
            }}
            resources={resources}
            defaultData={data}
            locale={locale}
            showVariants={showVariants}
            setCloneData={setCloneData}
            currency={CurrencyISOCode}
          />

          {cloneData?.Price > 0 && (
            <div className="flex-between mt-auto gap-3 py-1.5">
              <div className="flex flex-wrap items-center gap-x-1">
                <strong className="font-bold !leading-none @sm:text-lg rtl:@sm:text-base">
                  {cloneData?.PriceAfterDiscount?.toFixed(2)} {CurrencyName}
                </strong>
                {cloneData?.PriceAfterDiscount !== cloneData?.Price && (
                  <span className="text-xs text-gray-500 line-through">
                    {cloneData?.Price?.toFixed(2)} {CurrencyName}
                  </span>
                )}
              </div>

              <div className="shrink-0 @sm:w-[120px] ltr:w-28">
                <DynamicAddToCartButton
                  className="w-full rtl:text-sm"
                  resources={resources}
                  data={cloneData}
                  IsCartOrderTypeRequired={IsCartOrderTypeRequired}
                  locale={locale}
                  currency={CurrencyISOCode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(DefaultMealItem);
