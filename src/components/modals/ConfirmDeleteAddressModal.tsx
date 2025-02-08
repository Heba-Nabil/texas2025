"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import useAddresses from "@/hooks/useAddresses";
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
import DeleteIcon from "@/components/icons/DeleteIcon";

export default function ConfirmDeleteAddressModal() {
  const t = useTranslations();
  const locale = useLocale();

  const { deleteAddress, mutate } = useAddresses(locale);

  const {
    deleteAddressModal: { isOpen, data },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(
      toggleModal({
        deleteAddressModal: { isOpen: false, data: null },
      }),
    );
  };

  const handleDeleteAddress = async () => {
    if (!data?.AddressID) return console.log("Missing AddressID");

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await deleteAddress(locale, data?.AddressID);

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

      await mutate();

      toaster.success({ message: t("addressDeletedSuccess") });
      handleClose();
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("deleteAddress")} />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            <i className="flex-center aspect-square w-14 rounded-full bg-main/20">
              <DeleteIcon className="size-6 text-alt" />
            </i>

            <DialogDescription className="text-lg font-semibold leading-tight">
              {t("confirmDeleteAddressMsg")}
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

          <Button
            type="button"
            className="flex-1"
            onClick={handleDeleteAddress}
          >
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
