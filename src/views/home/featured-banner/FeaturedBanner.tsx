"use client";

import { getClientSession } from "@/store/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { fixedKeywords } from "@/utils/constants";
import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// Types
import { HomeBannerResponseProps } from "@/types/api";

type FeaturedBannerProps = {
  locale: string;
  data: HomeBannerResponseProps[];
};

export default function FeaturedBanner(props: FeaturedBannerProps) {
  const { data, locale } = props;

  // const data = [
  //   {
  //     MenuItem: null,
  //     CountryID: "44bfb610-1e2f-45eb-82e3-f7a2dce608df",
  //     TypeID: 3,
  //     MobileIconURL: "/images/home/featured/1024 X 400.png",
  //     WebPortraitIconURL: "/images/home/featured/Artboard 1-1.png",
  //     WebLandscapeIconURL: "/images/home/featured/Artboard 1-1.png",
  //     DeepLinkPath: "/dashboard/rewards",
  //     ID: "c3740618-3375-40e5-bf1f-1030c64502da",
  //     DisplayOrder: 1,
  //   },
  // ];

  return (
    <section className="mb-8 w-full">
      <FeaturedBannerItem data={data[0]} />
      {/* <div className="container">
        <Carousel
          opts={{
            dragFree: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {data?.map((item) => (
              <CarouselItem
                key={item.ID}
                className="shrink-0 basis-[85%] pe-3 ps-0 sm:basis-3/4 md:basis-3/5 lg:basis-2/5 xl:basis-[30%]"
              >
                <FeaturedBannerItem data={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div> */}
    </section>
  );
}

type FeaturedBannerItemProps = {
  data: HomeBannerResponseProps;
};

function FeaturedBannerItem({ data }: FeaturedBannerItemProps) {
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
    <NextLink
      href={activeLink}
      className="flex-center w-full"
      // className="flex-center w-full overflow-hidden rounded-lg"
    >
      {imgSrc && (
        <NextImage
          src={imgSrc}
          alt={data?.MenuItem?.Name || `banner ${data?.ID}`}
          width={1900}
          height={400}
          // width={549}
          // height={224}
          className="w-full object-contain max-lg:hidden"
        />
      )}

      {data?.MobileIconURL?.trim() && (
        <NextImage
          src={data?.MobileIconURL?.trim()}
          alt={data?.MenuItem?.Name || `banner ${data?.ID}`}
          width={1024}
          height={400}
          className="w-full object-contain lg:hidden"
        />
      )}
    </NextLink>
  );
}
