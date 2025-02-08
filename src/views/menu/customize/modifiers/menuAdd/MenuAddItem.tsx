import { PlusIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";
import PlusMinusItem from "@/components/items/PlusMinusItem";
// Types
import { ModifierItemProps } from "@/types/api";
import { MenuItemPageResourcesProps } from "@/types/resources";

type MenuAddItemProps = {
  data: ModifierItemProps;
  resources: MenuItemPageResourcesProps;
  currency: string;
  remain: number;
  handleAddIncrease: (item: ModifierItemProps) => void;
  handleAddDecrease: (item: ModifierItemProps) => void;
  parentMinQty: number;
};

export default function MenuAddItem(props: MenuAddItemProps) {
  const {
    data,
    currency,
    resources,
    remain,
    handleAddIncrease,
    handleAddDecrease,
    parentMinQty,
  } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.ExtraPrice;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-between flex-grow gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            {hasDiscount && data?.IsDiscountViewPercentage && (
              <div className="flex-center relative top-1 z-10 gap-1 rounded bg-alt px-2 text-xs text-white">
                <img src="/images/icons/texas-star.svg" alt="off" />
                <span className="uppercase">
                  {data?.DiscountPercentage}% {resources["off"]}
                </span>
              </div>
            )}

            <div className="flex-center relative aspect-square overflow-hidden rounded-full bg-gray-100">
              <img
                src={data?.IconURL}
                alt={data?.Name}
                width={50}
                height={50}
                loading="lazy"
                className="aspect-square shrink-0 object-contain"
              />
            </div>
          </div>

          <div className="flex-grow">
            <h3 className="font-semibold capitalize">{data?.Name}</h3>

            <span
              className={cn(
                "flex items-center gap-1 text-xs capitalize text-gray-500",
                {
                  "text-alt":
                    (data?.SelectedQuantity ?? 0) >= data?.MaxQuantity,
                },
              )}
            >
              <img
                src="/images/icons/wonder-mark.svg"
                alt="min max quantity"
                width={12}
                height={12}
                loading="lazy"
              />
              {`${resources["min"]} ${data?.MinQuantity}, ${resources["max"]} ${data?.MaxQuantity}`}
            </span>
          </div>
        </div>

        {/* {data?.PriceAfterDiscount > 0 &&
          (data?.SelectedQuantity ?? 0) > (data?.DefaultQuantity ?? 0) &&
          parentMinQty < 1 && (
            <p>
              <span className="flex items-center gap-0.5 font-bold">
                <PlusIcon className="size-4" />{" "}
                {(
                  data?.PriceAfterDiscount *
                  ((data?.SelectedQuantity ?? 0) - (data?.DefaultQuantity ?? 0))
                ).toFixed(2)}{" "}
                <span className="text-sm font-normal">{currency}</span>
              </span>
            </p>
          )} */}
      </div>

      <div className="flex-end w-[120px] px-2">
        {(data?.SelectedQuantity ?? 0) > 0 ? (
          <PlusMinusItem
            quantity={data?.SelectedQuantity ?? 0}
            minusProps={{
              className: "size-9",
              "aria-disabled":
                (data?.SelectedQuantity ?? 0) <= data?.MinQuantity,
              onClick: () => handleAddDecrease(data),
            }}
            plusProps={{
              className: "size-9",
              "aria-disabled":
                (data?.SelectedQuantity ?? 0) >= data?.MaxQuantity ||
                remain <= 0,
              onClick: () => handleAddIncrease(data),
            }}
          />
        ) : (
          <Button
            type="button"
            className="w-full"
            disabled={remain <= 0}
            onClick={() => handleAddIncrease(data)}
          >
            <PlusIcon className="size-4 shrink-0" /> {resources["add"]}
          </Button>
        )}
      </div>
    </div>
  );
}
