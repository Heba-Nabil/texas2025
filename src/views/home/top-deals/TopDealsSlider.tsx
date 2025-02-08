"use client";

import { useCallback, useEffect, useState } from "react";
import DefaultMealItem from "@/components/items/meal-item/DefaultMealItem";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { CategoryItemProps } from "@/types/api";
import { HomeTopDealsResourcesProps } from "@/types/resources";
import cn from "@/utils/cn";

type TopDealsSliderProps = {
  locale: string;
  data: CategoryItemProps[];
  resources: HomeTopDealsResourcesProps;
};

export default function TopDealsSlider(props: TopDealsSliderProps) {
  const { locale, data, resources } = props;

  const [api, setApi] = useState<CarouselApi>();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: CarouselApi) => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  useEffect(() => {
    if (!api) return;

    onInit(api);
    onSelect(api);
    api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [api, onInit, onSelect]);

  return (
    <Carousel
      className="mt-3 w-full"
      opts={{
        dragFree: true,
        direction: locale === "ar" ? "rtl" : "ltr",
      }}
      setApi={setApi}
    >
      <CarouselContent className="mb-4 ml-0 @container">
        {data?.map((item) => (
          <CarouselItem
            key={item.ID}
            className="shrink-0 basis-full pe-3 ps-0 @sm:basis-[70%] @md:basis-1/2 @md:pt-24 @xl:basis-[35%] @3xl:basis-[30%] @5xl:basis-1/4 @7xl:basis-1/5"
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
          </CarouselItem>
        ))}
      </CarouselContent>

      {scrollSnaps?.length > 0 && (
        <ul className="flex-center gap-2.5">
          {scrollSnaps?.map((_, index) => (
            <li key={index}>
              <button
                type="button"
                className={cn("smooth size-2.5 rounded-full", {
                  "bg-gray-300": selectedIndex !== index,
                  "bg-alt": selectedIndex === index,
                })}
                onClick={() => onDotButtonClick(index)}
                aria-label={`slide number ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      )}
    </Carousel>
  );
}
