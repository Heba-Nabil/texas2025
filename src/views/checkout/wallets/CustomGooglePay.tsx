import GooglePayButton from "@google-pay/button-react";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { deleteServerCookie } from "@/server/actions/serverCookie";
import { clientSideFetch } from "@/utils";
import {
  CHECKOUT_RESPONSE,
  GUEST_DATA,
  LOGIN_REDIRECT_COOKIE,
  ORDER_DATE,
  routeHandlersKeys,
} from "@/utils/constants";
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

type CustomGooglePayProps = {
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

export default function CustomGooglePay(props: CustomGooglePayProps) {
  const {
    locale,
    CurrencyISOCode,
    ISOCode,
    resources,
    totalPrice,
    selectedPaymentMethodId,
    orderNumber,
    orderType,
    handleClose,
    data,
    cartData,
    analytics,
  } = props;

  const dispatch = useAppDispatch();

  const handleGooglePay = async (
    paymentRequest: google.payments.api.PaymentData,
  ) => {
    console.log("load payment data", paymentRequest);

    const paymentToken =
      paymentRequest?.paymentMethodData?.tokenizationData?.token;

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
      console.log("Response from payment with google", response);

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

  return (
    <GooglePayButton
      environment="TEST"
      buttonLocale={locale}
      buttonSizeMode="fill"
      className="w-full"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "DIRECT",
              parameters: {
                protocolVersion: "ECv2",
                publicKey:
                  process.env.NEXT_PUBLIC_GOOGLE_PAY_TOKENIZE_PUBLIC_KEY!,
              },
            },
            // For Development only
            // tokenizationSpecification: {
            //   type: "PAYMENT_GATEWAY",
            //   parameters: {
            //     gateway: "example",
            //     gatewayMerchantId: "exampleGatewayMerchantId",
            //   },
            // },
          },
        ],
        merchantInfo: {
          merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID!,
          merchantName: process.env.NEXT_PUBLIC_GOOGLE_PAY_BUSINESS_NAME,
          // merchantId: "12345678901234567890",
          // merchantName: "Demo Merchant",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: resources["total"],
          totalPrice: `${totalPrice.toFixed(2)}`,
          currencyCode: CurrencyISOCode,
          countryCode: ISOCode,
        },
      }}
      onLoadPaymentData={handleGooglePay}
      onCancel={(reason) => {
        console.log("Payment Cancelled", reason);
      }}
      onError={(error) => {
        console.log("Payment Error", error);
      }}
    />
  );
}
