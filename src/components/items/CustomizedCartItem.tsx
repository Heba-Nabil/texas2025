"use client";

import { MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { getCartItemDetails } from "@/utils/menuCustomizeActions";
import PlusMinusItem from "./PlusMinusItem";
// Types
import { CartLineProps } from "@/types/api";

type CustomizedCartItemProps = {
  data: CartLineProps;
  currency: string;
  handleQtyChange: (isIncrease: boolean, line: CartLineProps) => Promise<void>;
};

export default function CustomizedCartItem(props: CustomizedCartItemProps) {
  const { data, currency, handleQtyChange } = props;

  const menuItem = data?.MenuItem;

  const description = getCartItemDetails(menuItem?.ModifierGroups);

  return (
    <>
      <div className="flex-between flex-grow gap-3">
        <div className="flex-grow">
          <h3 className="font-semibold capitalize">{menuItem?.Name}</h3>

          {description?.trim() && (
            <p className="text-sm text-gray-600">{description?.trim()}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col text-center">
          <span className="shrink-0 font-bold !leading-none">
            {data?.SubTotalAfterDiscount?.toFixed(2)}{" "}
            <span className="text-sm font-normal">{currency}</span>
          </span>

          {data?.SubTotalAfterDiscount !== data?.SubTotal && (
            <span className="block text-xs text-gray-500 line-through">
              {data?.SubTotal?.toFixed(2)} {currency}
            </span>
          )}
        </div>
      </div>

      <PlusMinusItem
        className="w-[120px] shrink-0"
        quantity={data?.Quantity}
        minusIcon={
          data?.Quantity > 1 ? (
            <MinusIcon className="size-5 shrink-0" />
          ) : (
            <TrashIcon className="size-5 shrink-0" />
          )
        }
        minusProps={{
          onClick: () => handleQtyChange(false, data),
        }}
        plusProps={{
          onClick: () => handleQtyChange(true, data),
        }}
      />
    </>
  );
}
