import cn from "@/utils/cn";
// Types
import { OrderMenuItemProps } from "@/types/api";

type OrderDetailsProductItemProps = {
  data: OrderMenuItemProps;
  currency: string;
  resources: {
    item: string;
    items: string;
    notAvailable: string;
  };
  showNotAvail: boolean;
  className?: string;
};

export default function OrderDetailsProductItem(
  props: OrderDetailsProductItemProps,
) {
  const { data, currency, resources, showNotAvail, className } = props;

  return (
    <div
      className={cn(
        "relative flex w-full justify-between gap-3 border-b-2 py-2",
        className,
      )}
    >
      <div className="flex-between gap-3">
        <img
          width={80}
          height={80}
          src={data?.IconURL}
          alt={data?.Name}
          className="max-w-full shrink-0 object-contain"
        />

        <div className="flex-grow">
          <h3 className="font-semibold capitalize">{data?.Name}</h3>

          <span className="text-sm font-normal text-accent">
            ({data?.Quantity}{" "}
            {data.Quantity > 1 ? resources["items"] : resources["item"]})
          </span>

          <p className="line-clamp-3 text-sm font-normal">
            {data?.CustomizationDescription
              ? data?.CustomizationDescription
              : data?.Description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col justify-between text-center">
        <strong className="text-lg font-semibold">
          {data?.SubTotal} {currency}
        </strong>

        {!data?.IsReorderable && showNotAvail && (
          <div className="rounded bg-alt/25 px-2 text-sm text-alt">
            {resources["notAvailable"]}
          </div>
        )}
      </div>
    </div>
  );
}
