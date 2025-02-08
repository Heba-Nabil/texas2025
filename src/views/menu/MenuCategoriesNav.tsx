"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import { displayInOrder } from "@/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import NextActiveLink from "@/components/global/NextActiveLink";
import NextImage from "@/components/global/NextImage";
// Types
import { type CarouselApi } from "@/components/ui/carousel";

type MenuCategoriesNavProps = {
  locale: string;
};

export default function MenuCategoriesNav({ locale }: MenuCategoriesNavProps) {
  const { Categories } = useData();

  const data = displayInOrder(Categories);

  const pathname = usePathname();

  const [api, setApi] = useState<CarouselApi>();

  const activeIndex = useMemo(() => {
    return data?.findIndex(
      (item) =>
        `/menu/${item.NameUnique?.toLowerCase()}` === pathname?.toLowerCase(),
    );
  }, [data, pathname]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(activeIndex !== -1 ? activeIndex : 0);
  }, [api, activeIndex]);

  return (
    <nav className="z-20 bg-white py-1 lg:sticky lg:top-[104px]">
      <div className="container">
        <div className="flex-between gap-2">
          <Carousel
            className="my-3 w-full md:my-0"
            // className="my-3 w-[calc(100%-110px)] md:my-0"
            setApi={setApi}
            opts={{
              direction: locale === "ar" ? "rtl" : "ltr",
              dragFree: true,
            }}
          >
            <CarouselContent className="ml-0 mr-0">
              {data?.map((item) => (
                <CarouselItem
                  key={item.ID}
                  className="me-2 block shrink-0 basis-auto ps-0"
                >
                  <NextActiveLink
                    href={`/menu/${item.NameUnique}`}
                    className="smooth flex w-full min-w-[100px] items-center gap-1 rounded-3xl border border-main p-0.5 pe-2"
                    activeClassName="bg-main"
                  >
                    {item.IconURL && (
                      <span className="flex-center shrink-0 overflow-hidden rounded-full bg-white">
                        <NextImage
                          src={item.IconURL}
                          alt={item.Name}
                          width={28}
                          height={28}
                          className="size-7 object-contain"
                        />
                      </span>
                    )}

                    <span className="flex-grow text-sm capitalize">
                      {item.Name}
                    </span>
                  </NextActiveLink>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* <div className="shrink-0 border-s py-1 ps-2">
            <NextActiveLink
              href="/menu/favourites"
              className="smooth flex w-full items-center gap-1 rounded-3xl p-0.5 pe-2"
              activeClassName="bg-main"
            >
              <span className="flex-center shrink-0 overflow-hidden rounded-full bg-white">
                <img
                  src="/images/icons/favourits.svg"
                  alt="Favourite"
                  width={30}
                  height={30}
                  className="aspect-square object-contain"
                  loading="lazy"
                />
              </span>

              <span className="flex-grow text-sm capitalize">
                {resources["favourites"]}
              </span>
            </NextActiveLink>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
