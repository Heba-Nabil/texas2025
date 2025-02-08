import {
  ArrowRightCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import RewardsHistoryWrapper from "./RewardsHistoryWrapper";
import NextLink from "@/components/global/NextLink";
// Types
import {
  UserLoyaltyHistoryResponseProps,
  UserLoyaltyStatusResponseProps,
} from "@/types/api";
import { RewardsHistoryPageResourcesProps } from "@/types/resources";

type RewardsHistoryViewProps = {
  resources: RewardsHistoryPageResourcesProps;
  data?: UserLoyaltyHistoryResponseProps[];
  userStatus?: UserLoyaltyStatusResponseProps | null;
  locale: string;
};

export default function RewardsHistoryView(props: RewardsHistoryViewProps) {
  const { resources, data, userStatus, locale } = props;

  return (
    <DashBoardPagesWrapper
      label={resources["rewardsHistory"]}
      closeMark={<ChevronLeftIcon className="size-5 rtl:-scale-x-100" />}
      // cb={() => router.push(`/dashboard/orders`, { scroll: false })}
      otherLink={
        <NextLink
          href="/dashboard/rewards"
          className="flex items-center gap-1 text-base font-medium capitalize text-alt"
        >
          {resources["back"]}
          <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
        </NextLink>
      }
    >
      <div className="flex flex-grow overflow-y-auto px-5 max-lg:mt-6">
        <RewardsHistoryWrapper
          resources={resources}
          data={data}
          userStatus={userStatus}
          locale={locale}
        />
      </div>
    </DashBoardPagesWrapper>
  );
}
