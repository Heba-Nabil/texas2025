"use client";

import { useData } from "@/providers/DataProvider";
import { Button } from "@/components/ui/button";
import NextLink from "@/components/global/NextLink";
import SummarySubtotal from "@/views/cart/SummarySubTotal";
import OrderDetailsProductItem from "@/components/items/OrderDetailsProductItem";
import OrderSummaryWithDeal from "@/components/items/OrderSummaryWithDeal";
// Types
import { SingleOrderResponseProps } from "@/types/api";

type TrackOrderSummaryProps = {
  resources: {
    orderSummary: string;
    exploreMenu: string;
    total: string;
    tax: string;
    subTotal: string;
    discount: string;
    deliveryFees: string;
    item: string;
    items: string;
    notAvailable: string;
    promoCodeDiscount: string;
    dealsDiscount: string;
    allPricesAreVatInclusive: string;
  };
  data: SingleOrderResponseProps;
};

export default function TrackOrderSummary(props: TrackOrderSummaryProps) {
  const { data, resources } = props;

  const {
    Data: { CurrencyName, IsTaxInclusive },
  } = useData();

  return (
    <div className="top-32 z-10 lg:sticky">
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="flex-between gap-1 border-b-2 p-5">
          <h2 className="text-xl font-semibold capitalize">
            {resources["orderSummary"]}
          </h2>
        </div>

        <div className="max-h-[40vh] overflow-y-auto">
          {data?.Deals &&
            data?.Deals?.length > 0 &&
            data?.Deals?.map((item) => (
              <OrderSummaryWithDeal
                key={item.ID}
                data={item}
                currency={CurrencyName}
                resources={{
                  item: resources["item"],
                  items: resources["items"],
                  notAvailable: resources["notAvailable"],
                }}
              />
            ))}

          <div className="px-5">
            {data?.MenuItems?.map((item) => (
              <OrderDetailsProductItem
                key={item.ID}
                data={item}
                currency={CurrencyName}
                resources={{
                  item: resources["item"],
                  items: resources["items"],
                  notAvailable: resources["notAvailable"],
                }}
                showNotAvail={false}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-2">
          <SummarySubtotal
            data={{
              DeliveryChargeAmount: data?.DeliveryChargeAmount,
              DiscountAmount: data?.DiscountAmount,
              SubTotal: data?.SubTotal,
              TaxAmount: data?.TaxAmount,
              Total: data?.Total,
            }}
            currency={CurrencyName}
            resources={{
              deliveryFees: resources["deliveryFees"],
              discount: resources["discount"],
              subTotal: resources["subTotal"],
              tax: resources["tax"],
              promoCodeDiscount: resources["promoCodeDiscount"],
              dealsDiscount: resources["dealsDiscount"],
              total: resources["total"],
              allPricesAreVatInclusive: resources["allPricesAreVatInclusive"],
            }}
            hasPromoCode={!!data?.PromoCode}
            hasDeal={!!data?.DealHeaderID}
            IsTaxInclusive={IsTaxInclusive}
          />

          {/* <div className="flex-between w-full gap-3 p-2">
            <h3 className="text-xl font-semibold capitalize">
              {resources["total"]}
            </h3>

            <strong className="text-xl font-bold">
              {data?.Total} {CurrencyName}
            </strong>
          </div> */}

          <Button asChild>
            <NextLink href="/menu" className="mt-3 w-full">
              {resources["exploreMenu"]}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
