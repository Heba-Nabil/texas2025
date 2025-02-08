"use client";

import { mapCartToBill } from "@/utils/menuCustomizeActions";
import {
  BILL_LINE,
  CHECKOUT_RESPONSE,
  ORDER_DATE,
  PAYMENT_ID,
  routeHandlersKeys,
} from "@/utils/constants";
import {
  deleteServerCookie,
  setServerCookie,
} from "@/server/actions/serverCookie";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { getClientSession } from "@/store/features/auth/authSlice";
import { clientSideFetch } from "@/utils";
import NextLink from "@/components/global/NextLink";
import SummarySubtotal from "./SummarySubTotal";
import SummaryButton from "@/components/global/SummaryButton";
import PromoCode from "./PromoCode";
// Types
import { CartProps } from "@/types/api";
import { CartPageResourcesProps } from "@/types/resources";
import { GenericResponse } from "@/types";

type CartItemWrapperProps = {
  data: CartProps;
  resources: CartPageResourcesProps;
  currency: string;
  MinOrderValue: number;
  locale: string;
};

export default function CartSummary(props: CartItemWrapperProps) {
  const { data, resources, currency, MinOrderValue, locale } = props;

  const isExceedMinOrderValue = data?.SubTotal >= MinOrderValue;

  const promoCode = data?.PromoCode;

  const {
    Data: { IsTaxInclusive },
  } = useData();

  const { isUser } = useAppSelector(getClientSession);
  const {
    selectedOrderTypeId,
    orderLocation: { storeId },
  } = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  const handleGoToCheckout = async () => {
    if (!data?.PromoCode && !data?.DealHeaderID) {
      if (data?.SubTotal < MinOrderValue) return;
    }

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    if (isUser) {
      try {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        const response = await clientSideFetch<
          Promise<
            GenericResponse<{
              IsCheckoutValid: boolean;
            }>
          >
        >(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.preCheckout}`,
          {
            method: "POST",
            body: JSON.stringify({
              StoreID: storeId,
              OrderTypeID: selectedOrderTypeId,
            }),
          },
        );

        if (response?.hasError) {
          dispatch(toggleModal({ loadingModal: { isOpen: false } }));

          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }
      } catch (error) {
        console.log("Error at fetching payment", (error as Error).message);

        return dispatch(toggleModal({ loadingModal: { isOpen: false } }));
      }
    }

    const billLine = JSON.stringify(mapCartToBill(data));

    // Save bill in cookie
    await setServerCookie([
      {
        name: BILL_LINE,
        value: billLine,
        expiration: new Date(data?.ExpiredDate),
      },
    ]);

    await deleteServerCookie([CHECKOUT_RESPONSE, ORDER_DATE, PAYMENT_ID]);

    location.href = "/checkout";
  };

  return (
    <div className="z-10 lg:sticky lg:top-32">
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="flex-between gap-1 border-b-2 p-5">
          <h2 className="text-xl font-semibold capitalize">
            {resources["orderSummary"]}
          </h2>
        </div>

        {/* <div className="bg-accent px-5 py-2 text-sm text-white">
          <span className="text-base uppercase">reorder!</span> Please
          double-check the prices and descriptions, as there may be some
          changes.
        </div> */}

        <div className="px-5">
          {/* <div className="mt-2 flex w-full items-center gap-1">
            <img
              src="/images/icons/points-star.svg"
              alt="points-star"
              width={20}
              height={20}
              className="size-5 shrink-0"
            />

            <p className="text-gray-500">
              {resources["youWillEarn"]} <span className="text-alt">200</span>{" "}
              {resources["points"]}
            </p>
          </div> */}

          <div className="smooth mb-3 mt-2 flex justify-between rounded-[7px] shadow-lg hover:bg-gray-100 hover:shadow">
            <div className="m-2 w-full p-2">
              <NextLink
                href="/menu"
                className="flex-between flex-center w-full"
                aria-label="meal item"
              >
                <p className="flex flex-col">
                  <span className="font-semibold capitalize text-dark hover:text-main">
                    {resources["addMoreFood"]}
                  </span>
                  <span className="text-base text-gray-500">
                    {resources["addMoreFoodDesc"]}
                  </span>
                </p>
                <img
                  src="/images/icons/plus.svg"
                  alt="addFood"
                  width={35}
                  height={35}
                  className="object-contain"
                />
              </NextLink>
            </div>
          </div>
        </div>

        <div className="my-3 px-5">
          <PromoCode
            resources={{
              apply: resources["apply"],
              promoCodeRegexErrorMessage:
                resources["promoCodeRegexErrorMessage"],
              character: resources["character"],
              enterPromoCode: resources["enterPromoCode"],
              maxLength: resources["maxLength"],
              promocode: resources["promocode"],
              promocodeRequired: resources["promocodeRequired"],
              remove: resources["remove"],
              applied: resources["applied"],
              minLength: resources["minLength"],
            }}
            locale={locale}
            promoCode={promoCode}
          />
        </div>

        <>
          <div className="px-5">
            <SummarySubtotal
              data={data}
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
              currency={currency}
              hasPromoCode={!!promoCode}
              hasDeal={!!data?.DealHeaderID}
              IsTaxInclusive={IsTaxInclusive}
            />
          </div>

          <SummaryButton
            quantity={data?.TotalQuantity}
            price={data?.Total}
            currency={currency}
            resources={{
              item: resources["item"],
              items: resources["items"],
            }}
            label={resources["orderNow"]}
            onClick={handleGoToCheckout}
            className="max-lg:bottom-[70px]"
            aria-disabled={
              !data?.PromoCode && !data?.DealHeaderID && !isExceedMinOrderValue
            }
            promoCode={data?.PromoCode}
            hasDeal={!!data?.DealHeaderID}
            isExceedMinOrderValue={isExceedMinOrderValue}
            isExceedMinOrderValueMessage={`${resources["orderMinValueMessage"]} ${MinOrderValue} ${currency}`}
            locale={locale}
          />
        </>
      </div>
    </div>
  );
}
