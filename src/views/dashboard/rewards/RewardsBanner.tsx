import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import {
  ChevronRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { formatPointsInK, getGreeting } from "@/utils";
import { useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import NextLink from "@/components/global/NextLink";
import { Button } from "@/components/ui/button";
import "react-circular-progressbar/dist/styles.css";
// Types
import { UserLoyaltyStatusResponseProps } from "@/types/api";
import { DashboardRewardsPageResourcesProps } from "@/types/resources";

type RewardsBannerProps = {
  resources: DashboardRewardsPageResourcesProps;
  userStatus: UserLoyaltyStatusResponseProps;
  locale: string;
};

export default function RewardsBanner({
  resources,
  userStatus,
  locale,
}: RewardsBannerProps) {
  const session = useAppSelector(getClientSession);
  const greeting = getGreeting(resources);

  const tierStartPoints = userStatus?.TotalGainedPoints,
    tierEndPoints = userStatus?.CurrentTier?.PointsRangeEnd,
    progressValue =
      ((tierStartPoints - userStatus?.CurrentTier?.PointsRangeStart) /
        (userStatus?.CurrentTier?.PointsRangeEnd -
          userStatus?.CurrentTier?.PointsRangeStart)) *
      100;

  if (userStatus?.CurrentTier?.IsLastTier) {
    return (
      <div
        className="relative z-10 flex min-h-60 w-full flex-col justify-center overflow-hidden rounded-xl bg-accent p-3 text-white sm:p-5"
        style={{
          backgroundColor: userStatus?.CurrentTier?.BackgroundColor
            ? userStatus?.CurrentTier?.BackgroundColor
            : "#e16101",
          color: userStatus?.CurrentTier?.TextColor
            ? userStatus?.CurrentTier?.TextColor
            : "#fff",
        }}
      >
        <div className="absolute inset-y-0 -start-5 -top-10 -z-10 hidden h-full w-2/5 opacity-20 sm:block rtl:-scale-x-100">
          <img
            src={
              locale === "ar"
                ? "/images/icons/Texas logo AR.svg"
                : "/images/icons/Texas logo.svg"
            }
            alt="logo"
            loading="lazy"
            className="absolute inset-y-0 end-0 h-80 w-full object-contain"
          />
        </div>

        <div className="w-full">
          <div className="mb-5 flex flex-wrap justify-between">
            <h2 className="font-semibold capitalize sm:text-xl">
              {greeting}
              {session?.info?.firstName && (
                <span className="ms-1">
                  {session?.info?.firstName?.split(" ")[0]?.trim()},
                </span>
              )}
            </h2>
            <NextLink
              className="flex items-center gap-1 capitalize"
              href="/dashboard/rewards-history"
            >
              <InformationCircleIcon className="size-4" />
              {resources["viewHistory"]}
              <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
            </NextLink>
          </div>

          <div className="flex-center flex-col gap-3 text-center">
            <h2 className="text-4xl font-bold sm:text-7xl">
              {userStatus?.CurrentTier?.Description}
            </h2>

            <p className="text-2xl font-semibold sm:text-4xl">
              {userStatus?.TotalPoints} {resources["points"]}
            </p>

            <p className="text-lg leading-tight sm:text-xl">
              {resources["youAreLegendDesc"]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative z-10 flex min-h-60 w-full flex-col justify-center overflow-hidden rounded-xl p-3 sm:p-5"
      style={{
        backgroundColor: userStatus?.CurrentTier?.BackgroundColor
          ? userStatus?.CurrentTier?.BackgroundColor
          : "",
        color: userStatus?.CurrentTier?.TextColor
          ? userStatus?.CurrentTier?.TextColor
          : "",
      }}
    >
      <div className="absolute inset-y-0 end-0 -z-10 hidden h-full w-2/5 opacity-20 sm:block rtl:-scale-x-100">
        <img
          src={userStatus?.CurrentTier?.IconURL}
          alt={userStatus?.CurrentTier?.Name}
          loading="lazy"
          className="absolute inset-y-0 end-0 h-80 w-full object-contain"
        />
      </div>

      <div className="mb-5 flex flex-wrap justify-between">
        <h2 className="font-semibold capitalize sm:text-xl">
          {greeting}
          {session?.info?.firstName && (
            <span className="ms-1">
              {session?.info?.firstName?.split(" ")[0]?.trim()},
            </span>
          )}
        </h2>
        <NextLink
          className="flex items-center gap-1 capitalize"
          href="/dashboard/rewards-history"
        >
          <InformationCircleIcon className="size-4" />
          {resources["viewHistory"]}
          <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
        </NextLink>
      </div>

      <div className="relative flex items-center gap-3 sm:gap-6">
        <div className="size-24 shrink-0 sm:size-36">
          <CircularProgressbarWithChildren
            value={progressValue}
            strokeWidth={4}
            styles={buildStyles({
              pathColor: userStatus?.CurrentTier?.ButtonBackgroundColor
                ? userStatus?.CurrentTier?.ButtonBackgroundColor
                : "",
              trailColor: "#fff",
            })}
          >
            <div className="flex-center flex-col gap-1">
              <img
                src={userStatus?.CurrentTier?.IconURL}
                alt={userStatus?.CurrentTier?.Name}
                width={40}
                height={40}
                loading="lazy"
                className="size-10 object-contain sm:size-16 rtl:-scale-x-100"
              />
              <span
                className="text-xs sm:text-base"
                // style={{ color: currentTierStyle?.textHexColor }}
              >
                {formatPointsInK(tierStartPoints)} /{" "}
                {formatPointsInK(tierEndPoints)}
              </span>
            </div>
          </CircularProgressbarWithChildren>
        </div>

        <div className="flex-grow">
          <h3 className="mb-1 text-2xl font-bold leading-none md:text-4xl">
            {userStatus?.TotalPoints} {resources["points"]}{" "}
            <span
              className="whitespace-nowrap text-sm font-normal uppercase sm:text-lg"
              style={{
                color: userStatus?.CurrentTier?.ButtonBackgroundColor
                  ? userStatus?.CurrentTier?.ButtonBackgroundColor
                  : "",
              }}
            >
              {userStatus?.CurrentTier?.Name}
            </span>
          </h3>

          <p className="mb-3 !leading-tight sm:text-lg">
            {resources["earnPointsMoreToReact"]}
          </p>

          <Button asChild>
            <NextLink
              href="/menu"
              style={{
                backgroundColor: userStatus?.CurrentTier?.ButtonBackgroundColor
                  ? userStatus?.CurrentTier?.ButtonBackgroundColor
                  : "",
                color: userStatus?.CurrentTier?.ButtonTextColor
                  ? userStatus?.CurrentTier?.ButtonTextColor
                  : "",
              }}
            >
              {resources["earnMore"]}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
