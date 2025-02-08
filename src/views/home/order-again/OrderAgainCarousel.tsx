"use client";

import { getGuestSession } from "@/utils/getSessionHandler";
import SectionHeading from "../SectionHeading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import OrderHistoryItem from "@/views/dashboard/orders/OrderHistoryItem";
// Types
import { OrdersPageResourcesProps } from "@/types/resources";
import { SingleOrderResponseProps } from "@/types/api";

type OrderAgainCarouselProps = {
  locale: string;
  userId: string;
  ordersData: SingleOrderResponseProps[];
  resources: {
    orderAgain: string;
    viewAll: string;
  } & OrdersPageResourcesProps;
};

export default function OrderAgainCarousel(props: OrderAgainCarouselProps) {
  const { locale, resources, userId, ordersData } = props;

  const availableGuestSession = getGuestSession();

  if (userId && ordersData?.length === 0) return null;

  if (!(userId && ordersData?.length > 0) && !availableGuestSession) {
    return null;
  }

  const ordersToView = userId ? ordersData : ordersData?.slice(0, 1);

  if (ordersToView?.length === 0) return null;

  return (
    <section className="mb-5 w-full">
      <div className="container">
        <SectionHeading
          title={resources["orderAgain"]}
          linkLabel={
            userId && ordersData?.length > 0 ? resources["viewAll"] : ""
          }
          linkHref={userId && ordersData?.length > 0 ? "/dashboard/orders" : ""}
        />

        <Carousel
          className="mt-3 w-full"
          opts={{
            dragFree: true,
            direction: locale === "ar" ? "rtl" : "ltr",
          }}
        >
          <CarouselContent className="ml-0 py-3">
            {ordersToView?.map((item) => (
              <CarouselItem
                key={item.ID}
                className="shrink-0 basis-[85%] pe-3 ps-0 sm:basis-3/4 md:basis-3/5 lg:basis-2/5 xl:basis-[30%]"
              >
                <OrderHistoryItem
                  key={item?.ID}
                  data={item}
                  resources={resources}
                  locale={locale}
                  className="mb-0"
                  startUrl={userId ? "/dashboard/orders" : "/track-order"}
                  showViewDetails={false}
                  showDescription={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
