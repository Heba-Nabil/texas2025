// import dynamic from "next/dynamic";
import { useState } from "react";
import cn from "@/utils/cn";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import {
  apiErrorCodes,
  BILL_LINE,
  cartInitialState,
  CHECKOUT_RESPONSE,
  cookiesExpireTime,
  GUEST_DATA,
  LOGIN_REDIRECT_COOKIE,
  ORDER_DATE,
  PAYMENT_ID,
  routeHandlersKeys,
} from "@/utils/constants";
import {
  deleteServerCookie,
  setServerCookie,
} from "@/server/actions/serverCookie";
import { useData } from "@/providers/DataProvider";
import { loadCart } from "@/store/features/cart/cartSlice";
import { clientSideFetch, findById } from "@/utils";
import { clearServerCookie } from "@/server/actions/clearCookies";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RadioLabel from "@/components/ui/RadioLabel";
// Types
import {
  CartProps,
  CheckoutResponseProps,
  PayResponseProps,
} from "@/types/api";
import { BillLineCookieProps, GenericResponse } from "@/types";
import { WalletPaymentsEnum } from "@/types/enums";
import {
  CartAnalyticsProps,
  facebookAnalyticItems,
  googleAnalyticItems,
  tiktokAnalyticItems,
} from "@/types/analytics";

// const DynamicCustomGooglePay = dynamic(
//   () => import("../wallets/CustomGooglePay"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="animate-pulse" role="presentation">
//         <div className="h-10 w-full rounded bg-slate-200" />
//       </div>
//     ),
//   },
// );

// const DynamicCustomApplePay = dynamic(
//   () => import("../wallets/CustomApplePay"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="animate-pulse" role="presentation">
//         <div className="h-10 w-full rounded bg-slate-200" />
//       </div>
//     ),
//   },
// );

type PaymentModalProps = {
  open: boolean;
  data: CheckoutResponseProps;
  selectedPaymentMethodId: string;
  cartData: CartProps | BillLineCookieProps;
  locale: string;
  resources: {
    paymentMethod: string;
    placeOrderNow: string;
    cancel: string;
    paymentRequired: string;
    orPayWith: string;
    total: string;
  };
  analytics: {
    facebookMenuItems: facebookAnalyticItems;
    tiktokMenuItems: tiktokAnalyticItems;
    googleMenuItems: googleAnalyticItems;
    facebookContentID: string[];
  };
  orderTypeID: string | undefined;
  totalPrice: number;
  handleClose: () => void;
  setSelectedPaymentMethodId: React.Dispatch<React.SetStateAction<string>>;
  setOpenLoadingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PaymentModal(props: PaymentModalProps) {
  const {
    open,
    data,
    cartData,
    selectedPaymentMethodId,
    locale,
    resources,
    analytics,
    orderTypeID,
    totalPrice,
    handleClose,
    setSelectedPaymentMethodId,
    setOpenLoadingModal,
  } = props;

  const [paymentError, setPaymentError] = useState("");

  // const walletPayments = data?.Payments?.filter((item) =>
  //   Object.values(WalletPaymentsEnum)?.includes(item.TypeID),
  // );
  // const walletPaymentHasGooglePay = walletPayments?.find(
  //     (item) => item.TypeID === WalletPaymentsEnum?.GooglePay,
  //   ),
  //   walletPaymentHasApplePay = walletPayments?.find(
  //     (item) => item.TypeID === WalletPaymentsEnum?.ApplyPay,
  //   );

  const dispatch = useAppDispatch();

  const {
    OrderTypes,
    Data: { CurrencyName, CurrencyISOCode },
    ISOCode,
  } = useData();

  const selectedOrderType = findById(OrderTypes, orderTypeID!);

  const handlePayment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (!selectedPaymentMethodId)
      return setPaymentError(resources["paymentRequired"]);

    setOpenLoadingModal(true);

    try {
      const response = await clientSideFetch<GenericResponse<PayResponseProps>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.pay}`,
        {
          method: "POST",
          body: JSON.stringify({
            PaymentMethodID: selectedPaymentMethodId,
            OrderNumber: data?.OrderNumber,
          }),
        },
      );

      if (response?.hasError) {
        setOpenLoadingModal(false);

        const isCartRemoved = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isCartRemoved) {
          await deleteServerCookie([BILL_LINE, CHECKOUT_RESPONSE, ORDER_DATE]);

          location.replace("/cart");
        }

        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        const toaster = (await import("@/components/global/Toaster")).toaster;

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      // Cash Flow
      if (response?.responseCode === 200) {
        await deleteServerCookie([
          GUEST_DATA,
          CHECKOUT_RESPONSE,
          ORDER_DATE,
          PAYMENT_ID,
        ]);

        handleClose();

        // Facebook pixels
        !!window.fbq &&
          fbq("track", "Purchase", {
            content_type: "product",
            transaction_id: data?.OrderNumber,
            value: cartData?.Total,
            currency: CurrencyISOCode,
            total_quanity: cartData?.TotalQuantity,
            payment: data?.Payments?.find(
              (item) => item.ID === selectedPaymentMethodId,
            )?.Name,
            shipping: selectedOrderType?.Name,
            content_ids: analytics?.facebookContentID,
            contents: analytics?.facebookMenuItems,
          });

        // Tiktok pixels
        !!window.ttq &&
          ttq.track("Purchase", {
            content_type: "product_group",
            transaction_id: data?.OrderNumber,
            value: cartData?.Total,
            total_quanity: cartData?.TotalQuantity,
            currency: CurrencyISOCode,
            payment: data?.Payments?.find(
              (item) => item.ID === selectedPaymentMethodId,
            )?.Name,
            shipping: selectedOrderType?.Name,
            contents: analytics?.tiktokMenuItems,
          });

        // Snapchat pixels
        !!window.snaptr &&
          snaptr("track", "PURCHASE", {
            item_ids: analytics?.facebookContentID,
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
            transaction_id: data?.OrderNumber,
            tax: cartData?.TaxAmount,
            payment: data?.Payments?.find(
              (item) => item.ID === selectedPaymentMethodId,
            )?.Name,
            shipping: selectedOrderType?.Name,
          });

        // Google events
        !!window.gtag &&
          window.gtag("event", "purchase", {
            currency: CurrencyISOCode,
            transaction_id: data?.OrderNumber,
            value: cartData?.Total,
            payment: data?.Payments?.find(
              (item) => item.ID === selectedPaymentMethodId,
            )?.Name,
            shipping: selectedOrderType?.Name,
            coupon: cartData?.PromoCode,
            tax: cartData?.TaxAmount,
            items: analytics?.googleMenuItems,
          });

        dispatch(loadCart(cartInitialState));

        window.location.replace(`/track-order/${data?.OrderNumber}`);
      }

      // Online Payment Flow
      if (response?.responseCode === 206) {
        await deleteServerCookie([ORDER_DATE]);
        // await deleteServerCookie([ORDER_DATE, CHECKOUT_RESPONSE]);

        // Save payment id in cookie
        if (response?.data?.PaymentID) {
          await setServerCookie([
            {
              name: PAYMENT_ID,
              value: response?.data?.PaymentID,
            },
          ]);
        }

        handleClose();

        response?.data?.URL && window.location.replace(response?.data?.URL);
      }
    } catch (error) {
      console.log("Error at fetching payment", (error as Error).message);

      setOpenLoadingModal(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={resources["paymentMethod"]} />

        <DialogContentWrapper>
          <DialogDescription className="sr-only">
            {resources["paymentMethod"]}
          </DialogDescription>

          <div className="flex w-full flex-col gap-3">
            {/* Rollback in case of live version */}
            {/* {walletPayments.length > 0 && (
              <>
                <div className="mt-3 space-y-2">
                  {walletPaymentHasGooglePay && (
                    <DynamicCustomGooglePay
                      CurrencyISOCode={CurrencyISOCode}
                      ISOCode={ISOCode}
                      locale={locale}
                      totalPrice={totalPrice}
                      resources={{ total: resources["total"] }}
                      selectedPaymentMethodId={selectedPaymentMethodId}
                      orderNumber={data?.OrderNumber}
                      orderType={selectedOrderType?.Name!}
                      handleClose={handleClose}
                      data={data}
                      cartData={cartData}
                      analytics={{
                        facebookMenuItems: analytics.facebookMenuItems,
                        tiktokMenuItems: analytics.tiktokMenuItems,
                        googleMenuItems: analytics.googleMenuItems,
                        facebookContentID: analytics.facebookContentID,
                      }}
                    />
                  )}

                  {walletPaymentHasApplePay && (
                    <DynamicCustomApplePay
                      CurrencyISOCode={CurrencyISOCode}
                      ISOCode={ISOCode}
                      locale={locale}
                      totalPrice={totalPrice}
                      resources={{ total: resources["total"] }}
                      selectedPaymentMethodId={selectedPaymentMethodId}
                      orderNumber={data?.OrderNumber}
                      orderType={selectedOrderType?.Name!}
                      handleClose={handleClose}
                      data={data}
                      cartData={cartData}
                      analytics={{
                        facebookMenuItems: analytics.facebookMenuItems,
                        tiktokMenuItems: analytics.tiktokMenuItems,
                        googleMenuItems: analytics.googleMenuItems,
                        facebookContentID: analytics.facebookContentID,
                      }}
                    />
                  )}
                </div>

                <div className="my-5 h-px bg-gray-200 text-center">
                  <span className="relative top-1/2 inline-block -translate-y-1/2 bg-white px-3">
                    {resources["orPayWith"]}
                  </span>
                </div>
              </>
            )} */}

            {data?.Payments?.filter(
              (item) =>
                !Object.values(WalletPaymentsEnum)?.includes(item.TypeID),
            ).map((item) => (
              <RadioLabel
                key={item?.ID}
                name="select_payment_method"
                id={`${item?.Name.toLowerCase().replace(/ /g, "_")}_${
                  item?.ID
                }`}
                checked={item?.ID === selectedPaymentMethodId}
                onChange={() => setSelectedPaymentMethodId(item?.ID)}
                className="size-full"
                labelClassName="h-full"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={item?.LogoURl}
                    alt={item?.Name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-14 max-w-full shrink-0 object-contain p-1"
                  />
                  <span
                    className={cn(
                      "smooth block flex-grow text-lg font-medium capitalize",
                      {
                        "text-main": item?.ID === selectedPaymentMethodId,
                      },
                    )}
                  >
                    {item?.Name}
                  </span>
                </div>
              </RadioLabel>
            ))}
          </div>

          {paymentError && (
            <p className="mt-1 text-sm text-alt">{paymentError}</p>
          )}
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {resources["cancel"]}
          </Button>

          <Button
            type="button"
            className="flex-1"
            onClick={(e) => handlePayment(e)}
          >
            {resources["placeOrderNow"]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
