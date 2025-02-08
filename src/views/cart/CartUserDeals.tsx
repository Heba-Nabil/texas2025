"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { clientSideFetch, displayInOrder } from "@/utils";
import { fixedKeywords, routeHandlersKeys } from "@/utils/constants";
import { mutatePath } from "@/server/actions";
import useCart from "@/hooks/useCart";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import NextLink from "@/components/global/NextLink";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// Types
import {
  UserDealsResponseProps,
  UserSingleDealResponseProps,
} from "@/types/api";
import { CartPageResourcesProps } from "@/types/resources";
import { GenericResponse } from "@/types";
import { type CarouselApi } from "@/components/ui/carousel";

type CartUserDealsProps = {
  locale: string;
  data: UserDealsResponseProps[];
  resources: CartPageResourcesProps;
  currentDeal?: UserDealsResponseProps;
  removeDealFromClient: (id: string) => Promise<void>;
};

export default function CartUserDeals(props: CartUserDealsProps) {
  const { data, locale, resources, currentDeal, removeDealFromClient } = props;

  const dispatch = useAppDispatch();

  const { handleApplyDeal } = useCart();

  const activeDealId = currentDeal?.ID;

  const activeTabIndex = useMemo(() => {
    const index = data?.findIndex((item) => item.ID === activeDealId);

    return index !== -1 ? index : 0;
  }, [data, activeDealId]);

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(activeTabIndex);
  }, [api, activeTabIndex]);

  const handleAddDealButton = async (dealData: UserDealsResponseProps) => {
    if (!dealData) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      // Case there is deal in cart
      if (currentDeal) {
        // Case click on the same deal which already applied
        if (activeDealId === dealData?.ID) return;

        toaster.error({
          title: resources["anotherDeals"],
          message: resources["youAlreadyHaveOneInYourCart"],
        });

        return;
      }

      const isList = dealData.IsHeaderContainsLists;

      if (isList) {
        // Case there is list of items in this deal, go to deal details page
        dispatch(toggleModal({ loadingModal: { isOpen: true } }));

        const singleDealResponse = await clientSideFetch<
          GenericResponse<UserSingleDealResponseProps>
        >(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getSingleDeal}?${fixedKeywords.DealHeaderID}=${dealData.ID}`,
        );

        if (singleDealResponse?.hasError || !singleDealResponse?.data) {
          return singleDealResponse?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        const singleDealData = singleDealResponse?.data;

        const defaultDealListData = singleDealData?.Lists
          ? displayInOrder(singleDealData?.Lists)?.map((item) => ({
              ...item,
              Details: displayInOrder(item.Details)?.map((el) => ({
                ...el,
                SelectedQuantity: 0,
              })),
            }))
          : [];

        const modifiedSingleDealData = {
          ...singleDealData,
          Lists: defaultDealListData,
        };

        dispatch(
          toggleModal({
            singleDealWithListModal: {
              isOpen: true,
              data: modifiedSingleDealData,
            },
          }),
        );
      } else {
        dispatch(toggleModal({ loadingModal: { isOpen: true } }));

        const response = await handleApplyDeal(locale, {
          DealHeaderID: dealData.ID,
        });

        if (response?.hasError || typeof response?.data === "string") {
          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        toaster.success({ message: resources["dealAppliedSuccess"] });

        await mutatePath("/cart");
      }
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <div className="w-full px-4 pb-5 pt-2">
      <div className="flex-between">
        <h2 className="text-xl font-semibold">{resources["allDeals"]}</h2>

        <NextLink href="/dashboard/deals" className="flex-center gap-1">
          {resources["viewAll"]}{" "}
          <ArrowRightCircleIcon className="size-4 text-main rtl:-scale-x-100" />
        </NextLink>
      </div>

      <div className="mt-4">
        <Carousel
          opts={{
            direction: locale === "ar" ? "rtl" : "ltr",
            dragFree: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {data?.map((item) => (
              <CarouselItem
                key={item.ID}
                className="basis-3/5 pe-3 ps-0 sm:basis-2/5 xl:basis-[30%]"
              >
                {item.ID === activeDealId ? (
                  <div className="smooth flex-between group w-full gap-1 rounded-lg border-2 border-main bg-main/5 p-3">
                    <div>
                      <p
                        className="line-clamp-1 font-semibold capitalize text-main"
                        title={item.Name?.trim()}
                      >
                        {item.Name?.trim()}
                      </p>

                      <p
                        className="line-clamp-1 text-sm text-gray-500"
                        title={item.Description?.trim()}
                      >
                        {item.Description?.trim()}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="shrink-0"
                      onClick={() => removeDealFromClient(item?.ID)}
                    >
                      <span className="text-sm capitalize text-red-500">
                        {resources["remove"]}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "smooth flex-between group w-full cursor-pointer gap-1 rounded-lg border-2 border-gray-200 p-3 hover:bg-main/5",
                      {
                        "pointer-events-none opacity-50":
                          item.ID !== activeDealId &&
                          activeDealId !== undefined,
                      },
                    )}
                    onClick={() => handleAddDealButton(item)}
                  >
                    <div>
                      <p
                        className="line-clamp-1 font-semibold capitalize"
                        title={item.Name?.trim()}
                      >
                        {item.Name?.trim()}
                      </p>

                      <p
                        className="line-clamp-1 text-sm text-gray-500"
                        title={item.Description?.trim()}
                      >
                        {item.Description?.trim()}
                      </p>
                    </div>

                    <div className="size-6 shrink-0 rounded-full border border-gray-200" />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
