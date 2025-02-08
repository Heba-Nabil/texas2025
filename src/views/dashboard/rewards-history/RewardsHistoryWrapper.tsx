"use client";

import { useMemo, useState } from "react";
import { rewardTabs } from "@/utils/constants";
import PointsSummary from "./rewards-history-details/PointsSummary";
import PointsTabs from "./rewards-history-details/PointsTabs";
import RewardsHistoryItem from "./RewardsHistoryItem";
// Types
import { RewardsHistoryPageResourcesProps } from "@/types/resources";
import { LoyaltyHistoryTypeIdEnum } from "@/types/enums";
import {
  UserLoyaltyHistoryResponseProps,
  UserLoyaltyStatusResponseProps,
} from "@/types/api";
import { RewardsHistoryTabs } from "@/types";

type RewardsHistoryWrapperProps = {
  resources: RewardsHistoryPageResourcesProps;
  data?: UserLoyaltyHistoryResponseProps[];
  userStatus?: UserLoyaltyStatusResponseProps | null;
  locale: string;
};

export default function RewardsHistoryWrapper(
  props: RewardsHistoryWrapperProps,
) {
  const { resources, data, userStatus, locale } = props;

  const rewardsTabs: RewardsHistoryTabs[] = [
    {
      id: rewardTabs?.ALL,
      label: resources?.all,
    },
    {
      id: rewardTabs?.COLLECTED,
      label: resources?.collected,
      filterFn: (item) =>
        item.ReferenceTypeID === LoyaltyHistoryTypeIdEnum.Collected,
    },
    {
      id: rewardTabs?.CONSUMED,
      label: resources?.consumed,
      filterFn: (item) =>
        item.ReferenceTypeID === LoyaltyHistoryTypeIdEnum.Consumed ||
        item.ReferenceTypeID === LoyaltyHistoryTypeIdEnum.Expired,
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(rewardsTabs[0]?.id);

  const activeTabConfig = rewardsTabs.find((tab) => tab.id === activeTab);

  const filteredItems = useMemo(() => {
    return activeTabConfig?.filterFn
      ? data?.filter(activeTabConfig.filterFn)
      : data;
  }, [activeTabConfig, data]);

  return (
    <div className="flex-grow">
      {userStatus && (
        <PointsSummary
          resources={resources}
          tabs={rewardsTabs}
          totalPoints={userStatus?.TotalPoints}
          collectedPoints={userStatus?.TotalGainedPoints}
          consumedPoints={userStatus?.TotalUsedPoints}
        />
      )}

      <PointsTabs
        tabs={rewardsTabs}
        activeTab={activeTab!}
        setActiveTab={setActiveTab}
        resources={resources}
      />

      <div className="mt-5 flex w-full flex-col">
        {filteredItems?.length! > 0 ? (
          filteredItems?.map((item, index) => (
            <RewardsHistoryItem
              locale={locale}
              key={`${item.ID}-${index}`}
              data={item}
              resources={{
                expired: resources["expired"],
                expiredAt: resources["expiredAt"],
              }}
              className={
                index === filteredItems?.length - 1 ? "border-none" : ""
              }
            />
          ))
        ) : (
          <p>{resources["thereIsNoItems"]}</p>
        )}
      </div>
    </div>
  );
}
