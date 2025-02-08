"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import cn from "@/utils/cn";
import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { HomeBannerResponseProps } from "@/types/api";

type HomeBannerProps = {
  locale: string;
  data: HomeBannerResponseProps[];
};

export default function HomeBanner(props: HomeBannerProps) {
  const { locale, data } = props;
  // const data = [
  //   {
  //     MenuItem: null,
  //     CountryID: "44bfb610-1e2f-45eb-82e3-f7a2dce608df",
  //     TypeID: 1,
  //     MobileIconURL: "/images/home/banner/mobile-1.png",
  //     WebPortraitIconURL: null,
  //     WebLandscapeIconURL: "/images/home/banner/1400x529.png",
  //     DeepLinkPath: null,
  //     ID: "e08ea7ee-e563-47b0-a21f-034774b5d9f5",
  //     DisplayOrder: 1,
  //   },
  //   {
  //     MenuItem: null,
  //     CountryID: "44bfb610-1e2f-45eb-82e3-f7a2dce608df",
  //     TypeID: 1,
  //     MobileIconURL: "/images/home/banner/mobile-2.png",
  //     WebPortraitIconURL: null,
  //     WebLandscapeIconURL: "/images/home/banner/1400x529 01.png",
  //     DeepLinkPath: null,
  //     ID: "e08ea7ee-e563-47b0-a21f",
  //     DisplayOrder: 2,
  //   },
  // ];

  const [api, setApi] = useState<CarouselApi>();

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

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
    <section className="mt-4 w-full">
      <div className="container">
        <Carousel
          opts={{
            loop: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          setApi={setApi}
          plugins={[plugin.current as any]}
          // onMouseEnter={plugin.current.stop}
          // onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {data?.map((item, index) => (
              <CarouselItem
                key={item.ID}
                className="shrink-0 basis-full pe-3 ps-0"
              >
                <HomeBannerItem data={item} makeItPrior={index < 2} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {scrollSnaps?.length > 0 && (
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

type HomeBannerItemProps = {
  data: HomeBannerResponseProps;
  makeItPrior: boolean;
};

function HomeBannerItem({ data, makeItPrior }: HomeBannerItemProps) {
  const linkPath =
    (data?.MenuItem
      ? `/menu/${data?.MenuItem?.CategoryNameUnique}/${data?.MenuItem?.NameUnique}`
      : data?.DeepLinkPath?.trim()) || "/menu";

  const desktopImage =
    data?.WebLandscapeIconURL?.trim() ||
    data?.WebPortraitIconURL?.trim() ||
    data?.MobileIconURL?.trim();

  return (
    <NextLink href={linkPath} className="flex-center w-full">
      {data?.MobileIconURL?.trim() && (
        <NextImage
          src={data?.MobileIconURL?.trim()}
          alt={data?.MenuItem?.Name || `banner ${data?.ID}`}
          width={1400}
          height={529}
          priority={makeItPrior}
          className="w-full object-contain lg:hidden"
        />
      )}

      {desktopImage && (
        <NextImage
          src={desktopImage}
          alt={data?.MenuItem?.Name || `banner ${data?.ID}`}
          width={1125}
          height={425}
          priority={makeItPrior}
          className="hidden w-full object-contain lg:block"
        />
      )}
    </NextLink>
  );
}
