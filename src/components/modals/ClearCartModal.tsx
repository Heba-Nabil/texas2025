"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { initializeCartThunk } from "@/store/features/cart/cartThunk";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toaster } from "../global/Toaster";
import { useData } from "@/providers/DataProvider";
import { apiErrorCodes } from "@/utils/constants";
import { clearServerCookie } from "@/server/actions/clearCookies";
// Types
import {
  facebookAnalyticItems,
  googleAnalyticItems,
  tiktokAnalyticItems,
} from "@/types/analytics";

export default function ClearCartModal() {
  const t = useTranslations();
  const locale = useLocale();

  const {
    clearCartModal: { isOpen, data, cb },
  } = useAppSelector(getModals);

  const cartData = useAppSelector((state) => state.cart);
  const {
    Data: { CurrencyName, CurrencyISOCode },
  } = useData();

  const dispatch = useAppDispatch();

  // Facebook analytics items
  const facebookMenuItems: facebookAnalyticItems = cartData?.Lines?.map(
    (item, index) => ({
      index: index,
      id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      item_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }),
  );

  // Tiktok analytics items
  const tiktokMenuItems: tiktokAnalyticItems = cartData?.Lines?.map(
    (item, index) => ({
      index: index,
      content_id: item?.MenuItem?.NameUnique,
      content_name: item?.MenuItem?.Name,
      content_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      value: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
      content_type: "product",
      description: "Product",
    }),
  );

  // Google analytics items
  const googleMenuItems: googleAnalyticItems = cartData?.Lines?.map(
    (item, index) => ({
      index: index,
      item_id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      item_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }),
  );

  const facebookContentID = cartData?.Lines?.map(
    (item) => item?.MenuItem?.NameUnique,
  );

  const handleClose = () => {
    dispatch(
      toggleModal({ clearCartModal: { isOpen: false, cb: null, data: null } }),
    );
  };

  const handleClearCart = async () => {
    try {
      // Initialize Cart
      const initializeCartResponse = await dispatch(
        initializeCartThunk({
          locale,
          OrderTypeID: data?.orderTypeId,
          StoreID: data?.storeId,
          CityID: data?.cityId,
          AddressID: data?.addressId,
          AreaID: data?.areaId,
          Block: data?.block,
          Street: data?.street,
          Building: data?.building,
          Floor: data?.floor,
          Apartment: data?.apartment,
          Landmark: data?.landmark,
          // Instructions: data?.instructions,
          Latitude: data?.lat,
          Longitude: data?.lng,
        }),
      ).unwrap();

      if (initializeCartResponse?.hasError) {
        const isTokenExpired = initializeCartResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        initializeCartResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
        return handleClose();
      }

      // Facebook pixels
      !!window.fbq &&
        fbq("track", "RemoveFromCart", {
          content_type: "product",
          content_ids: facebookContentID,
          contents: facebookMenuItems,
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("RemoveFromCart", {
          contents: tiktokMenuItems,
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "remove_from_cart", {
          currency: CurrencyISOCode,
          value: cartData?.Total,
          items: googleMenuItems,
        });

      // Snapchat events
      !!window.snaptr &&
        snaptr("track", "REMOVE_FROM_CART", {
          item_ids: cartData?.Lines?.map((item) => item?.MenuItem?.NameUnique),
          item_category: cartData?.Lines?.map(
            (item) => item?.MenuItem?.CategoryNameUnique,
          ),
          price: cartData?.Lines?.reduce(
            (total, item) => total + item?.MenuItem?.PriceAfterDiscount,
            0,
          ),
          item_name: cartData?.Lines?.map((item) => item?.MenuItem?.Name),
          number_items: cartData?.Lines?.reduce(
            (total, item) => total + item?.MenuItem?.SelectedQuantity,
            0,
          ),
          currency: CurrencyISOCode,
          discount: cartData?.Lines?.reduce(
            (total, item) => total + item?.MenuItem?.DiscountAmount,
            0,
          ),
        });

      cb && cb();

      handleClose();
    } catch (error) {
      console.log("Error from create cart", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("clearCart")} />

        <DialogContentWrapper>
          <div className="flex-center w-full flex-col gap-5 text-center">
            <img
              src={
                locale === "ar"
                  ? "/images/icons/emptyCart-ar.svg"
                  : "/images/icons/emptyCart.svg"
              }
              width={200}
              height={200}
              alt="empty cart"
              loading="lazy"
              className="max-w-full object-contain"
            />

            <DialogDescription className="max-w-xs text-lg font-semibold leading-tight">
              {data?.message ? data?.message : t("confirmClearCartMessage")}
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

          <Button type="button" className="flex-1" onClick={handleClearCart}>
            {t("clearCart")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
