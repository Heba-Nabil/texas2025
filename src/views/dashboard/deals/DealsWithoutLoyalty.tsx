"use client";

import { useRouter } from "@/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveOrderType,
  toggleModal,
} from "@/store/features/global/globalSlice";
import useCart from "@/hooks/useCart";
import { useData } from "@/providers/DataProvider";
import { clientSideFetch, displayInOrder } from "@/utils";
import { fixedKeywords, routeHandlersKeys } from "@/utils/constants";
import DealItem from "./DealItem";
// Types
import { DealsPageResourcesProps } from "@/types/resources";
import {
  UserDealsResponseProps,
  UserSingleDealResponseProps,
} from "@/types/api";
import { GenericResponse } from "@/types";
import { mutatePath } from "@/server/actions";

type DealsWithoutLoyaltyProps = {
  locale: string;
  resources: DealsPageResourcesProps;
  data: UserDealsResponseProps[];
};

export default function DealsWithoutLoyalty(props: DealsWithoutLoyaltyProps) {
  const { data, locale, resources } = props;

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { orderLocation, selectedOrderTypeId } = useAppSelector(
    (state) => state.order,
  );

  const {
    Data: { IsCartOrderTypeRequired },
    OrderTypes,
  } = useData();

  const { cartData, handleApplyDeal, handleRemoveDeal } = useCart();

  const currentDeal = cartData?.DealHeaderID;

  const handleAddDealButton = async (dealData: UserDealsResponseProps) => {
    if (!dealData) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      // Case there is deal in cart
      if (currentDeal) {
        toaster.error({
          title: resources["anotherDeals"],
          message: resources["youAlreadyHaveOneInYourCart"],
        });

        return;
      }

      if (IsCartOrderTypeRequired) {
        if (!selectedOrderTypeId || !orderLocation?.storeId) {
          dispatch(setActiveOrderType(OrderTypes[0].ID));

          dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

          return;
        }
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

        router.push("/cart");
      }
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const removeDealFromClient = async (id: string) => {
    if (!id) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await handleRemoveDeal(locale, id);

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutatePath("/dashboard/deals");

      toaster.success({ message: resources["dealRemoveSuccess"] });
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <div className="w-full flex-grow">
      {currentDeal && (
        <p className="max-w-sm text-sm font-semibold leading-tight text-alt">
          {resources["youCannotUserMoreThanOneDealDesc"]}
        </p>
      )}

      <div className="w-full flex-col">
        <div className="grid w-full grid-cols-2 items-baseline gap-4 p-2 sm:grid-cols-3">
          {data?.map((item) => (
            <DealItem
              key={item.ID}
              data={item}
              resources={resources}
              currentDeal={currentDeal}
              handleAddDealButton={handleAddDealButton}
              removeDealFromClient={removeDealFromClient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
