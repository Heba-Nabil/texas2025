"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import useCart from "@/hooks/useCart";
import { useRouter } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import cn from "@/utils/cn";
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
import CustomizedCartItem from "@/components/items/CustomizedCartItem";
// Types
import { CartLineProps } from "@/types/api";

export default function MenuItemCustomizationsModal() {
  const t = useTranslations();
  const locale = useLocale();

  const router = useRouter();

  const {
    Data: { CurrencyName, IsCartOrderTypeRequired },
  } = useData();

  const {
    getCustomizations,
    handleQuickUpdateCartItem,
    handleRemoveLineFromCart,
  } = useCart();

  const {
    menuItemCustomizationsModal: { isOpen, data },
  } = useAppSelector(getModals);

  const availCustomizations = useMemo(() => {
    return data ? getCustomizations(data?.id) : [];
  }, [data, getCustomizations]);

  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(
      toggleModal({
        menuItemCustomizationsModal: { isOpen: false, data: null },
      }),
    );
  }, [dispatch]);

  const handleQtyChange = async (isIncrease: boolean, line: CartLineProps) => {
    if (!line) throw new Error("Missing Required Parameter: Line");

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      let response;

      if (isIncrease) {
        response = await handleQuickUpdateCartItem(
          IsCartOrderTypeRequired,
          line.ID,
          line.MenuItem.ID,
          line.Quantity + 1,
          locale,
          isIncrease,
        );
      } else {
        if (line.Quantity > 1) {
          response = await handleQuickUpdateCartItem(
            IsCartOrderTypeRequired,
            line.ID,
            line.MenuItem.ID,
            line.Quantity - 1,
            locale,
            isIncrease,
          );
        } else {
          response = await handleRemoveLineFromCart(
            IsCartOrderTypeRequired,
            line.ID,
            locale,
          );
        }
      }

      if (response?.hasError) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }
    } catch (error) {
      console.log("Err from customization page", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  useEffect(() => {
    if (!availCustomizations || availCustomizations?.length < 1) {
      handleClose();
    }
  }, [availCustomizations, handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("whatAboutCustom")} />

        <DialogDescription className="sr-only hidden">
          {t("whatAboutCustom")}
        </DialogDescription>

        <DialogContentWrapper>
          <ul className="w-full">
            {availCustomizations?.map((item, index) => {
              return (
                <li
                  key={item.ID}
                  className={cn("flex w-full items-center gap-3 py-3", {
                    "border-b": index < availCustomizations.length - 1,
                  })}
                >
                  <CustomizedCartItem
                    data={item}
                    currency={CurrencyName}
                    handleQtyChange={handleQtyChange}
                  />
                </li>
              );
            })}
          </ul>
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {t("close")}
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              router.push(
                `/menu/${data?.categoryNameUnique}/${data?.menuItemNameUnique}`,
                {
                  scroll: false,
                },
              );
              handleClose();
            }}
          >
            {t("addNewCustomization")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
