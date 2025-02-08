import cn from "@/utils/cn";
// Types
import { BillLineProps } from "@/types";
import { CartLineProps } from "@/types/api";

type BillCartItemProps = {
  data: CartLineProps | BillLineProps;
  currency: string;
  className?: string;
};

export default function BillCartItem(props: BillCartItemProps) {
  const { currency, data, className } = props;

  return (
    <div className={cn("my-2 w-full border-b-2 py-2", className)}>
      <div className="flex gap-2">
        <p className="flex-center size-8 shrink-0 rounded-full bg-gray-200 text-center text-xs font-semibold">
          X {data?.Quantity}
        </p>

        <div className="flex-grow">
          <h3 className="font-semibold capitalize">{data?.MenuItem?.Name}</h3>

          <span className="line-clamp-2 text-sm leading-tight text-gray-500">
            {data?.MenuItem?.CustomizationDescription
              ? data?.MenuItem?.CustomizationDescription
              : data?.MenuItem?.Description}
          </span>
        </div>

        <p className="flex shrink-0 font-semibold">
          {data?.SubTotal?.toFixed(2)} {currency}
        </p>
      </div>
    </div>
  );
}
