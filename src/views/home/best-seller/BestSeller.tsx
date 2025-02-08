import NextLink from "@/components/global/NextLink";
import SectionHeading from "../SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { HomeBannerResponseProps } from "@/types/api";
import NextImage from "@/components/global/NextImage";

type BestSellerProps = {
  locale: string;
  data: HomeBannerResponseProps[];
  resources: {
    bestSeller: string;
    viewAll: string;
  };
};

export default function BestSeller(props: BestSellerProps) {
  const { locale, data, resources } = props;

  return (
    <section className="w-full">
      <div className="container">
        <SectionHeading
          title={resources["bestSeller"]}
          linkLabel={resources["viewAll"]}
          linkHref="/menu"
        />

        <Carousel
          className="mt-3 w-full"
          opts={{
            dragFree: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
        >
          <CarouselContent className="ml-0">
            {data?.map((item) => (
              <CarouselItem
                key={item.ID}
                className="shrink-0 basis-[35%] pe-3 ps-0 sm:basis-[30%] lg:basis-[22%] xl:basis-[19%]"
              >
                <BestSellerItem data={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

type BestSellerItemProps = {
  data: HomeBannerResponseProps;
};

function BestSellerItem({ data }: BestSellerItemProps) {
  const linkPath =
    (data?.MenuItem
      ? `/menu/${data?.MenuItem?.CategoryNameUnique}/${data?.MenuItem?.NameUnique}`
      : data?.DeepLinkPath?.trim()) || "/menu";

  const imgSrc =
    data?.WebLandscapeIconURL?.trim() ||
    data?.WebPortraitIconURL?.trim() ||
    data?.MobileIconURL?.trim();

  return (
    <NextLink
      href={linkPath}
      className="flex-center smooth w-full overflow-hidden rounded-2xl hover:scale-95"
    >
      {imgSrc && (
        <NextImage
          src={imgSrc}
          alt={data?.MenuItem?.Name || `bestseller ${data?.ID}`}
          width={375}
          height={546}
          className="w-full object-contain"
        />
      )}
    </NextLink>
  );
}
