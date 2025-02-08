import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";

type SummaryButtonProps = {
  className?: string;
  quantity: number;
  resources: {
    item: string;
    items: string;
  };
  price: number;
  currency: string;
  label: string;
  isExceedMinOrderValue?: boolean;
  isExceedMinOrderValueMessage?: string;
  promoCode?: string | null;
  hasDeal?: boolean;
  locale: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function SummaryButton(props: SummaryButtonProps) {
  const {
    className,
    quantity,
    resources,
    price,
    currency,
    label,
    promoCode,
    isExceedMinOrderValue,
    isExceedMinOrderValueMessage,
    hasDeal,
    locale,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 w-full gap-3 border-t bg-white/80 p-3 shadow backdrop-blur lg:relative lg:p-5",
        className,
      )}
    >
      {!isExceedMinOrderValue && !promoCode && !hasDeal && (
        <p className="mb-1 text-sm text-alt">{isExceedMinOrderValueMessage}</p>
      )}

      <div className="flex-between gap-2">
        <div className="flex shrink-0 items-center gap-2">
          <img
            src={
              locale === "ar"
                ? "/images/icons/emptyCart-ar.svg"
                : "/images/icons/cart.svg"
            }
            alt="cart"
            width={30}
            height={30}
            loading="lazy"
            className="aspect-square object-contain"
          />

          <span className="capitalize">
            {quantity} {quantity > 1 ? resources["items"] : resources["item"]}
          </span>
        </div>

        <Button className="w-3/4 justify-between" {...rest}>
          <span>
            {price?.toFixed(2)} {currency}
          </span>
          <span>{label}</span>
        </Button>
      </div>
    </div>
  );
}
