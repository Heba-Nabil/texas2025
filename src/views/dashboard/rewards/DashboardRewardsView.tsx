import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import EmptyRewards from "@/components/emptyStates/EmptyRewards";
import DashboardRewardsWrapper from "./DashboardRewardsWrapper";
// Types
import { DashboardRewardsPageResourcesProps } from "@/types/resources";
import {
  UserDealsResponseProps,
  UserLoyaltyStatusResponseProps,
} from "@/types/api";

type DashboardRewardsViewProps = {
  locale: string;
  resources: DashboardRewardsPageResourcesProps;
  data: UserDealsResponseProps[];
  userStatus: UserLoyaltyStatusResponseProps;
};

export default function DashboardRewardsView(props: DashboardRewardsViewProps) {
  const { locale, resources, data, userStatus } = props;

  return (
    <DashBoardPagesWrapper label={resources["rewards"]}>
      <div className="flex flex-grow overflow-y-auto px-5 max-lg:mt-6">
        {userStatus?.TotalGainedPoints > 0 ? (
          <DashboardRewardsWrapper
            locale={locale}
            resources={resources}
            data={data}
            userStatus={userStatus!}
          />
        ) : (
          <EmptyRewards
            resources={{
              emptyRewardsTitle: resources["emptyRewardsTitle"],
              emptyRewardsDesc: resources["emptyRewardsDesc"],
              orderNow: resources["orderNow"],
            }}
          />
        )}
      </div>
    </DashBoardPagesWrapper>
  );
}
