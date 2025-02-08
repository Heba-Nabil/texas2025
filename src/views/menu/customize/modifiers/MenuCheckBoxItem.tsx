import { PlusIcon } from "@heroicons/react/24/solid";
import { Checkbox } from "@/components/ui/checkbox";
// Types
import { ModifierItemProps } from "@/types/api";

type MenuCheckBoxItemProps = {
  data: ModifierItemProps;
  currency: string;
  disabled: boolean;
  resources: {
    off: string;
  };
  handleChange: (checked: boolean) => void;
};

export default function MenuCheckBoxItem(props: MenuCheckBoxItemProps) {
  const { currency, data, disabled, resources, handleChange } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.ExtraPrice;

  return (
    <label className="flex items-center gap-3 py-1" htmlFor={data?.ID}>
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

          <h3 className="flex-grow font-semibold capitalize">{data?.Name}</h3>
        </div>

        {data?.PriceAfterDiscount > 0 &&
          (data?.SelectedQuantity ?? 0) > data?.DefaultQuantity && (
            <span className="flex items-center gap-0.5 font-bold">
              <PlusIcon className="size-4" /> {data?.PriceAfterDiscount}{" "}
              <span className="text-sm font-normal">{currency}</span>
            </span>
          )}
      </div>

      <div className="flex-end w-[120px] px-2">
        <Checkbox
          id={data?.ID}
          checked={(data?.SelectedQuantity ?? 0) > 0}
          onCheckedChange={handleChange}
          disabled={disabled}
        />
      </div>
    </label>
  );
}
