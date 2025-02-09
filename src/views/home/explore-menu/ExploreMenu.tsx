"use client";

import { useData } from "@/providers/DataProvider";
import { displayInOrder } from "@/utils";
import SectionHeading from "../SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import NextLink from "@/components/global/NextLink";
import NextImage from "@/components/global/NextImage";

type ExploreMenuProps = {
  locale: string;
  resources: {
    exploreMenuCategories: string;
    viewAll: string;
  };
};

export default function ExploreMenu(props: ExploreMenuProps) {
  const { locale, resources } = props;

  const { Categories } = useData();

  const data = Categories ? displayInOrder(Categories) : [];

  if (data?.length === 0) return null;

  return (
    <section className="w-full">
      <div className="container">
        <SectionHeading
          title={resources["exploreMenuCategories"]}
          linkLabel={resources["viewAll"]}
          linkHref="/menu"
        />

        <Carousel
          className="w-full xl:mt-7"
          opts={{
            dragFree: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
        >
          <CarouselContent className="ml-0 @container">
            {data?.map((item, index) => (
              <CarouselItem
                key={item.ID}
                className="flex basis-[30%] pb-1 pe-3 ps-0 sm:basis-[23%] md:basis-[19%] lg:basis-[15%] xl:basis-[12%]"
              >
                <div className="smooth relative mt-14 w-full flex-col rounded-xl bg-[#F5F4F4] pt-5 text-center hover:text-alt @sm:pt-10 @md:pt-14 @lg:pt-12 @xl:pt-10 @2xl:pt-12 rtl:@md:pt-[70px] rtl:@lg:pt-14 rtl:@2xl:pt-[70px] rtl:@6xl:pt-16 rtl:@7xl:pt-[70px]">
                  <NextLink
                    href={`/menu/${item.NameUnique}`}
                    className="flex-center absolute -top-10 w-full xl:-top-14"
                  >
                    {item.IconURL && (
                      <NextImage
                        src={item.IconURL}
                        alt={`menu-${item.Name.toLowerCase()}`}
                        width={200}
                        height={200}
                        className="size-full shrink-0 object-contain"
                        priority={index < 4}
                      />
                    )}
                  </NextLink>

                  <NextLink
                    href={`/menu/${item.NameUnique}`}
                    className="flex-center px-2 py-4 text-sm font-semibold capitalize leading-tight @4xl:py-2 sm:text-base"
                  >
                    {item.Name.toLowerCase()}
                  </NextLink>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
