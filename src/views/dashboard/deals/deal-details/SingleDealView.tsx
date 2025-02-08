"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import useCart from "@/hooks/useCart";
import { displayInOrder } from "@/utils";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import NextImage from "@/components/global/NextImage";
import PageModal from "@/components/global/PageModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DealDetailsRadioItem from "./DealDetailsRadioItem";
import { Button } from "@/components/ui/button";
// Types
import { DealsPageResourcesProps } from "@/types/resources";
import {
  UserSingleDealListItemProps,
  UserSingleDealResponseProps,
} from "@/types/api";
import { apiErrorCodes } from "@/utils/constants";

type SingleDealViewProps = {
  resources: DealsPageResourcesProps;
  data: UserSingleDealResponseProps;
  locale: string;
  defaultDealListData: UserSingleDealListItemProps[];
};

export default function SingleDealView(props: SingleDealViewProps) {
  const { data, resources, locale, defaultDealListData } = props;

  const router = useRouter();

  const dispatch = useAppDispatch();

  const {
    Data: { CurrencyName },
  } = useData();

  const { cartData, handleApplyDeal, handleRemoveDeal } = useCart();

  const [dealListsData, setDealListsData] =
    useState<UserSingleDealListItemProps[]>(defaultDealListData);

  const [accordionState, setAccordionState] = useState([
    dealListsData[0]?.ID || "",
  ]);

  const handleAccordionChange = (value: string[] | string) => {
    setAccordionState(typeof value === "string" ? value.split(",") : value);
  };

  // Open next accordion
  useEffect(() => {
    const notSelectedDealDetail = dealListsData?.filter((list) => {
      const isCurrentListHasSelectedDetail = list.Details.find(
        (detail) => (detail.SelectedQuantity ?? 0) > 0,
      );

      return !isCurrentListHasSelectedDetail;
    });

    setAccordionState((prev) => [...prev, notSelectedDealDetail[0]?.ID]);

    const listParentEl = document.getElementById(notSelectedDealDetail[0]?.ID);

    if (listParentEl) {
      setTimeout(() => {
        listParentEl.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [dealListsData]);

  const isAllDetailsSelected = useMemo(() => {
    let totalSelectedQty = 0;

    for (let list in dealListsData) {
      const listDetails = dealListsData[list].Details;

      for (let detail in listDetails) {
        totalSelectedQty += listDetails[detail].SelectedQuantity ?? 0;
      }
    }

    return totalSelectedQty === dealListsData.length;
  }, [dealListsData]);

  const isCartDataHasDealWithList = useMemo(() => {
    return (
      cartData?.Deals &&
      cartData?.Deals?.length > 0 &&
      cartData?.IsHeaderContainsLists
    );
  }, [cartData]);

  // Set deal list details if single deal data exist
  useEffect(() => {
    if (isCartDataHasDealWithList && data) {
      setDealListsData(
        displayInOrder(data?.Lists)?.map((item) => ({
          ...item,
          Details: item.Details.map((el) => ({
            ...el,
            SelectedQuantity: cartData?.Deals?.find(
              (deal) => deal.ID === data.ID,
            )?.Lines?.find((line) => line.DealDetailsID === el.ID)
              ? 1
              : 0,
          })),
        })),
      );
    } else if (data) {
      setDealListsData(
        displayInOrder(data?.Lists)?.map((item) => ({
          ...item,
          Details: item.Details.map((el) => ({
            ...el,
            SelectedQuantity: 0,
          })),
        })),
      );
    } else {
      setDealListsData([]);
    }
  }, [isCartDataHasDealWithList, data, cartData]);

  // Handle change deal with list details
  const handleChangeDealWithList = (listId: string, detailId: string) => {
    const updatedDealDetails = dealListsData?.map((list) => {
      if (list.ID === listId) {
        return {
          ...list,
          Details: list.Details.map((detail) => {
            if (detail.ID === detailId) {
              return {
                ...detail,
                SelectedQuantity: 1,
              };
            }

            return { ...detail, SelectedQuantity: 0 };
          }),
        };
      }

      return list;
    });

    setDealListsData(updatedDealDetails);
  };

  const handleModalDismiss = useCallback(() => {
    router.replace("/dashboard/deals");
  }, [router]);

  const handleAddDealWithListToCart = useCallback(async () => {
    if (!isAllDetailsSelected) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const currentCartDealId = cartData?.DealHeaderID;

      // Case try to add deal with there is another deal in cart
      if (currentCartDealId && currentCartDealId !== data?.ID) {
        return toaster.error({
          title: resources["anotherDeals"],
          message: resources["youAlreadyHaveOneInYourCart"],
        });
      }

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      // Case deal already exist in cart and try to edit it
      // if (currentCartDealId && currentCartDealId === data?.ID) {
      //   // Remove deal first
      //   const removeDealResponse = await handleRemoveDeal(locale, data?.ID);

      //   if (removeDealResponse?.hasError) {
      //     return removeDealResponse?.errors?.forEach((item) =>
      //       toaster.error({
      //         title: item.Title,
      //         message: item.Message,
      //       }),
      //     );
      //   }
      // }

      // Add deal with new Updates
      const Lists = dealListsData?.map((list) => ({
        ID: list.ID,
        Details: list.Details?.filter(
          (detail) => (detail.SelectedQuantity ?? 0) > 0,
        )?.map((item) => ({ ID: item.ID })),
      }));

      const response = await handleApplyDeal(locale, {
        DealHeaderID: data.ID,
        Lists,
      });

      if (response?.hasError || typeof response?.data === "string") {
        response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );

        const isErrorMissingParams =
          response?.responseCode === apiErrorCodes.missingParameter;

        if (isErrorMissingParams) {
          handleModalDismiss();
        }
      } else {
        toaster.success({
          message:
            currentCartDealId === data?.ID
              ? resources["dealUpdatedSuccess"]
              : resources["dealAppliedSuccess"],
        });

        router.replace("/cart", { scroll: false });
      }
    } catch (error) {
      console.log("Error from add deal with list", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  }, [
    cartData,
    data,
    dealListsData,
    isAllDetailsSelected,
    locale,
    resources,
    router,
    handleModalDismiss,
    dispatch,
    handleApplyDeal,
    // handleRemoveDeal,
  ]);

  return (
    <PageModal>
      <div className="flex w-full">
        <div className="w-full">
          <div className="mt-24 flex max-h-[calc(95vh-112px)] flex-col justify-between">
            <div className="relative rounded-t-3xl bg-white px-4 pb-1">
              <button
                type="button"
                aria-label="back"
                onClick={handleModalDismiss}
              >
                <i className="flex-center absolute -top-24 size-9 rounded-full bg-white rtl:-scale-x-100">
                  <ChevronLeftIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                </i>
              </button>

              <div className="absolute -top-[130px] left-1/2 flex size-48 -translate-x-1/2">
                <NextImage
                  src={data?.IconURL ? data?.IconURL : "/images/deal-img.png"}
                  alt={data?.Name?.trim()}
                  fill
                  sizes="(max-media: 767px) 50vw, 25vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              <div className="relative bg-white px-4 pb-3">
                <h1 className="text-xl font-semibold capitalize">
                  {data?.Name?.trim()}
                </h1>

                {/* <strong className="text-lg font-semibold text-alt">
                  33 {CurrencyName}
                </strong> */}

                <p className="text-sm leading-tight text-gray-500">
                  {data?.Description?.trim()}
                </p>
              </div>

              <Accordion
                type="multiple"
                value={accordionState}
                onValueChange={handleAccordionChange}
                className="w-full space-y-2 border-t bg-gray-100"
              >
                {dealListsData?.map((list) => (
                  <AccordionItem
                    key={list.ID}
                    value={list?.ID}
                    className="bg-white"
                  >
                    <AccordionTrigger className="border-b px-4">
                      <span>
                        <span className="flex items-center gap-3">
                          <span className="text-lg font-bold capitalize leading-tight">
                            {list?.Name}
                          </span>

                          <span className="rounded-xl bg-main/50 px-2 text-xs text-alt">
                            {resources["required"]}
                          </span>
                        </span>
                        <span className="block text-start text-sm leading-tight text-gray-500">
                          {list.Description?.trim()}
                        </span>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 py-0" id={list.ID}>
                      {displayInOrder(list.Details)?.map((detail, index) => (
                        <DealDetailsRadioItem
                          key={detail.ID}
                          data={detail}
                          isLast={index === list.Details?.length - 1}
                          currency={CurrencyName}
                          name={list.ID}
                          resources={{ free: resources["free"] }}
                          handleChange={() =>
                            handleChangeDealWithList(list.ID, detail.ID)
                          }
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="bg-white p-4 md:rounded-b-3xl">
              <Button
                type="button"
                className="w-full justify-center"
                disabled={!isAllDetailsSelected}
                onClick={handleAddDealWithListToCart}
              >
                {/* <span>33 {CurrencyName}</span> */}
                {resources["addToCart"]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageModal>
  );
}
