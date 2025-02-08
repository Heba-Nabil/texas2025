"use client";

import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import useCart from "@/hooks/useCart";
import { useData } from "@/providers/DataProvider";
import { useAppSelector } from "@/store/hooks";
// import { apiErrorCodes } from "@/utils/constants";
// import { clearServerCookie } from "@/server/actions/clearCookies";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import NextImage from "@/components/global/NextImage";
import { Button } from "@/components/ui/button";

export default function DeleteCartItemModal() {
  const t = useTranslations();
  const locale = useLocale();

  const {
    Data: { CurrencyName, IsCartOrderTypeRequired, CurrencyISOCode },
  } = useData();

  const { handleRemoveLineFromCart, findByLineId } = useCart();

  const {
    deleteCartItemModal: { isOpen, data },
  } = useAppSelector(getModals);

  const dispatch = useDispatch();

  const deletedItem = findByLineId(data?.lineID);

  const handleClose = () => {
    dispatch(
      toggleModal({ deleteCartItemModal: { isOpen: false, data: null } }),
    );
  };

  const handleDeleteItem = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const response = await handleRemoveLineFromCart(
        IsCartOrderTypeRequired,
        data?.lineID!,
        locale,
      );

      if (response?.hasError) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        // const isTokenExpired = response?.errors?.find(
        //   (item) => item.Code === apiErrorCodes.tokenExpired,
        // );

        // if (isTokenExpired) {
        //   await clearServerCookie();

        //   window.location.replace(`/${locale}`);
        // }

        response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );

        return;
      }

      // Facebook pixels
      !!window.fbq &&
        fbq("track", "RemoveFromCart", {
          content_type: "product",
          content_ids: [deletedItem?.MenuItem?.NameUnique],
          contents: [
            {
              index: 1,
              id: deletedItem?.MenuItem?.NameUnique,
              item_name: deletedItem?.MenuItem?.Name,
              item_category: deletedItem?.MenuItem?.CategoryNameUnique,
              price: deletedItem?.MenuItem?.PriceAfterDiscount,
              discount: deletedItem?.MenuItem?.DiscountAmount,
              quantity: deletedItem?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
            },
          ],
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("RemoveFromCart", {
          contents: [
            {
              content_type: "product",
              content_id: deletedItem?.MenuItem?.NameUnique,
              content_name: deletedItem?.MenuItem?.Name,
              discount: deletedItem?.MenuItem?.DiscountAmount,
              content_category: deletedItem?.MenuItem?.CategoryNameUnique,
              value: deletedItem?.MenuItem?.PriceAfterDiscount,
              quantity: deletedItem?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
              description: "Product",
            },
          ],
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "remove_from_cart", {
          currency: CurrencyISOCode,
          value: deletedItem?.MenuItem?.PriceAfterDiscount,
          items: [
            {
              index: 1,
              item_id: deletedItem?.MenuItem?.NameUnique,
              item_name: deletedItem?.MenuItem?.Name,
              discount: deletedItem?.MenuItem?.DiscountAmount,
              item_category: deletedItem?.MenuItem?.CategoryNameUnique,
              price: deletedItem?.MenuItem?.PriceAfterDiscount,
              quantity: deletedItem?.MenuItem?.SelectedQuantity,
            },
          ],
        });

      // Snapchat event
      !!window.snaptr &&
        snaptr("track", "REMOVE_FROM_CART", {
          item_ids: [deletedItem?.MenuItem?.NameUnique],
          item_category: deletedItem?.MenuItem?.CategoryNameUnique,
          item_name: deletedItem?.MenuItem?.Name,
          price: deletedItem?.MenuItem?.PriceAfterDiscount,
          number_items: deletedItem?.MenuItem?.SelectedQuantity,
          currency: CurrencyISOCode,
          discount: deletedItem?.MenuItem?.DiscountAmount,
        });

      handleClose();
    } catch (e) {
      console.log("modal error", e);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("delete") + " " + deletedItem?.MenuItem?.Name} />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            {deletedItem?.MenuItem?.IconURL && (
              <NextImage
                src={deletedItem?.MenuItem?.IconURL}
                alt={deletedItem?.MenuItem?.Name}
                width={150}
                height={150}
                className="object-contain"
              />
            )}

            <DialogDescription className="max-w-xs px-6 text-lg font-semibold leading-tight">
              {t("confirmDeleteItemMsg")}
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

          <Button type="button" className="flex-1" onClick={handleDeleteItem}>
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
