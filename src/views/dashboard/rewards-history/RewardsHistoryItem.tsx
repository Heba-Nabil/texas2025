import cn from "@/utils/cn";
import { formatDateInMonthDayTime } from "@/utils";
import CollectedPointsIcon from "@/components/icons/CollectedPointsIcon";
import ConsumedPointsIcon from "@/components/icons/ConsumedPointsIcon";
// Types
import { UserLoyaltyHistoryResponseProps } from "@/types/api";
import { LoyaltyHistoryTypeIdEnum } from "@/types/enums";

type RewardsHistoryItemProps = {
  locale: string;
  resources: {
    expired: string;
    expiredAt: string;
  };
  data: UserLoyaltyHistoryResponseProps;
  className?: string;
};

export default function RewardsHistoryItem(props: RewardsHistoryItemProps) {
  const { resources, data, locale, className } = props;

  const isCollected =
    data?.ReferenceTypeID === LoyaltyHistoryTypeIdEnum?.Collected;
  const isConsumed =
    data?.ReferenceTypeID === LoyaltyHistoryTypeIdEnum?.Consumed;
  const isExpired = data?.ReferenceTypeID === LoyaltyHistoryTypeIdEnum?.Expired;

  return (
    <div
      className={cn(
        "flex-between relative w-full gap-3 border-b border-gray-200 px-4 py-3",
        className,
      )}
    >
      <div className="relative flex items-center gap-4">
        {isCollected && <CollectedPointsIcon className="size-5 text-main" />}
        {(isConsumed || isExpired) && (
          <ConsumedPointsIcon className="size-5 text-alt" />
        )}
        <div>
          <h2 className="text-xl font-bold uppercase">
            {data?.RefernceNumber}
          </h2>

          {data?.ExpiryDate && (
            <p className="mb-0 text-sm">
              {resources["expiredAt"]}:{" "}
              {formatDateInMonthDayTime(data?.ExpiryDate, locale)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5">
        {isExpired && (
          <span className="rounded-sm bg-red-300 px-2 py-1 text-[11px] text-alt">
            {resources["expired"]}
          </span>
        )}
        <p className="font-semibold">
          {data?.Points > 0
            ? isCollected
              ? "+"
              : isExpired || isConsumed
                ? "-"
                : ""
            : ""}{" "}
          {data?.Points}
        </p>
      </div>
    </div>
  );
}
