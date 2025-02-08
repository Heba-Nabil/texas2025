"use client";

import { useState } from "react";
import {
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "@/navigation";
import { displayInOrder } from "@/utils";
import { useData } from "@/providers/DataProvider";
import DashBoardPagesWrapper from "../../DashBoardPagesWrapper";
import NextLink from "@/components/global/NextLink";
import TrackOrderProgress from "@/views/track-order/TrackOrderProgress";
import TrackOrderPayment from "@/views/track-order/TrackOrderPayment";
import EarnedPoints from "@/views/track-order/EarnedPoints";
import TrackOrderType from "@/views/track-order/TrackOrderType";
import OrderDetailsItemsSummary from "./OrderDetailsItemsSummary";
import RatingSection from "@/views/track-order/RatingSection";
import { Button } from "@/components/ui/button";
import ConfirmReorderModal from "./ConfirmReorderModal";
// Types
import { OrderDetailsPageResourcesProps } from "@/types/resources";
import { SingleOrderResponseProps } from "@/types/api";

type OrderDetailsViewProps = {
  resources: OrderDetailsPageResourcesProps;
  data: SingleOrderResponseProps;
  locale: string;
};

export default function OrderDetailsView(props: OrderDetailsViewProps) {
  const { resources, data, locale } = props;

  const router = useRouter();

  const {
    Data: { CurrencyName, IsTaxInclusive },
  } = useData();

  const totalItems = data?.MenuItemsCount;

  const lastActiveTrackStatus = displayInOrder(data?.TrackingStatus)
    ?.filter((item) => item.IsOn)
    .pop();

  const IsCompleted = data?.TrackingStatus?.every((item) => item.IsOn);

  const [orderNumberToReorder, setOrderNumberToReorder] = useState("");

  const handleReorder = () => {
    if (data?.IsReorderable) {
      setOrderNumberToReorder(data?.OrderNumber);
    }
  };

  return (
    <DashBoardPagesWrapper
      label={resources["orderDetails"]}
      closeMark={<ChevronLeftIcon className="size-5 rtl:-scale-x-100" />}
      cb={() => router.push(`/dashboard/orders`)}
      otherLink={
        <NextLink
          href="/dashboard/orders"
          className="flex items-center gap-1 text-base font-medium capitalize text-alt"
        >
          {resources["back"]}
          <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
        </NextLink>
      }
    >
      <div className="flex-grow overflow-y-auto px-5">
        <div className="border-b pb-4">
          <div className="flex flex-col">
            <h3 className="mb-2 truncate text-xl font-semibold capitalize">
              {resources["orderNo"]}:{" "}
              <span className="text-lg font-normal">{data?.OrderNumber}</span>
            </h3>

            <h3 className="mb-2 truncate text-xl font-semibold capitalize">
              {resources["orderDate"]}:{" "}
              <span className="text-lg font-normal">
                {new Date(data?.OrderDate).toLocaleString(locale || "en", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </h3>

            <span className="block text-lg capitalize text-alt">
              {totalItems > 1 ? resources["items"] : resources["item"]} : &nbsp;
              {totalItems}
            </span>
          </div>
        </div>

        {!IsCompleted && (
          <div className="border-b py-5 @container">
            <TrackOrderProgress
              data={displayInOrder(data?.TrackingStatus)}
              resources={{ trackOrder: resources["trackOrder"] }}
            />
          </div>
        )}

        {IsCompleted && lastActiveTrackStatus && (
          <div className="border-b py-5 @container">
            <div className="flex-between gap-3">
              <div className="flex flex-grow items-center gap-3">
                <span className="flex-center aspect-square size-20 shrink-0 rounded-full bg-main p-1 @sm:p-2 @md:p-3">
                  <img
                    src={lastActiveTrackStatus?.StatusIcon}
                    alt={lastActiveTrackStatus?.Name}
                    width={32}
                    height={32}
                    loading="lazy"
                    className="smooth aspect-square w-7 object-contain p-1 @sm:w-10 @md:w-14"
                  />
                </span>

                <span className="font-semibold capitalize text-dark-gray sm:text-base">
                  {lastActiveTrackStatus?.Name}
                </span>
              </div>

              {data?.IsReorderable && (
                <button
                  type="button"
                  className="flex-center gap-1 text-alt"
                  onClick={handleReorder}
                >
                  {resources["reorder"]} <ChevronRightIcon className="size-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="border-b py-5">
          <TrackOrderType
            locale={locale}
            orderTypeData={data?.OrderType}
            storeData={data?.Store}
            date={data?.OrderDate}
            resources={{ orderDate: resources["orderDate"] }}
            applicationUser={data?.ApplicationUserInformation}
          />
        </div>

        <div className="border-b py-5">
          <TrackOrderPayment
            data={data?.Payments}
            resources={{ paymentMethod: resources["paymentMethod"] }}
          />
        </div>

        {data?.Points > 0 && (
          <div className="border-b-2 py-5">
            <EarnedPoints
              points={data?.Points}
              resources={{ earnedPoints: resources["earnedPoints"] }}
            />
          </div>
        )}

        <div className="py-5">
          <OrderDetailsItemsSummary
            data={data}
            currency={CurrencyName}
            IsTaxInclusive={IsTaxInclusive}
            quantity={totalItems}
            resources={{
              item: resources["item"],
              items: resources["items"],
              total: resources["total"],
              deliveryFees: resources["deliveryFees"],
              discount: resources["discount"],
              subTotal: resources["subTotal"],
              tax: resources["tax"],
              allPricesAreVatInclusive: resources["allPricesAreVatInclusive"],
              notAvailable: resources["notAvailable"],
              promoCodeDiscount: resources["promoCodeDiscount"],
              dealsDiscount: resources["dealsDiscount"],
              yourItems: resources["yourItems"],
            }}
          />
        </div>

        <div className="mb-4 text-center">
          <RatingSection
            resources={{
              thankYou: resources["thankYou"],
              trackOrder: resources["trackOrder"],
              paymentMethod: resources["paymentMethod"],
              orderNo: resources["orderNo"],
              phone: resources["phone"],
              orderSubmitSuccess: resources["orderSubmitSuccess"],
              recieveEmailMsg: resources["recieveEmailMsg"],
              rateus: resources["rateus"],
              thanksForRating: resources["thanksForRating"],
              at: resources["at"],
              orderDate: resources["orderDate"],
              exploreMenu: resources["exploreMenu"],
              orderSummary: resources["orderSummary"],
              total: resources["total"],
              tax: resources["tax"],
              subTotal: resources["subTotal"],
              discount: resources["discount"],
              deliveryFees: resources["deliveryFees"],
              items: resources["items"],
              item: resources["item"],
              addInstructionsOptional: resources["addInstructionsOptional"],
              notAvailable: resources["notAvailable"],
              promoCodeDiscount: resources["promoCodeDiscount"],
              dealsDiscount: resources["dealsDiscount"],
              allPricesAreVatInclusive: resources["allPricesAreVatInclusive"],
              earnedPoints: resources["earnedPoints"],
            }}
            orderNumber={data?.OrderNumber}
            rate={data?.Rate}
            locale={locale}
          />
        </div>
      </div>

      <div className="sticky bottom-1 px-5">
        {data?.IsReorderable ? (
          <Button onClick={handleReorder} className="w-full">
            {resources["reorder"]}
          </Button>
        ) : (
          <div className="w-full rounded-md bg-main px-4 py-2 text-center text-main-foreground opacity-80">
            {resources["reorderNotAllowedDescription"]}
          </div>
        )}
      </div>

      {data?.IsReorderable && !!orderNumberToReorder && (
        <ConfirmReorderModal
          isOpen={!!orderNumberToReorder}
          setOpen={setOrderNumberToReorder}
          orderNumber={orderNumberToReorder}
        />
      )}
    </DashBoardPagesWrapper>
  );
}
