"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { mutatePath } from "@/server/actions";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import useCart from "@/hooks/useCart";
import { apiErrorCodes } from "@/utils/constants";
import { clearServerCookie } from "@/server/actions/clearCookies";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmToggleDealModal() {
  const t = useTranslations();
  const locale = useLocale();

  const {
    confirmToggleDealModal: { isOpen, data },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const { cartData, handleApplyDeal, handleRemoveDeal } = useCart();

  const currentDealHeaderId = cartData?.DealHeaderID;

  const handleClose = () => {
    dispatch(
      toggleModal({
        confirmToggleDealModal: { isOpen: false, data: null },
      }),
    );
  };

  const confirmRemoveDeal = async () => {
    if (!data?.ID || !currentDealHeaderId) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await handleRemoveDeal(locale, currentDealHeaderId);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutatePath("/cart");

      toaster.success({ message: t("dealRemoveSuccess") });

      if (data?.IsHeaderContainsLists) {
        console.log("Close This Modal and Open The Add Modal");
      } else {
        const response = await handleApplyDeal(locale, {
          DealHeaderID: data?.ID,
        });

        if (response?.hasError || typeof response?.data === "string") {
          const isTokenExpired = response?.errors?.find(
            (item) => item.Code === apiErrorCodes.tokenExpired,
          );

          if (isTokenExpired) {
            await clearServerCookie();

            window.location.replace(`/${locale}`);
          }

          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        toaster.success({ message: t("dealAppliedSuccess") });
        await mutatePath("/cart");

        handleClose();
      }
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col text-center">
            <img
              src="/images/icons/deals-with-star.svg"
              alt="deals with star"
              width={120}
              height={40}
              className="object-contain"
              loading="lazy"
            />
            <span className="sr-only">deals with star</span>

            <h2 className="mt-4 text-lg font-semibold capitalize text-alt">
              {data?.Name?.trim()}
            </h2>
            <DialogDescription className="text-lg font-semibold leading-tight">
              {t("whenYouAddAnotherDealWeWillRemoveTheCurrentDeal")}
            </DialogDescription>
          </div>
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {t("cancel")}
          </Button>

          <Button type="button" className="flex-1" onClick={confirmRemoveDeal}>
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
