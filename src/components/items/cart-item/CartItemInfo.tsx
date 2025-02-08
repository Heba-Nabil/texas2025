import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import NextLink from "@/components/global/NextLink";
// Types
import { CartLineMenuItemProps } from "@/types/api";

type CartItemInfoProps = {
  data: {
    CartItemData: CartLineMenuItemProps;
    CategoryNameUnique: string;
    LineID: string;
    resources: {
      edit: string;
      customized: string;
    };
  };
};

const CartItemInfo = ({ data }: CartItemInfoProps) => {
  const { CartItemData, CategoryNameUnique, LineID, resources } = data;

  return (
    <div className="flex flex-col">
      <div className="relative mb-1">
        {CartItemData?.IsCustomizable ? (
          <NextLink
            href={`/menu/${CategoryNameUnique}/${CartItemData?.NameUnique}?cid=${LineID}`}
            className="flex w-fit"
            scroll={false}
          >
            <h3 className="smooth w-fit text-lg font-semibold capitalize text-dark hover:text-main group-hover:text-alt">
              {CartItemData?.Name}
            </h3>
          </NextLink>
        ) : (
          <h3 className="smooth text-lg font-semibold capitalize text-dark hover:text-main group-hover:text-alt">
            {CartItemData?.Name}
          </h3>
        )}

        {/* {CartItemData?.Calories && (
          <span className="block text-alt">{CartItemData?.Calories}</span>
        )} */}
      </div>

      <p className="line-clamp-2 leading-tight text-gray-500">
        {CartItemData?.CustomizationDescription ? (
          <>
            {/* <span className="text-alt">{resources["customized"]}: </span> */}

            {CartItemData?.CustomizationDescription}
          </>
        ) : (
          CartItemData?.Description
        )}
      </p>

      {CartItemData?.IsCustomizable && (
        <NextLink
          href={`/menu/${CategoryNameUnique}/${CartItemData?.NameUnique}?cid=${LineID}`}
          className="mt-auto flex w-fit items-center gap-2 pb-2 text-base font-medium capitalize text-alt"
          scroll={false}
        >
          {resources["edit"]}
          <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
        </NextLink>
      )}
    </div>
  );
};

export default CartItemInfo;
