import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";
// Types
import { UserDealsResponseProps } from "@/types/api";
import { DealsPageResourcesProps } from "@/types/resources";

type DealItemProps = {
  resources: DealsPageResourcesProps;
  data: UserDealsResponseProps;
  currentDeal: string;
  handleAddDealButton: (dealData: UserDealsResponseProps) => Promise<void>;
  removeDealFromClient: (id: string) => Promise<void>;
};

export default function DealItem(props: DealItemProps) {
  const {
    data,
    resources,
    currentDeal,
    handleAddDealButton,
    removeDealFromClient,
  } = props;

  const isThisDealTheCurrentDeal = currentDeal === data?.ID;

  return (
    <div className="flex-center group relative w-full flex-col rounded-lg bg-white p-3 text-center shadow-lg hover:shadow-xl">
      {!isThisDealTheCurrentDeal && currentDeal && (
        <div
          className="absolute inset-0 z-20 cursor-pointer bg-white opacity-50"
          onClick={() => handleAddDealButton(data)}
        />
      )}

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

      {isThisDealTheCurrentDeal ? (
        <Button
          type="button"
          className="mt-1 w-full"
          variant="secondary"
          onClick={() => removeDealFromClient(data?.ID)}
        >
          {resources["removeFromCart"]}
        </Button>
      ) : (
        <Button
          type="button"
          className="mt-1 w-full"
          onClick={() => handleAddDealButton(data)}
        >
          {resources["addToCart"]}
        </Button>
      )}
    </div>
  );
}
