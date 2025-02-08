import { StarIcon } from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";
// Types
import { UserDealsResponseProps } from "@/types/api";

type DashboardRewardsItemProps = {
  resources: {
    redeem: string;
    free: string;
  };
  data: UserDealsResponseProps;
  isAvailiable: boolean;
  handleRedeemDeal: (rewardsData: UserDealsResponseProps) => Promise<void>;
};

export default function DashboardRewardsItem(props: DashboardRewardsItemProps) {
  const { data, resources, isAvailiable, handleRedeemDeal } = props;

  return (
    <div
      className={cn(
        "flex-center group relative w-full flex-col overflow-hidden rounded-lg bg-white p-3 text-center shadow-lg hover:shadow-xl",
      )}
    >
      {!isAvailiable && (
        <div
          className="absolute inset-0 z-20 size-full cursor-pointer bg-white opacity-50"
          onClick={() => handleRedeemDeal(data)}
        />
      )}

      {!isAvailiable && (
        <img
          src="/images/icons/lock.svg"
          alt="lock"
          width={20}
          height={20}
          loading="lazy"
          className="absolute end-2 top-2 z-20 cursor-pointer object-contain"
          onClick={() => handleRedeemDeal(data)}
        />
      )}

      <div className="flex-center absolute start-2 top-2 gap-1 px-1 font-semibold text-alt">
        <span className="leading-none">{data?.Points}</span>
        <StarIcon className="size-4" />
      </div>

      <div className="flex-center relative z-10 after:absolute after:start-8 after:size-3/4 after:rounded-full after:bg-main">
        <img
          src={data?.IconURL ? data?.IconURL : "/images/reward-img.png"}
          alt={data?.Name?.trim()}
          width={96}
          height={96}
          className="smooth z-10 size-24 max-w-full object-contain md:size-28"
          loading="lazy"
        />
      </div>

      {data?.Title && (
        <p className="mt-1 line-clamp-1 text-2xl font-bold uppercase leading-none text-alt">
          {data?.Title}
        </p>
      )}

      <h3
        className="line-clamp-1 text-lg font-semibold capitalize group-hover:text-alt"
        title={data?.Name?.trim()}
      >
        {data?.Name?.trim()}
      </h3>

      <p className="line-clamp-3 h-12 text-xs leading-tight text-gray-500">
        {data?.Description?.trim()}
      </p>

      <Button
        type="button"
        className="mt-1 w-full"
        onClick={() => handleRedeemDeal(data)}
      >
        {resources["redeem"]}
      </Button>
    </div>
  );
}
