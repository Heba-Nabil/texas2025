import cn from "@/utils/cn";

type SummarySubTotalProps = {
  className?: string;
  listClassNames?: string;
  data: {
    SubTotal: number;
    DeliveryChargeAmount: number;
    TaxAmount: number;
    DiscountAmount: number;
    Total: number;
  };
  resources: {
    subTotal: string;
    deliveryFees: string;
    tax: string;
    discount: string;
    promoCodeDiscount: string;
    dealsDiscount: string;
    total: string;
    allPricesAreVatInclusive: string;
  };
  currency: string;
  hasPromoCode: boolean;
  hasDeal: boolean;
  IsTaxInclusive: boolean;
};

export default function SummarySubtotal(props: SummarySubTotalProps) {
  const {
    className,
    listClassNames,
    data,
    resources,
    currency,
    hasPromoCode,
    hasDeal,
    IsTaxInclusive,
  } = props;

  let discountMessage = "";

  if (hasPromoCode) {
    discountMessage = resources["promoCodeDiscount"];
  } else if (hasDeal) {
    discountMessage = resources["dealsDiscount"];
  } else {
    discountMessage = resources["discount"];
  }

  return (
    <div
      className={cn(
        "my-2 flex justify-between rounded-[7px] capitalize shadow-lg",
        className,
      )}
    >
      <div
        className={cn(
          "flex-between flex-center m-2 w-full flex-col divide-y divide-gray-200 p-2",
          listClassNames,
        )}
      >
        {data?.SubTotal > 0 && (
          <p className="flex w-full justify-between py-1.5 text-base">
            {resources["subTotal"]}
            <span className="text-gray-500">
              {data?.SubTotal?.toFixed(2)} {currency}
            </span>
          </p>
        )}

        {data?.DiscountAmount > 0 && (
          <p className="flex w-full justify-between py-1.5 text-base text-accent">
            {discountMessage}
            <span>
              {data?.DiscountAmount?.toFixed(2)} {currency}
            </span>
          </p>
        )}

        {data?.DeliveryChargeAmount > 0 && (
          <p className="flex w-full justify-between py-1.5 text-base">
            {resources["deliveryFees"]}
            <span className="text-gray-500">
              {data?.DeliveryChargeAmount?.toFixed(2)} {currency}
            </span>
          </p>
        )}

        <p className="flex w-full justify-between py-1.5 text-base">
          {resources["tax"]}
          <span className="text-gray-500">
            {data?.TaxAmount?.toFixed(2)} {currency}
          </span>
        </p>

        <div className="w-full">
          <div className="flex w-full justify-between pt-2 text-xl font-semibold capitalize leading-tight">
            {resources["total"]}
            <span className="font-bold">
              {data?.Total?.toFixed(2)} {currency}
            </span>
          </div>

          {IsTaxInclusive && (
            <p className="text-sm text-alt">
              {resources["allPricesAreVatInclusive"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
