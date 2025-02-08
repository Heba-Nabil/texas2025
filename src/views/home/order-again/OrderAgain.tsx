import dynamic from "next/dynamic";
import { getSession } from "@/server/lib/auth";
import { getAllOrdersService } from "@/server/services/orderService";
// Types
import { OrdersPageResourcesProps } from "@/types/resources";

const DynamicOrderAgainCarousel = dynamic(
  () => import("./OrderAgainCarousel"),
  { ssr: false },
);

type OrderAgainProps = {
  locale: string;
  resources: {
    orderAgain: string;
    viewAll: string;
  } & OrdersPageResourcesProps;
};

export default async function OrderAgain(props: OrderAgainProps) {
  const { locale, resources } = props;

  const { userId } = await getSession();

  const ordersResponse = await getAllOrdersService(locale),
    ordersData = ordersResponse?.data || [];

  return (
    <DynamicOrderAgainCarousel
      locale={locale}
      userId={userId!}
      ordersData={ordersData}
      resources={{
        orderAgain: resources["orderAgain"],
        viewAll: resources["viewAll"],
        currentOrders: resources["currentOrders"],
        item: resources["item"],
        items: resources["items"],
        noOrdersYet: resources["noOrdersYet"],
        orderNo: resources["orderNo"],
        orderNow: resources["orderNow"],
        pastOrders: resources["pastOrders"],
        reorder: resources["reorder"],
        trackOrder: resources["trackOrder"],
        viewDetails: resources["viewDetails"],
        orderType: resources["orderType"],
      }}
    />
  );
}
