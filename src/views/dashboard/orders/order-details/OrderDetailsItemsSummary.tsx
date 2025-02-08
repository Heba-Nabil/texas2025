"use client";

import { useData } from "@/providers/DataProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OrderDetailsProductItem from "@/components/items/OrderDetailsProductItem";
import SummarySubtotal from "@/views/cart/SummarySubTotal";
import OrderSummaryWithDeal from "@/components/items/OrderSummaryWithDeal";
// Types
import { SingleOrderResponseProps } from "@/types/api";

type OrderDetailsItemsSummary = {
  data: SingleOrderResponseProps;
  currency: string;
  IsTaxInclusive: boolean;
  quantity: number;
  resources: {
    item: string;
    items: string;
    total: string;
    deliveryFees: string;
    discount: string;
    subTotal: string;
    tax: string;
    allPricesAreVatInclusive: string;
    notAvailable: string;
    promoCodeDiscount: string;
    dealsDiscount: string;
    yourItems: string;
  };
};

export default function OrderDetailsItemsSummary(
  props: OrderDetailsItemsSummary,
) {
  const { data, currency, IsTaxInclusive, quantity, resources } = props;

  const {
    Data: { CurrencyName },
  } = useData();

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        defaultValue="order-details-items"
        className="w-full border-none"
      >
        <AccordionItem value="order-details-items">
          <AccordionTrigger className="pt-0">
            <span className="flex w-full items-center justify-between gap-3">
              <span className="text-xl font-semibold capitalize">
                {resources["yourItems"]} ({quantity})
              </span>

              <strong className="shrink-0 text-xl">
                {data?.Total} {currency}
              </strong>
            </span>
          </AccordionTrigger>

          <AccordionContent className="mx-1 my-3 rounded-lg p-4 pb-0 shadow-lg">
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
                  className="mb-2 rounded-lg"
                />
              ))}

            {data?.MenuItems?.map((item) => (
              <OrderDetailsProductItem
                key={item.ID}
                data={item}
                currency={currency}
                resources={{
                  item: resources["item"],
                  items: resources["items"],
                  notAvailable: resources["notAvailable"],
                }}
                showNotAvail
                className="border-b border-gray-100"
              />
            ))}

            <SummarySubtotal
              className="m-0 mb-0 shadow-none"
              listClassNames="m-0 mb-3"
              data={{
                DeliveryChargeAmount: data?.DeliveryChargeAmount,
                DiscountAmount: data?.DiscountAmount,
                SubTotal: data?.SubTotal,
                TaxAmount: data?.TaxAmount,
                Total: data?.Total,
              }}
              currency={currency}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <div className="flex-between w-full gap-3 p-2">
        <h3 className="text-xl font-semibold capitalize">
          {resources["total"]}
        </h3>

        <strong className="text-lg font-bold">
          {data?.Total} {currency}
        </strong>
      </div>

      {IsTaxInclusive && (
        <div className="mt-1">
          <p className="text-alt">{resources["allPricesAreVatInclusive"]}</p>
        </div>
      )} */}
    </div>
  );
}
