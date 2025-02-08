"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { fixedKeywords } from "@/utils/constants";
import cn from "@/utils/cn";
import NextLink from "@/components/global/NextLink";
import SectionHeading from "../SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import NextImage from "@/components/global/NextImage";
// Types
import { HomeBannerResponseProps } from "@/types/api";

type WorldOfTexasProps = {
  locale: string;
  resources: {
    worldOfTexas: string;
  };
  data: HomeBannerResponseProps[];
};

export default function WorldOfTexas(props: WorldOfTexasProps) {
  const { locale, resources, data } = props;

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
    <section className="mb-8 w-full">
      <div className="container">
        <SectionHeading title={resources["worldOfTexas"]} />

        <Carousel
          className="mt-3 w-full"
          opts={{
            dragFree: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          setApi={setApi}
        >
          <CarouselContent className="ml-0 pb-3">
            {data?.map((item, index) => (
              <CarouselItem
                key={item.ID}
                className={cn("shrink-0 pe-2 ps-0", {
                  "basis-full sm:basis-1/2 lg:basis-2/5": index === 0,
                  "basis-auto sm:basis-1/4 lg:basis-1/5": index > 0,
                })}
              >
                <WorldOfTexasItem data={item} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {scrollSnaps?.length > 1 && (
            <ul className="flex-center mt-1 gap-2.5">
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
      </div>
    </section>
  );
}

type WorldOfTexasItemProps = {
  data: HomeBannerResponseProps;
  index: number;
};

function WorldOfTexasItem({ data, index }: WorldOfTexasItemProps) {
  const linkPath =
    (data?.MenuItem
      ? `/menu/${data?.MenuItem?.CategoryNameUnique}/${data?.MenuItem?.NameUnique}`
      : data?.DeepLinkPath?.trim()) || "/menu";

  const isLinkPathHasDashboard = linkPath?.includes("/dashboard/");

  const { isUser } = useAppSelector(getClientSession);
  const activeLink = isLinkPathHasDashboard
    ? isUser
      ? linkPath
      : `/login?${fixedKeywords.redirectTo}=${linkPath}`
    : linkPath;

  const imgSrc =
    data?.WebLandscapeIconURL?.trim() ||
    data?.WebPortraitIconURL?.trim() ||
    data?.MobileIconURL?.trim();

  return (
    <NextLink href={activeLink} className="flex-center size-full">
      {imgSrc && (
        <NextImage
          src={imgSrc}
          alt={data?.MenuItem?.Name || `banner ${data?.ID}`}
          width={index === 0 ? 538 : 263}
          height={260}
          className={cn(
            "h-52 sm:h-auto",
            index === 0
              ? "w-full rounded-[30px] object-cover sm:rounded-none sm:object-contain"
              : "w-auto object-contain sm:w-full",
          )}
        />
      )}
    </NextLink>
  );
}
