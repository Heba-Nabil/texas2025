import NextImage from "@/components/global/NextImage";
import AddToCartButton from "@/components/items/meal-item/AddToCartButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import { CategoryItemProps } from "@/types/api";
import { CartPageResourcesProps } from "@/types/resources";

type CompleteMealWrapperProps = {
  data: CategoryItemProps[];
  locale: string;
  resources: CartPageResourcesProps;
  currency: string;
};

export default function CompleteMealWrapper(props: CompleteMealWrapperProps) {
  const { data, locale, resources, currency } = props;

  return (
    <div className="p-4">
      <div className="flex-between gap-3">
        <h2 className="text-2xl font-bold capitalize">
          {resources["completeYourMeal"]}
        </h2>
      </div>

      <Carousel
        opts={{
          direction: locale === "ar" ? "rtl" : "ltr",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0 pb-10 pt-24">
          {data?.map((item) => (
            <CarouselItem key={item.ID} className="basis-52 pe-3 ps-0">
              <CompleteMealItem
                data={item}
                currency={currency}
                resources={resources}
                locale={locale}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

type CompleteMealItemProps = {
  currency: string;
  data: CategoryItemProps;
  resources: CartPageResourcesProps;
  locale: string;
};

function CompleteMealItem(props: CompleteMealItemProps) {
  const { locale, data, resources, currency } = props;

  return (
    <div className="smooth relative w-full rounded-md bg-slate-100 hover:shadow-xl md:rounded-lg">
      <div className="flex-center absolute inset-x-0 -top-24 w-full">
        <NextImage
          src={data.IconURL}
          alt={data.Name?.trim() || "complete meal item"}
          width={144}
          height={144}
          className="smooth size-36 object-contain"
        />
      </div>

      <div className="pb-6 pt-12 text-center">
        <h3
          className="line-clamp-1 w-full text-lg font-semibold capitalize"
          title={data?.Name?.trim()}
        >
          {data.Name?.trim()}
        </h3>

        <div className="leading-snug">
          <strong className="text-lg font-bold">
            {data?.PriceAfterDiscount?.toFixed(2)} {currency}
          </strong>
          {data?.PriceAfterDiscount !== data?.Price && (
            <span className="text-xs text-gray-500 line-through">
              {data?.Price?.toFixed(2)} {currency}
            </span>
          )}
        </div>
      </div>

      <div className="flex-center absolute inset-x-0 -bottom-5 w-full">
        <div className="w-[120px] shrink-0 pt-3">
          {data?.ID ? (
            <AddToCartButton
              data={data}
              IsCartOrderTypeRequired={false}
              locale={locale}
              currency={currency}
              resources={{
                addToCart: resources["addToCart"],
                addToFavSuccess: resources["addToFavSuccess"],
                customize: resources["customize"],
                kcal: resources["kcal"],
                off: resources["off"],
                removeFromFavSuccess: resources["removeFromFavSuccess"],
              }}
            />
          ) : (
            <div className="h-10 w-full rounded bg-slate-200"></div>
          )}
        </div>
      </div>
    </div>
  );
}
