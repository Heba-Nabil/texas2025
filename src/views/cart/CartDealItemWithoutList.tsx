import { Button } from "@/components/ui/button";
import DeleteIcon from "@/components/icons/DeleteIcon";
// Types
import { UserDealsResponseProps } from "@/types/api";

type CartDealItemWithoutListProps = {
  data: UserDealsResponseProps;
  resources: { removeDeal: string };
  showDeleteButton: boolean;
  removeDealFromClient: (id: string) => Promise<void>;
};

export default function CartDealItemWithoutList(
  props: CartDealItemWithoutListProps,
) {
  const { data, showDeleteButton, resources, removeDealFromClient } = props;

  return (
    <div className="flex w-full justify-between gap-3 rounded-lg bg-white p-3 shadow">
      <div className="flex gap-3">
        <img
          src={data?.IconURL ? data?.IconURL : "/images/reward-img.png"}
          alt={data?.Name?.trim()}
          width={70}
          height={70}
          className="size-[70px] shrink-0 rounded-full bg-main object-contain"
          loading="lazy"
        />

        <div>
          <h3 className="text-lg font-semibold capitalize leading-tight">
            {data?.Name?.trim()}
          </h3>

          <p className="text-sm text-gray-500">{data?.Description?.trim()}</p>
        </div>
      </div>

      {showDeleteButton && (
        <Button
          variant="link"
          className="h-auto self-end p-0 text-sm font-normal hover:text-alt"
          onClick={() => removeDealFromClient(data?.ID)}
        >
          {resources["removeDeal"]}
          <DeleteIcon className="size-3" />
        </Button>
      )}
    </div>
  );
}
