"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { userLogoutThunk } from "@/store/features/auth/authThunk";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { apiErrorCodes } from "@/utils/constants";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LogoutIcon from "@/components/icons/LogoutIcon";

export default function ConfirmLogoutModal() {
  const t = useTranslations();
  const locale = useLocale();

  const {
    logOutModal: { isOpen },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ logOutModal: { isOpen: false } }));
  };

  const handleLogout = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      // const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await dispatch(
        userLogoutThunk({
          locale,
        }),
      ).unwrap();

      await clearServerCookie();

      window.location.replace(`/${locale}`);

      // if (response?.hasError) {
      //   const isTokenNotValid = response?.errors?.find(
      //     (item) => item.Code === apiErrorCodes.tokenExpired,
      //   );

      //   if (isTokenNotValid) {
      //     await clearServerCookie();

      //     window.location.replace(`/${locale}`);

      //     return;
      //   }

      //   dispatch(toggleModal({ loadingModal: { isOpen: false } }));

      //   return response?.errors?.forEach((item) =>
      //     toaster.error({
      //       title: item.Title,
      //       message: item.Message,
      //     }),
      //   );
      // }

      // await clearServerCookie();

      // window.location.replace(`/${locale}`);
      handleClose();
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);

      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            <div className="flex-center aspect-square w-14 rounded-full bg-main/20">
              <LogoutIcon className="h-20 w-14 text-alt" />
            </div>

            <DialogTitle>
              <p className="max-w-xs px-6 text-lg font-semibold capitalize leading-tight">
                {t("confirmLogoutTitle")}
              </p>
            </DialogTitle>

            <DialogDescription>
              <span>{t("confirmLogoutDesc")}</span>
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

          <Button type="button" className="flex-1" onClick={handleLogout}>
            {t("logOut")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
