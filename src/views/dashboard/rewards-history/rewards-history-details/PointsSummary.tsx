import cn from "@/utils/cn";
import { rewardTabs } from "@/utils/constants";
import { formatPointsInK } from "@/utils";
import CollectedPointsIcon from "@/components/icons/CollectedPointsIcon";
import ConsumedPointsIcon from "@/components/icons/ConsumedPointsIcon";
// Types
import { RewardsHistoryTabs } from "@/types";
import { RewardsHistoryPageResourcesProps } from "@/types/resources";

type PointsSummaryProps = {
  resources: RewardsHistoryPageResourcesProps;
  tabs: RewardsHistoryTabs[];
  totalPoints: number;
  collectedPoints: number;
  consumedPoints: number;
};

export default function PointsSummary(props: PointsSummaryProps) {
  const { resources, tabs, totalPoints, collectedPoints, consumedPoints } =
    props;

  return (
    <div className="flex justify-center gap-1 border-b border-gray-200 pb-4 text-center sm:gap-2 md:gap-4">
      {tabs?.map((item, index) => (
        <div className="flex-1" key={index}>
          <h2
            className={cn(
              "mb-2 flex-grow font-biker text-lg font-bold capitalize sm:text-xl",
              { "text-main": item?.id === rewardTabs?.COLLECTED },
              { "text-alt": item?.id === rewardTabs?.CONSUMED },
            )}
          >
            {item?.id === "all" ? resources["current"] : item?.label}{" "}
          </h2>

          <div
            className={cn(
              "flex-center gap-1 rounded-lg bg-dark px-2 py-1 text-center sm:py-2 md:gap-5",
              { "bg-dark text-white": item?.id === "all" },
              { "bg-main": item?.id === rewardTabs?.COLLECTED },
              { "bg-alt text-white": item?.id === rewardTabs?.CONSUMED },
            )}
          >
            {item?.id === rewardTabs?.ALL && (
              <img
                src="/images/rewards/all.svg"
                width={20}
                height={20}
                alt="All points"
                loading="lazy"
                className="size-3 shrink-0 object-contain sm:size-5"
              />
            )}
            {item?.id === rewardTabs?.COLLECTED && (
              <CollectedPointsIcon className="size-3 shrink-0 sm:size-5" />
            )}
            {item?.id === rewardTabs?.CONSUMED && (
              <ConsumedPointsIcon className="size-3 shrink-0 sm:size-5" />
            )}

            <span className="whitespace-nowrap text-sm font-semibold sm:text-lg md:text-2xl">
              {item?.id === rewardTabs?.ALL && formatPointsInK(totalPoints)}
              {item?.id === rewardTabs?.COLLECTED &&
                formatPointsInK(collectedPoints)}
              {item?.id === rewardTabs?.CONSUMED &&
                formatPointsInK(consumedPoints)}
              <span className="text-xs md:text-xl">
                {" "}
                <span className="uppercase">{resources["tex"]}</span>{" "}
                {resources["points"]}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
