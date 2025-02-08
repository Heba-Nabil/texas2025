import NextLink from "@/components/global/NextLink";
import NextImage from "@/components/global/NextImage";
// Types
import { CategoryItemProps } from "@/types/api";

type MealItemImageProps = {
  data: CategoryItemProps;
  resources: {
    off: string;
  };
};

const imgClassName =
  "flex-center relative overflow-hidden @md:mx-auto @md:-mt-20 rtl:@md:-mt-[90px]";

export default function MealItemImage(props: MealItemImageProps) {
  const { data, resources } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.Price;

  return (
    <div className="flex-center relative overflow-hidden rounded-2xl bg-slate-100 @md:h-16 @md:overflow-visible @md:bg-transparent @lg:mb-2 md:rounded-none">
      {hasDiscount && data?.IsDiscountViewPercentage && (
        <div className="flex-center absolute inset-x-0 top-0 z-10 gap-1 rounded-t-lg bg-alt px-3 py-0.5 text-sm text-white @md:-top-20 @md:left-0 @md:right-auto @md:rounded-b-lg">
          <img src="/images/icons/texas-star.svg" alt="off" />
          <span className="uppercase">
            {data?.DiscountPercentage}% {resources["off"]}
          </span>
        </div>
      )}

      {data?.IsCustomizable ? (
        <NextLink
          href={`/menu/${data?.CategoryNameUnique}/${data?.NameUnique}`}
          className={imgClassName}
          aria-label="meal item"
          scroll={false}
        >
          <NextImage
            src={data?.IconURL}
            alt={data?.Name}
            width={200}
            height={200}
            className="smooth aspect-square size-40 object-contain @md:size-3/4"
          />
        </NextLink>
      ) : (
        <div className={imgClassName}>
          <NextImage
            src={data?.IconURL}
            alt={data?.Name}
            width={200}
            height={200}
            className="smooth aspect-square size-40 object-contain @md:size-3/4"
          />
        </div>
      )}
    </div>
  );
}
