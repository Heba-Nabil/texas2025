// Types
import { CartLineProps } from "@/types/api";

type CheckoutCartItemProps = {
  data: CartLineProps;
  currency: string;
};

export default function CheckoutCartItem(props: CheckoutCartItemProps) {
  const { data, currency } = props;

  return (
    <div className="my-2 w-full border-b-2 py-2">
      <div className="flex gap-3">
        <p className="flex-center h-10 w-10 shrink-0 rounded-full bg-gray-200 text-center font-semibold">
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
