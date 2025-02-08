import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/navigation";
import { getSingleOrderService } from "@/server/services/orderService";
import { apiErrorCodes } from "@/utils/constants";
import TrackOrderView from "@/views/track-order/TrackOrderView";
// Types
import type { Metadata } from "next";
import { TrackOrderResourcesProps } from "@/types/resources";

type TrackOrederPageProps = {
  params: {
    locale: string;
    orderNumber: string;
  };
};

export async function generateMetadata(
  props: TrackOrederPageProps,
): Promise<Metadata> {
  return {
    title: "TrackOrder",
  };
}

export default async function TrackOrderPage(props: TrackOrederPageProps) {
  const {
    params: { locale, orderNumber },
  } = props;

  const singleOrderResponse = await getSingleOrderService(locale, orderNumber);

  const isAccessTokenExpired = singleOrderResponse?.errors?.find(
    (item) => item.Code === apiErrorCodes.tokenExpired,
  );

  // if (singleOrderResponse?.hasError) {
  //   const unauthorizedError = singleOrderResponse?.errors?.find(
  //     (item) => item.Code === apiErrorCodes.tokenExpired,
  //   );

  //   // Redirect to Login Page incase of unauthorized user
  //   if (unauthorizedError) return redirect("/login");
  // }

  // Redirect to notFound Page incase of Missing Parameter
  // if (!singleOrderResponse?.data) return notFound();

  const t = await getTranslations();

  const resources: TrackOrderResourcesProps = {
    thankYou: t("thankYou"),
    trackOrder: t("trackOrder"),
    paymentMethod: t("paymentMethod"),
    orderNo: t("orderNo"),
    phone: t("phone"),
    orderSubmitSuccess: t("orderSubmitSuccess"),
    recieveEmailMsg: t("recieveEmailMsg"),
    rateus: t("rateus"),
    thanksForRating: t("thanksForRating"),
    at: t("at"),
    orderDate: t("orderDate"),
    orderSummary: t("orderSummary"),
    exploreMenu: t("exploreMenu"),
    total: t("total"),
    deliveryFees: t("deliveryFees"),
    discount: t("discount"),
    subTotal: t("subTotal"),
    tax: t("tax"),
    items: t("items"),
    item: t("item"),
    addInstructionsOptional: t("addInstructionsOptional"),
    notAvailable: t("notAvailable"),
    promoCodeDiscount: t("promoCodeDiscount"),
    dealsDiscount: t("dealsDiscount"),
    allPricesAreVatInclusive: t("allPricesAreVatInclusive"),
    earnedPoints: t("earnedPoints"),
  };

  return (
    <TrackOrderView
      isAccessTokenExpired={!!isAccessTokenExpired}
      data={singleOrderResponse?.data}
      resources={resources}
      orderNumber={orderNumber}
      locale={locale}
    />
  );
}
