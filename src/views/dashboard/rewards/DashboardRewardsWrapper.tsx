"use client";

import { useMemo, useState } from "react";
import LoyaltyHeader from "@/views/dashboard/LoyaltyHeader";
import RewardsBanner from "./RewardsBanner";
import PointsFilteration from "./PointsFilteration";
import DashboardRewardsItem from "./DashboardRewardsItem";
import LockedDealModal from "./LockedDealModal";
import RedeemNowOrLaterModal from "./RedeemNowOrLaterModal";
// Types
import {
  UserDealsResponseProps,
  UserLoyaltyStatusResponseProps,
} from "@/types/api";
import { DashboardRewardsPageResourcesProps } from "@/types/resources";

type DashboardRewardsWrapperProps = {
  locale: string;
  resources: DashboardRewardsPageResourcesProps;
  data: UserDealsResponseProps[];
  userStatus: UserLoyaltyStatusResponseProps;
};

export default function DashboardRewardsWrapper(
  props: DashboardRewardsWrapperProps,
) {
  const { locale, resources, data, userStatus } = props;

  const sortDealsByPoints = data.sort((a, b) => a.Points - b.Points),
    minPoints = sortDealsByPoints[0]?.Points,
    maxPoints = sortDealsByPoints[sortDealsByPoints?.length - 1]?.Points;

  const [range, setRange] = useState([minPoints, maxPoints]);
  const handleRangeChange = (newRange: number[]) => {
    // Ensure min value is always less than max value
    const [newMin, newMax] = newRange;
    if (newMin <= newMax) {
      setRange(newRange);
    }
  };

  const filteredDeals = useMemo(() => {
    return data?.filter(
      (item) => item.Points >= range[0] && item.Points <= range[1],
    );
  }, [range, data]);

  const [openLockedDealModal, setOpenLockedDealModal] = useState(false);
  // Depend or it to open or close redeem now or later modal
  const [dealToRedeem, setDealToRedeem] = useState("");

  const handleRedeemDeal = async (dealData: UserDealsResponseProps) => {
    if (!dealData) return;

    // Case current user points less than the deal point
    if (userStatus?.TotalPoints < dealData?.Points) {
      return setOpenLockedDealModal(true);
    }

    setDealToRedeem(dealData?.ID);
  };

  return (
    <div className="w-full flex-grow">
      <LoyaltyHeader />

      <div className="mb-4" />

      <RewardsBanner
        userStatus={userStatus}
        resources={resources}
        locale={locale}
      />

      <div className="mb-8" />

      <div className="max-w-md mx-auto">
        <PointsFilteration
          locale={locale}
          range={range}
          handleRangeChange={handleRangeChange}
          min={minPoints}
          max={maxPoints}
        />
      </div>

      <div className="mb-6" />

      <div className="flex flex-wrap justify-center gap-1">
        {filteredDeals?.length > 0 ? (
          <div className="grid w-full grid-cols-2 items-baseline gap-4 py-2 sm:grid-cols-3">
            {filteredDeals?.map((item, index) => (
              <DashboardRewardsItem
                key={index}
                data={item}
                resources={{
                  redeem: resources["redeem"],
                  free: resources["free"],
                }}
                isAvailiable={userStatus?.TotalPoints >= item.Points}
                handleRedeemDeal={handleRedeemDeal}
              />
            ))}
          </div>
        ) : (
          <p className="my-5 text-center">{resources["thereIsNoItems"]}</p>
        )}
      </div>

      {openLockedDealModal && (
        <LockedDealModal
          isOpen={openLockedDealModal}
          setOpen={setOpenLockedDealModal}
        />
      )}

      {!!dealToRedeem && (
        <RedeemNowOrLaterModal
          isOpen={!!dealToRedeem}
          setOpen={setDealToRedeem}
          dealId={dealToRedeem}
        />
      )}
    </div>
  );
}
