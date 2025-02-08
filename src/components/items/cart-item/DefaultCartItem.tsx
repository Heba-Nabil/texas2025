"use client";

import { MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import useCart from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import CartItemImage from "./CartItemImage";
import CartItemInfo from "./CartItemInfo";
import PlusMinusItem from "../PlusMinusItem";
// Types
import { CartLineProps } from "@/types/api";

type DefaultCartItemProps = {
  data: CartLineProps;
  currency: string;
  IsCartOrderTypeRequired: boolean;
  resources: {
    edit: string;
    customized: string;
  };
  locale: string;
};

type QuantityChangeType = "increase" | "decrease";

export default function DefaultCartItem(props: DefaultCartItemProps) {
  const { data, currency, IsCartOrderTypeRequired, resources, locale } = props;

  const {
    selectedOrderTypeId,
    orderLocation: { storeId },
  } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  const { handleQuickUpdateCartItem } = useCart();

  const handleProductQuantityChange = async (
    data: CartLineProps,
    type: QuantityChangeType,
  ) => {

    const isIncrease = type === "increase";
    
    const newQuantity =
      type === "increase" ? data?.Quantity + 1 : data?.Quantity - 1;

    if (type === "decrease" && newQuantity < 1) {
      return dispatch(
        toggleModal({
          deleteCartItemModal: {
            isOpen: true,
            data: {
              orderTypeId: selectedOrderTypeId,
              storeId,
              lineID: data.ID,
            },
          },
        }),
      );
    }

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await handleQuickUpdateCartItem(
        IsCartOrderTypeRequired,
        data?.ID,
        data?.MenuItem?.ID,
        newQuantity,
        locale,
        isIncrease
      );

      const toaster = (await import("@/components/global/Toaster")).toaster;

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
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

  return (
    <div className="w-full">
      <div className="flex py-2">
        <div className="smooth flex w-full shrink-0 flex-row overflow-hidden rounded-[7px] bg-white shadow-lg hover:shadow-xl md:rounded-[10px]">
          <CartItemImage
            data={{
              CategoryNameUnique: data?.MenuItem?.CategoryNameUnique,
              LineID: data?.ID,
              IsCustomizable: data?.MenuItem?.IsCustomizable,
              ID: data?.MenuItem?.ID,
              Name: data?.MenuItem?.Name,
              NameUnique: data?.MenuItem?.NameUnique,
              IconURL: data?.MenuItem?.IconURL,
            }}
          />

          <div className="flex flex-grow flex-col p-2 @md:p-3">
            <CartItemInfo
              data={{
                CartItemData: data?.MenuItem,
                CategoryNameUnique: data?.MenuItem?.CategoryNameUnique,
                LineID: data?.ID,
                resources,
              }}
            />

            {/* Add To Cart Btn */}
            <div className="flex-between mt-auto gap-3 py-1">
              <div className="flex flex-wrap items-center gap-x-1">
                <strong className="text-lg font-bold text-dark">
                  {data?.SubTotalAfterDiscount?.toFixed(2)} {currency}
                </strong>

                {data?.SubTotalAfterDiscount !== data?.SubTotal && (
                  <span className="text-xs text-gray-500 line-through">
                    {data?.SubTotal?.toFixed(2)} {currency}
                  </span>
                )}
              </div>

              <PlusMinusItem
                className="w-28 shrink-0 sm:w-[120px]"
                quantity={data?.Quantity}
                minusIcon={
                  data?.Quantity > 1 ? (
                    <MinusIcon className="size-5 shrink-0" />
                  ) : (
                    <TrashIcon className="size-5 shrink-0" />
                  )
                }
                minusProps={{
                  onClick: () => handleProductQuantityChange(data, "decrease"),
                }}
                plusProps={{
                  onClick: () => handleProductQuantityChange(data, "increase"),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
