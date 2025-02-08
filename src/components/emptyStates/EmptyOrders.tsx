import { Button } from "@/components/ui/button";
import NextLink from "@/components/global/NextLink";
import { useLocale } from "next-intl";

type EmptyOrdersProps = {
  resources: { orderNow: string; noOrdersYet: string };
};

export default function EmptyOrders({ resources }: EmptyOrdersProps) {
  const locale = useLocale();
  
  return (
    <div className="flex-center flex-col gap-3 p-4 text-center">
      <div>
        <img
          src={
            locale === "ar"
              ? "/images/icons/emptyCart-ar.svg"
              : "/images/icons/emptyCart.svg"
          }
          width={250}
          alt="empty orders"
          className="max-w-full object-contain"
          loading="lazy"
        />
      </div>

      <p className="block w-full text-center text-2xl font-bold capitalize text-main">
        {resources["noOrdersYet"]}
      </p>

      <div className="flex-between gap-3 pt-3">
        <Button asChild>
          <NextLink href="/menu">{resources["orderNow"]}</NextLink>
        </Button>
      </div>
    </div>
  );
}
