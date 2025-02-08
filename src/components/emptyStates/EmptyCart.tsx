import cn from "@/utils/cn";

type EmptyCartProps = {
  resources: {
    cartEmpty: string;
    cartEmptyDesc: string;
  };
  locale: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function EmptyCart(props: EmptyCartProps) {
  const { resources, className, locale, ...rest } = props;

  return (
    <div
      className={cn("flex-center flex-col gap-3 p-10 text-center", className)}
      {...rest}
    >
      <div>
        <img
          src={
            locale === "ar"
              ? "/images/icons/emptyCart-ar.svg"
              : "/images/icons/emptyCart.svg"
          }
          width={500}
          height={500}
          alt="empty cart"
          className="aspect-square max-w-full object-contain"
          loading="lazy"
        />
      </div>

      <h4 className="text-2xl font-bold capitalize">
        {resources["cartEmpty"]}
      </h4>

      <p className="text-base capitalize">{resources["cartEmptyDesc"]}</p>
    </div>
  );
}
