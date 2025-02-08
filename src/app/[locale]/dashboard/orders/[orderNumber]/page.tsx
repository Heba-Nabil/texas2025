import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSingleOrderService } from "@/server/services/orderService";
import OrderDetailsView from "@/views/dashboard/orders/order-details/OrderDetailsView";
// Types
import { Metadata } from "next";
import { OrderDetailsPageResourcesProps } from "@/types/resources";

type OrderDetailsPageProps = {
  params: { locale: string; orderNumber: string };
};

export async function generateMetadata(
  props: OrderDetailsPageProps,
): Promise<Metadata> {
  return {
    title: "Order Details",
  };
}

export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  const {
    params: { locale, orderNumber },
  } = props;

  const [orderResponse, t] = await Promise.all([
    getSingleOrderService(locale, orderNumber),
    getTranslations(),
  ]);

  if (!orderResponse?.data) return notFound();

  const resources: OrderDetailsPageResourcesProps = {
    orderDetails: t("orderDetails"),
    back: t("back"),
    orderNo: t("orderNo"),
    orderDate: t("orderDate"),
    items: t("items"),
    item: t("item"),
    reorder: t("reorder"),
    trackOrder: t("trackOrder"),
    paymentMethod: t("paymentMethod"),
    total: t("total"),
    deliveryFees: t("deliveryFees"),
    discount: t("discount"),
    subTotal: t("subTotal"),
    tax: t("tax"),
    allPricesAreVatInclusive: t("allPricesAreVatInclusive"),
    notAvailable: t("notAvailable"),
    rateTheOrder: t("rateTheOrder"),
    addInstructionsOptional: t("addInstructionsOptional"),
    at: t("at"),
    exploreMenu: t("exploreMenu"),
    orderSubmitSuccess: t("orderSubmitSuccess"),
    orderSummary: t("orderSummary"),
    phone: t("phone"),
    rateus: t("rateus"),
    recieveEmailMsg: t("recieveEmailMsg"),
    thanksForRating: t("thanksForRating"),
    thankYou: t("thankYou"),
    promoCodeDiscount: t("promoCodeDiscount"),
    dealsDiscount: t("dealsDiscount"),
    reorderNotAllowedDescription: t("reorderNotAllowedDescription"),
    earnedPoints: t("earnedPoints"),
    yourItems: t("yourItems"),
  };

  return (
    <OrderDetailsView
      resources={resources}
      data={orderResponse?.data}
      locale={locale}
    />
  );
}
