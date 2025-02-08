type MenuItemInfoProps = {
  data: {
    Name: string;
    Description: string;
    Calories: string | null;
    currency: string;
    PriceAfterDiscount: number;
    Price: number;
    DiscountAmount: number;
    DiscountPercentage: number;
    IsDiscountViewPercentage: boolean;
  };
  resources: {
    kcal: string;
    off: string;
  };
};

export default function MenuItemInfo(props: MenuItemInfoProps) {
  const { data, resources } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.Price;

  return (
    <div className="mb-3">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold capitalize">{data?.Name}</h1>

        {data?.Calories?.trim() && (
          <span className="flex-center gap-1 px-3">
            <img
              src="/images/icons/calories.svg"
              alt="calories"
              width="16"
              height="16"
              className="w-4 object-contain"
              loading="lazy"
            />
            {data?.Calories} {resources["kcal"]}
          </span>
        )}

        {hasDiscount && data?.IsDiscountViewPercentage && (
          <div className="flex-center shrink-0 gap-1 rounded-lg bg-alt px-3 py-0.5 text-sm text-white">
            <img src="/images/icons/texas-star.svg" alt="off" />
            <span className="uppercase">
              {data?.DiscountPercentage}% {resources["off"]}
            </span>
          </div>
        )}
      </div>

      <p className="font-bold text-alt">
        {data?.PriceAfterDiscount?.toFixed(2)} {data?.currency}
        {hasDiscount && (
          <span className="mx-2 text-sm font-normal text-gray-500 line-through">
            {data?.Price?.toFixed(2)} {data?.currency}
          </span>
        )}
      </p>

      {data?.Description?.trim() && (
        <p className="text-sm leading-tight text-gray-500">
          {data?.Description}
        </p>
      )}
    </div>
  );
}
