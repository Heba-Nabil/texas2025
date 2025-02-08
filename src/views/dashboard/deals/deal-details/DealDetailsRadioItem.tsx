import cn from "@/utils/cn";
// Types
import { UserSingleDealListDetailsProps } from "@/types/api";
import { Radio } from "@/components/ui/radio";

type DealDetailsRadioItemProps = {
  data: UserSingleDealListDetailsProps;
  isLast: boolean;
  currency: string;
  name: string;
  resources: {
    free: string;
  };
  handleChange: () => void;
};

export default function DealDetailsRadioItem(props: DealDetailsRadioItemProps) {
  const { data, isLast, currency, name, resources, handleChange } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.Price;

  return (
    <label
      className={cn("flex cursor-pointer items-center gap-3 py-3", {
        "border-b border-gray-100": !isLast,
      })}
      htmlFor={data?.ID}
    >
      <div className="flex basis-2/3 items-center gap-2">
        <div className="relative">
          <div className="flex-center relative aspect-square overflow-hidden rounded-full bg-gray-100">
            <img
              src={data?.IconURL}
              alt={data?.MenuItemName?.trim()}
              width={50}
              height={50}
              loading="lazy"
              className="aspect-square shrink-0 object-contain"
            />
          </div>
        </div>

        <div className="flex-grow">
          <h2 className="font-semibold capitalize">
            {data?.MenuItemName?.trim()}
          </h2>

          <p className="text-sm text-gray-500">
            {data?.MenuItemDescription?.trim()}
          </p>
        </div>
      </div>

      <div className="flex-grow">
        {(data?.SelectedQuantity ?? 0) > 0 && (
          <p className="w-max font-bold">
            {data?.PriceAfterDiscount?.toFixed(2)} {currency}
            {hasDiscount && (
              <span className="ms-2 text-sm font-normal text-gray-500 line-through">
                {data?.Price?.toFixed(2)} {currency}
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex-end px-2">
        <Radio
          name={name}
          id={data?.ID}
          checked={(data?.SelectedQuantity ?? 0) > 0}
          onChange={handleChange}
        />
      </div>
    </label>
  );
}
