"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { deleteServerCookie } from "@/server/actions/serverCookie";
import {
  CHECKOUT_RESPONSE,
  GUEST_DATA,
  LOGIN_REDIRECT_COOKIE,
  ORDER_DATE,
  routeHandlersKeys,
} from "@/utils/constants";
import { clientSideFetch } from "@/utils";
import cn from "@/utils/cn";
import ApplyPayIcon from "@/components/icons/ApplyPayIcon";
// Types
import { BillLineCookieProps, GenericResponse } from "@/types";
import {
  CartProps,
  CheckoutResponseProps,
  PayResponseProps,
} from "@/types/api";
import {
  CartAnalyticsProps,
  facebookAnalyticItems,
  googleAnalyticItems,
  tiktokAnalyticItems,
} from "@/types/analytics";

type CustomApplePayProps = {
  locale: string;
  totalPrice: number;
  CurrencyISOCode: string;
  ISOCode: string;
  resources: {
    total: string;
  };
  selectedPaymentMethodId: string;
  orderNumber: string;
  orderType: string;
  handleClose: () => void;
  data: CheckoutResponseProps;
  cartData: CartProps | BillLineCookieProps;
  analytics: {
    facebookMenuItems: facebookAnalyticItems;
    tiktokMenuItems: tiktokAnalyticItems;
    googleMenuItems: googleAnalyticItems;
    facebookContentID: string[];
  };
};

export default function CustomApplePay(props: CustomApplePayProps) {
  const {
    locale,
    totalPrice,
    CurrencyISOCode,
    ISOCode,
    resources,
    orderNumber,
    orderType,
    selectedPaymentMethodId,
    handleClose,
    data,
    cartData,
    analytics,
  } = props;

  const dispatch = useAppDispatch();

  const [loadButton, setLoadButton] = useState(false);

  // Load Apple Pay Button on Component Load
  useEffect(() => {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setLoadButton(true);
    }
  }, []);

  const handleApplePay = async (
    event: ApplePayJS.ApplePayPaymentAuthorizedEvent,
  ) => {
    console.log("Event from apple pay", event);

    const paymentToken = event.payment.token.paymentData;
    console.log("paymentToken from apple", paymentToken);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await clientSideFetch<GenericResponse<PayResponseProps>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.pay}`,
        {
          method: "POST",
          body: JSON.stringify({
            PaymentMethodID: selectedPaymentMethodId,
            OrderNumber: orderNumber,
            PaymentToken: paymentToken,
          }),
        },
      );
      console.log("Response from payment with apple", response);

      if (response?.hasError) {
        dispatch(toggleModal({ loadingModal: { isOpen: false } }));

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await deleteServerCookie([
        GUEST_DATA,
        CHECKOUT_RESPONSE,
        ORDER_DATE,
        LOGIN_REDIRECT_COOKIE,
      ]);

      // Facebook pixels
      !!window.fbq &&
        fbq("track", "Purchase", {
          content_type: "product",
          transaction_id: orderNumber,
          value: cartData?.Total,
          currency: CurrencyISOCode,
          total_quanity: cartData?.TotalQuantity,
          payment: data?.Payments?.find(
            (item) => item.ID === selectedPaymentMethodId,
          ),
          shipping: orderType,
          content_ids: analytics.facebookContentID,
          contents: analytics.facebookMenuItems,
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("Purchase", {
          content_type: "product_group",
          transaction_id: orderNumber,
          value: cartData?.Total,
          total_quanity: cartData?.TotalQuantity,
          currency: CurrencyISOCode,
          payment: data?.Payments?.find(
            (item) => item.ID === selectedPaymentMethodId,
          ),
          shipping: orderType,
          contents: analytics.tiktokMenuItems,
        });

      // Snapchat pixels
      !!window.snaptr &&
        snaptr("track", "PURCHASE", {
          item_ids: analytics.facebookContentID,
          item_category: (cartData as CartAnalyticsProps)?.Lines?.map(
            (item) => item?.MenuItem?.CategoryNameUnique,
          ),
          price: cartData?.Total,
          item_name: (cartData as CartAnalyticsProps)?.Lines?.map(
            (item) => item?.MenuItem?.Name,
          ),
          number_items: cartData?.TotalQuantity,
          currency: CurrencyISOCode,
          discount: (cartData as CartAnalyticsProps)?.Lines?.reduce(
            (total, item) => total + item?.MenuItem?.DiscountAmount,
            0,
          ),
          transaction_id: orderNumber,
          tax: cartData?.TaxAmount,
          shipping: orderType,
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "purchase", {
          currency: CurrencyISOCode,
          transaction_id: data?.OrderNumber,
          value: cartData?.Total,
          payment: data?.Payments?.find(
            (item) => item.ID === selectedPaymentMethodId,
          ),
          coupon: cartData?.PromoCode,
          tax: cartData?.TaxAmount,
          shipping: orderType,
          items: analytics.googleMenuItems,
        });

      handleClose();

      window.location.replace(`/track-order/${orderNumber}`);
    } catch (error) {
      console.log("Error at fetching payment", (error as Error).message);

      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  // Handle Click Apple Pay
  const handleApplePayClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      handleClose();

      const session = new ApplePaySession(3, {
        countryCode: ISOCode,
        currencyCode: CurrencyISOCode,
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        merchantCapabilities: ["supports3DS"],
        total: { label: resources["total"], amount: `${totalPrice}` },
      });

      session.onpaymentauthorized = async (event) => {
        console.log("Event from apple pay", event);

        try {
          const paymentToken = event.payment.token.paymentData;

          console.log("paymentToken", paymentToken);
        } catch (error) {
          console.error("Payment authorization failed:", error);
        }
      };

      session.begin();
    },
    [CurrencyISOCode, ISOCode, resources, totalPrice, handleClose],
  );

  return (
    <button
      type="button"
      className={cn(
        "w-full cursor-pointer items-center justify-center rounded-sm border bg-black px-4 text-center text-white focus-within:border-black hover:bg-opacity-70 focus:border-black",
        loadButton ? "flex" : "hidden",
      )}
      onClick={handleApplePayClick}
    >
      <ApplyPayIcon className="size-10" />
    </button>
  );
}
