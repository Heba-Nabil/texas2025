import useCart from "@/hooks/useCart";
import cn from "@/utils/cn";
import NextLink from "@/components/global/NextLink";

type CartIconProps = {
  className?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
  iconSrc?: string;
  label?: string;
};

export default function CartIcon(props: CartIconProps) {
  const {
    className,
    iconWrapperClassName,
    iconClassName,
    iconSrc = "/images/icons/cart.svg",
    label,
  } = props;

  const { cartItemsQty } = useCart();

  return (
    <NextLink
      href="/cart"
      className={cn(
        "smooth mt-2 flex flex-col items-center capitalize hover:text-main",
        className,
      )}
    >
      <span className={cn("relative block shrink-0", iconWrapperClassName)}>
        <img
          src={iconSrc}
          alt="cart"
          height={30}
          loading="lazy"
          className={iconClassName}
        />
        <span className="flex-center absolute -top-2 size-5 rounded-full bg-alt text-center text-xs text-white ltr:right-4 rtl:left-4">
          {cartItemsQty}
        </span>
      </span>
      {label}
    </NextLink>
  );
}
