"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveOrderType,
  toggleModal,
} from "@/store/features/global/globalSlice";
import { useData } from "@/providers/DataProvider";
import useCart from "@/hooks/useCart";
import { mutatePath } from "@/server/actions";
import { displayInOrder } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Types
import { UserSingleDealResponseProps } from "@/types/api";

type RedeemNowOrLaterModalProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<string>>;
  dealId: string;
};

export default function RedeemNowOrLaterModal(
  props: RedeemNowOrLaterModalProps,
) {
  const { isOpen, setOpen, dealId } = props;

  const t = useTranslations();
  const locale = useLocale();

  const router = useRouter();

  const pathname = usePathname()?.toLowerCase();

  const handleClose = () => {
    setOpen("");
  };

  const dispatch = useAppDispatch();

  const { orderLocation, selectedOrderTypeId } = useAppSelector(
    (state) => state.order,
  );

  const {
    Data: { IsCartOrderTypeRequired },
    OrderTypes,
  } = useData();

  const { cartData, handleAddLoyaltyDeal, handleApplyDeal } = useCart();

  const currentDeal = cartData?.DealHeaderID;

  const handleSaveForLater = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await handleAddLoyaltyDeal(locale, dealId);

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      toaster.success({ message: t("dealRedeemedSuccess") });

      await mutatePath(pathname);

      router.push("/dashboard/deals");

      handleClose();
    } catch (error) {
      console.error("Error in redeem the item", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleAddDealToCart = async (
    singleDealData: UserSingleDealResponseProps,
  ) => {
    if (!singleDealData) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      // Case there is deal in cart
      if (currentDeal) {
        toaster.error({
          title: t("anotherDeals"),
          message: t("youAlreadyHaveOneInYourCart"),
        });

        return handleClose();
      }

      const isList = singleDealData.IsHeaderContainsLists;

      if (isList) {
        // Case there is list of items in this deal, go to deal details page
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

        handleClose();
      } else {
        dispatch(toggleModal({ loadingModal: { isOpen: true } }));

        const response = await handleApplyDeal(locale, {
          DealHeaderID: singleDealData.ID,
        });

        if (response?.hasError || typeof response?.data === "string") {
          response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );

          return handleClose();
        }

        toaster.success({ message: t("dealAppliedSuccess") });

        router.push("/cart");

        handleClose();
      }
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleRedeemNow = async () => {
    if (IsCartOrderTypeRequired) {
      if (!selectedOrderTypeId || !orderLocation?.storeId) {
        dispatch(setActiveOrderType(OrderTypes[0].ID));

        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));
        handleClose();
        return;
      }
    }

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await handleAddLoyaltyDeal(locale, dealId);

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      toaster.success({ message: t("dealRedeemedSuccess") });

      await mutatePath(pathname);

      router.push("/dashboard/deals");

      response?.data && handleAddDealToCart(response?.data);
    } catch (error) {
      console.error("Error in redeem the item", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            <img
              src={
                currentDeal
                  ? "/images/rewards/Right-Icon.gif"
                  : "/images/rewards/Middle-Icon.gif"
              }
              width={128}
              height={128}
              alt="redeem"
              loading="lazy"
              className="size-32 max-w-full object-contain"
            />

            <div>
              <h2 className="text-xl font-semibold text-alt">
                {t("readyToRedeem")}
              </h2>

              <DialogDescription className="max-w-xs text-lg font-semibold leading-tight">
                {currentDeal
                  ? `${t("youCannotUserMoreThanOneDealDesc")} ${t("orSaveForLater")}`
                  : t("readyToRedeemDesc")}
              </DialogDescription>
            </div>
          </div>
        </DialogContentWrapper>

        <DialogFooter className="gap-y-1">
          {currentDeal && (
            <Button
              type="button"
              className="flex-1"
              variant="light"
              onClick={handleClose}
            >
              {t("cancel")}
            </Button>
          )}

          <Button
            type="button"
            className="flex-1"
            variant={currentDeal ? "default" : "light"}
            onClick={handleSaveForLater}
          >
            {t("saveForLater")}
          </Button>

          {!currentDeal && (
            <Button type="button" className="flex-1" onClick={handleRedeemNow}>
              {t("redeemNow")}
            </Button>
          )}

          {!currentDeal && (
            <div className="flex-center w-full">
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-700 underline"
              >
                {t("cancel")}
              </button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
