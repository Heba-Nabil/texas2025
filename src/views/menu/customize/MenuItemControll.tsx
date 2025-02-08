import { memo, useCallback, useEffect, useState } from "react";
import usePageModal from "@/hooks/usePageModal";
import useCart from "@/hooks/useCart";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import {
  isCustomizationValid,
  mapCartLineToMenuItem,
  refactorCartItem,
  refactorMenuItem,
} from "@/utils/menuCustomizeActions";
import PlusMinusItem from "@/components/items/PlusMinusItem";
import { Button } from "@/components/ui/button";
// Types
import { MenuItemPageResourcesProps } from "@/types/resources";
import { MealItemProps } from "@/types/api";

type MenuItemControllProps = {
  resources: MenuItemPageResourcesProps;
  price: number;
  data: MealItemProps;
  currency: string;
  CurrencyISOCode: string;
  cid: string | undefined;
  did: string | undefined;
  IsCartOrderTypeRequired: boolean;
  setCloneData: React.Dispatch<React.SetStateAction<MealItemProps>>;
  locale: string;
};

const MenuItemControll = (props: MenuItemControllProps) => {
  const {
    resources,
    price,
    data,
    cid,
    did,
    currency,
    CurrencyISOCode,
    IsCartOrderTypeRequired,
    setCloneData,
    locale,
  } = props;

  const { handleModalDismiss } = usePageModal();

  // Start of Cart Actions
  const {
    findByLineId,
    findDealById,
    getCustomizations,
    handleAddMenuItemToCart,
    handleEditCartItem,
    handleQuickUpdateCartItem,
  } = useCart();

  const itemToUpdate = did ? findDealById(did, cid!) : findByLineId(cid);

  const [rangeErrMessage, setRangeErrMessage] = useState("");

  useEffect(() => {
    if (itemToUpdate) {
      setCloneData(mapCartLineToMenuItem(itemToUpdate, data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemToUpdate]);

  const dispatch = useAppDispatch();

  // Increase Menu Item Quantity
  const handleIncreaseQty = () =>
    setCloneData((prev) => ({
      ...prev,
      SelectedQuantity: (prev.SelectedQuantity ?? 0) + 1,
    }));

  // Decrease Menu Item Quantity
  const handleDecreaseQty = () => {
    if ((data?.SelectedQuantity ?? 0) <= 1) return;

    setCloneData((prev) => ({
      ...prev,
      SelectedQuantity: (prev.SelectedQuantity ?? 0) - 1,
    }));
  };

  const handleMenuItemCartAction = useCallback(
    async (data: MealItemProps) => {
      setRangeErrMessage("");
      if (!data) return;

      const toaster = (await import("@/components/global/Toaster")).toaster;

      // Return toast error in case of any modifier group items not in the range
      const checkResult = isCustomizationValid(data);

      if (checkResult?.hasError) {
        const {
          data: { child, parent },
        } = checkResult;

        const parentMessage = `${parent?.Name} not in the allowed range (Min ${parent?.MinQuantity} Max ${parent?.MaxQuantity})`,
          childMessage = `${parent?.Name} - ${child?.Name} not in the allowed range (Min ${child?.MinQuantity} Max ${child?.MaxQuantity})`;

        const arParentMessage = `${parent?.Name} ليس في النطاق المسموح به (الحد الأدنى ${parent?.MinQuantity} الحد الأقصى ${parent?.MaxQuantity})`,
          arChildMessage = `${parent?.Name} - ${child?.Name} ليس في النطاق المسموح به (الحد الأدنى ${child?.MinQuantity} الحد الأقصى ${child?.MaxQuantity})`;

        const errorMessage = !!child
          ? locale === "ar"
            ? arChildMessage
            : childMessage
          : locale === "ar"
            ? arParentMessage
            : parentMessage;

        setRangeErrMessage(errorMessage);

        return toaster.error({
          title: resources["error"],
          message: errorMessage,
        });
      }

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      try {
        const refineData = refactorMenuItem(data);

        let response;

        if (!!itemToUpdate) {
          // Handle Edit Item Come From Cart
          response = await handleEditCartItem(
            IsCartOrderTypeRequired,
            cid!,
            locale,
            Object.assign(
              { SelectedQuantity: data?.SelectedQuantity },
              refineData,
            ),
            handleModalDismiss,
          );
        } else {
          // Check if there some customization in cart item for this menu item
          const customizations = getCustomizations(data.ID);
          if (!customizations || customizations?.length < 1) {
            // If no Customization => Add
            response = await handleAddMenuItemToCart(
              IsCartOrderTypeRequired,
              Object.assign(
                { SelectedQuantity: data?.SelectedQuantity },
                refineData,
              ),
              locale,
              handleModalDismiss,
            );
          } else {
            const _isEqual = (await import("lodash/isEqual")).default;

            const adjustMenuItemObject = refactorMenuItem(data);

            const matchedCartItemIndex = customizations?.findIndex((item) => {
              const adjustCartMenuItem = refactorCartItem(item.MenuItem);

              return _isEqual(adjustCartMenuItem, adjustMenuItemObject);
            });

            if (matchedCartItemIndex !== -1) {
              // If there is identical item update the quantity
              response = await handleQuickUpdateCartItem(
                IsCartOrderTypeRequired,
                customizations[matchedCartItemIndex]?.ID,
                customizations[matchedCartItemIndex]?.MenuItem?.ID,
                customizations[matchedCartItemIndex]?.MenuItem
                  ?.SelectedQuantity + (data?.SelectedQuantity ?? 0),
                locale,
                true,
                handleModalDismiss,
              );
            } else {
              response = await handleAddMenuItemToCart(
                IsCartOrderTypeRequired,
                Object.assign(
                  { SelectedQuantity: data?.SelectedQuantity },
                  refineData,
                ),
                locale,
                handleModalDismiss,
              );
            }
          }
        }

        if (response?.hasError) {
          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        // Facebook pixels
        !!window.fbq &&
          fbq("track", "AddToCart", {
            content_type: "product",
            content_ids: [data?.NameUnique],
            contents: [
              {
                index: 1,
                id: data?.NameUnique,
                item_name: data?.Name,
                item_category: data?.CategoryNameUnique,
                price: data?.PriceAfterDiscount,
                discount: data?.DiscountAmount,
                quantity: data?.SelectedQuantity,
                currency: CurrencyISOCode,
              },
            ],
          });

        // Tiktok pixels
        !!window.ttq &&
          ttq.track("AddToCart", {
            contents: [
              {
                content_type: "product",
                content_id: data?.NameUnique,
                content_name: data?.Name,
                discount: data?.DiscountAmount,
                content_category: data?.CategoryNameUnique,
                value: data?.PriceAfterDiscount,
                quantity: data?.SelectedQuantity,
                currency: CurrencyISOCode,
                description: "Product",
              },
            ],
          });

        // Google events
        !!window.gtag &&
          window.gtag("event", "add_to_cart", {
            currency: CurrencyISOCode,
            value: data?.PriceAfterDiscount,
            items: [
              {
                index: 1,
                item_id: data?.NameUnique,
                item_name: data?.Name,
                discount: data?.DiscountAmount,
                item_category: data?.CategoryNameUnique,
                price: data?.PriceAfterDiscount,
                quantity: data?.SelectedQuantity,
              },
            ],
          });

        // Snapchat event
        !!window.snaptr &&
          snaptr("track", "ADD_CART", {
            item_ids: [data?.NameUnique],
            item_category: data?.CategoryNameUnique,
            price: data?.PriceAfterDiscount,
            description: data?.Name,
            number_items: data?.SelectedQuantity,
            currency: CurrencyISOCode,
            discount: data?.DiscountAmount,
          });

        handleModalDismiss();
      } catch (error) {
        console.log("Err from customization page", (error as Error).message);
      } finally {
        dispatch(toggleModal({ loadingModal: { isOpen: false } }));
      }
    },
    [
      IsCartOrderTypeRequired,
      itemToUpdate,
      locale,
      resources,
      cid,
      dispatch,
      getCustomizations,
      handleAddMenuItemToCart,
      handleEditCartItem,
      handleModalDismiss,
      handleQuickUpdateCartItem,
      CurrencyISOCode,
    ],
  );

  return (
    <div className="bg-white p-4 md:rounded-b-3xl">
      {(data?.SelectedQuantity ?? 0) > 1 && (
        <p className="mb-1.5 flex items-center gap-1 text-sm text-gray-500">
          <img
            src="/images/icons/wonder-mark.svg"
            alt="wonder"
            width={16}
            height={16}
            className="shrink-0 object-contain"
          />

          {resources["anyUpdatesWillReflect"]}
        </p>
      )}

      {rangeErrMessage && (
        <p className="mb-1.5 text-sm text-alt">{rangeErrMessage}</p>
      )}

      <div className="flex items-center gap-6">
        {!did && (
          <PlusMinusItem
            className="w-[120px]"
            quantity={data?.SelectedQuantity ?? 0}
            minusProps={{
              className: "size-10",
              "aria-disabled": (data?.SelectedQuantity ?? 0) <= 1,
              onClick: handleDecreaseQty,
            }}
            plusProps={{
              className: "size-10",
              onClick: handleIncreaseQty,
            }}
          />
        )}

        <Button
          type="button"
          className="flex-grow justify-between"
          onClick={() => handleMenuItemCartAction(data)}
        >
          <span>
            {(price * (data?.SelectedQuantity ?? 0)).toFixed(2)} {currency}
          </span>

          <span>
            {!!itemToUpdate ? resources["update"] : resources["addToCart"]}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default memo(MenuItemControll);
