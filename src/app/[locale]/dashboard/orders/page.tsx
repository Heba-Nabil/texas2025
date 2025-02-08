// import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllOrdersService } from "@/server/services/orderService";
import OrdersView from "@/views/dashboard/orders/OrdersView";
// Types
import { Metadata } from "next";
import { OrdersPageResourcesProps } from "@/types/resources";

type OrdersPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: OrdersPageProps,
): Promise<Metadata> {
  return {
    title: "Orders",
  };
}

export default async function OrdersPage(props: OrdersPageProps) {
  const {
    params: { locale },
  } = props;

  const [allOrdersData, t] = await Promise.all([
    getAllOrdersService(locale),
    getTranslations(),
  ]);

  // if (!allOrdersData?.data) return notFound();

  const resources: OrdersPageResourcesProps = {
    currentOrders: t("currentOrders"),
    pastOrders: t("pastOrders"),
    noOrdersYet: t("noOrdersYet"),
    orderNow: t("orderNow"),
    orderNo: t("orderNo"),
    viewDetails: t("viewDetails"),
    reorder: t("reorder"),
    trackOrder: t("trackOrder"),
    items: t("items"),
    item: t("item"),
    orderType: t("orderType"),
  };

  return (
    <OrdersView
      resources={resources}
      data={allOrdersData?.data}
      locale={locale}
    />
  );
}
