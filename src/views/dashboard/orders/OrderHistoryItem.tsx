"use client";

// import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { displayInOrder } from "@/utils";
import { useData } from "@/providers/DataProvider";
import cn from "@/utils/cn";
import NextLink from "@/components/global/NextLink";
import ActiveDateBgIcon from "@/components/icons/ActiveDateBgIcon";
import { Button } from "@/components/ui/button";
import DemedDateBgIcon from "@/components/icons/DemedDateBgIcon";
// Types
import { OrderMenuItemProps, SingleOrderResponseProps } from "@/types/api";
import { OrdersPageResourcesProps } from "@/types/resources";

type OrderHistoryItemProps = {
  resources: OrdersPageResourcesProps;
  data: SingleOrderResponseProps;
  locale: string;
  className?: string;
  startUrl?: string;
  showViewDetails?: boolean;
  showDescription?: boolean;
};

const productsName = (menuItems: OrderMenuItemProps[]) =>
  menuItems.reduce((acc, cur, index) => {
    return (
      acc + `${cur.Name?.trim()}${index < menuItems.length - 1 ? ", " : ""}`
    );
  }, "");

export default function OrderHistoryItem(props: OrderHistoryItemProps) {
  const {
    resources,
    data,
    locale,
    className,
    startUrl = "/dashboard/orders",
    showViewDetails = true,
    showDescription = true,
  } = props;

  const totalItems = data?.MenuItemsCount;

  const activeStatus = displayInOrder(data?.TrackingStatus)
    .filter((item) => item.IsOn)
    .pop();

  const IsCompleted = data?.TrackingStatus?.every((item) => item.IsOn);

  const {
    Data: { CurrencyName },
  } = useData();

  return (
    <div
      className={cn(
        "smooth mb-6 rounded-lg shadow-lg hover:shadow-xl",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute -top-[5px] start-2 h-10 w-8">
          {IsCompleted ? <DemedDateBgIcon /> : <ActiveDateBgIcon />}

          <span
            className={cn(
              "absolute inset-0 ps-1.5 pt-2.5 text-sm font-semibold leading-none text-dark-gray rtl:text-xs",
              {
                "text-alt-foreground": !IsCompleted,
              },
            )}
          >
            {new Date(data?.OrderDate).toLocaleString("en", {
              day: "numeric",
            })}
            <br />
            {new Date(data?.OrderDate).toLocaleString("en", {
              month: "short",
            })}
          </span>
        </div>

        <div className="py-3 pe-4 ps-[52px]">
          <div className="flex-between gap-1">
            <NextLink href={`${startUrl}/${data?.OrderNumber}`}>
              <h3 className="truncate capitalize">
                <span className="text-lg font-bold">
                  {resources["orderNo"]}:
                </span>
                &nbsp;
                <span>{data?.OrderNumber}</span>
              </h3>
            </NextLink>

            {/* {showViewDetails && (
              <NextLink
                href={`/dashboard/orders/${data?.OrderNumber}`}
                className="flex shrink-0 items-center gap-1 text-sm font-medium capitalize text-alt"
              >
                {resources["viewDetails"]}
                <ChevronRightIcon className="size-4 rtl:-scale-x-100" />
              </NextLink>
            )} */}
          </div>

          <div className="flex-between gap-2">
            <span className="block font-semibold capitalize text-dark-gray">
              {totalItems > 1 ? resources["items"] : resources["item"]}: &nbsp;
              <span className={!showDescription ? "text-foreground" : ""}>
                {totalItems}
              </span>
            </span>

            {!showDescription && (
              <strong className="shrink-0 text-lg font-bold text-alt">
                {data?.Total} {CurrencyName}
              </strong>
            )}
          </div>

          {showDescription && (
            <div className="mt-1 flex items-start justify-between gap-1">
              <p className="font-semibold">
                <span>{resources["orderType"]}</span> :{" "}
                <span className="text-alt">
                  {data?.OrderType?.Name?.trim()}
                </span>
              </p>
              {/* <p className="line-clamp-2 h-10 max-w-sm leading-tight">
                {productsName(data.MenuItems)}{" "}
                {data?.Deals?.reduce(
                  (acc, cur) => {
                    return acc + cur.Name?.trim();
                  },
                  data.MenuItems?.length > 0 ? " - " : "",
                )}
              </p> */}

              <strong className="shrink-0 text-lg font-bold">
                {data?.Total} {CurrencyName}
              </strong>
            </div>
          )}
        </div>
      </div>

      <hr className="mx-4" />

      <div className="flex-between gap-3 p-4">
        <span className="flex-between gap-2 font-semibold text-dark-gray">
          <img
            src={activeStatus?.StatusIcon}
            alt={activeStatus?.Name}
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
            loading="lazy"
          />
          {activeStatus?.Name}
        </span>

        <div className="w-[120px]">
          <Button asChild>
            <NextLink
              href={`${startUrl}/${data?.OrderNumber}`}
              className="w-full"
            >
              {IsCompleted ? resources["reorder"] : resources["trackOrder"]}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
