import cn from "@/utils/cn";
import OrderDetailsProductItem from "./OrderDetailsProductItem";
// Types
import { OrderDealItemProps } from "@/types/api";

type OrderSummaryWithDealProps = {
  data: OrderDealItemProps;
  currency: string;
  className?: string;
  resources: {
    item: string;
    items: string;
    notAvailable: string;
  };
};

export default function OrderSummaryWithDeal(props: OrderSummaryWithDealProps) {
  const { data, currency, className, resources } = props;

  return (
    <div className={cn("bg-main/20 p-5", className)}>
      <div className="flex-between gap-2">
        <div className="flex-grow">
          {data?.Title && (
            <span className="text-xl font-bold uppercase leading-none text-alt">
              {data?.Title}
            </span>
          )}

          <h3 className="font-semibold capitalize leading-none">
            {data?.Name?.trim()}
          </h3>

          <span className="text-sm leading-tight text-gray-500">
            {data?.Description?.trim()}
          </span>
        </div>

        <div className="flex-center flex-col text-center">
          <img
            src="/images/icons/deals-with-star.svg"
            alt="deals with star"
            width={70}
            height={20}
            className="object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {data?.MenuItems && data?.MenuItems?.length > 0 && (
        <ul className="w-full">
          {data?.MenuItems?.map((item, index) => (
            <OrderDetailsProductItem
              key={index}
              data={item}
              currency={currency}
              className="my-0 border-b-0"
              resources={{
                item: resources["item"],
                items: resources["items"],
                notAvailable: resources["notAvailable"],
              }}
              showNotAvail={false}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
