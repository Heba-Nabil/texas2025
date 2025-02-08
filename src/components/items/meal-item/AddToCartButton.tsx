"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "@/navigation";
import useCart from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { Button } from "@/components/ui/button";
import PlusMinusItem from "@/components/items/PlusMinusItem";
// Types
import { CategoryItemProps } from "@/types/api";
import { DefaultMealItemResourcesProps } from "@/types/resources";

type AddToCartButtonProps = {
  className?: string;
  resources: DefaultMealItemResourcesProps;
  data: CategoryItemProps;
  IsCartOrderTypeRequired: boolean;
  locale: string;
  currency: string;
};

export default function AddToCartButton(props: AddToCartButtonProps) {
  const {
    className,
    resources,
    data,
    IsCartOrderTypeRequired,
    locale,
    currency,
  } = props;

  const router = useRouter();

  const { getCustomizations, handleQuickAdd, handleQuickUpdateCartItem } =
    useCart();

  const itemCustomizations = getCustomizations(data?.ID),
    quantity = itemCustomizations?.reduce((acc, cur) => {
      acc += cur.Quantity;

      return acc;
    }, 0);

  const { isLoggedIn } = useAppSelector(getClientSession);

  const {
    selectedOrderTypeId,
    orderLocation: { storeId },
  } = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  // Handle Quick Add Function
  const handleAddToCart = async () => {
    if (!isLoggedIn)
      return router.push("/login", {
        scroll: false,
      });

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const response = await handleQuickAdd(
        IsCartOrderTypeRequired,
        data?.ID,
        1,
        locale,
      );

      if (response?.hasError) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        response?.errors?.forEach((item) =>
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
              quantity: 1,
              currency: currency,
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
              quantity: 1,
              currency: currency,
              description: "Product",
            },
          ],
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "add_to_cart", {
          currency: currency,
          value: data?.PriceAfterDiscount,
          items: [
            {
              index: 1,
              item_id: data?.NameUnique,
              item_name: data?.Name,
              discount: data?.DiscountAmount,
              item_category: data?.CategoryNameUnique,
              price: data?.PriceAfterDiscount,
              quantity: 1,
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
          number_items: 1,
          currency: currency,
          discount: data?.DiscountAmount,
        });
    } catch (error) {
      console.log("Err from customization page", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  // Handle Update Quantity
  const handleUpdateQty = async (isIncrease: boolean) => {
    // Open Customizations Modal in case of multiple customizations for that item
    if (itemCustomizations?.length > 1) {
      return dispatch(
        toggleModal({
          menuItemCustomizationsModal: {
            isOpen: true,
            data: {
              id: data?.ID,
              menuItemNameUnique: data?.NameUnique,
              categoryNameUnique: data?.CategoryNameUnique,
            },
          },
        }),
      );
    }

    const line = itemCustomizations[0];

    if (line) {
      if (!isIncrease && line.Quantity <= 1) {
        return dispatch(
          toggleModal({
            deleteCartItemModal: {
              isOpen: true,
              data: {
                orderTypeId: selectedOrderTypeId,
                storeId,
                lineID: line.ID,
              },
            },
          }),
        );
      }

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
          response = await handleQuickUpdateCartItem(
            IsCartOrderTypeRequired,
            line.ID,
            line.MenuItem.ID,
            line.Quantity - 1,
            locale,
            isIncrease,
          );
        }

        if (response?.hasError) {
          const toaster = (await import("@/components/global/Toaster")).toaster;

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
    }
  };

  return (
    <>
      {quantity < 1 ? (
        <Button type="button" className={className} onClick={handleAddToCart}>
          <PlusIcon className="size-4 shrink-0" />
          {resources["addToCart"]}
        </Button>
      ) : (
        <PlusMinusItem
          quantity={quantity}
          minusIcon={
            quantity > 1 ? (
              <MinusIcon className="size-5 shrink-0" />
            ) : (
              <TrashIcon className="size-5 shrink-0" />
            )
          }
          minusProps={{
            className: "size-9 @sm:size-10",
            onClick: () => handleUpdateQty(false),
          }}
          plusProps={{
            className: "size-9 @sm:size-10",
            onClick: () => handleUpdateQty(true),
          }}
        />
      )}
    </>
  );
}
