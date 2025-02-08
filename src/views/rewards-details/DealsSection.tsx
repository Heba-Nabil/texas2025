"use client";

import { useMemo, useState } from "react";
import NextLink from "@/components/global/NextLink";
import NextImage from "@/components/global/NextImage";
import PointsFilteration from "../dashboard/rewards/PointsFilteration";
import { Button } from "@/components/ui/button";
// Types
import { RewardsDetailsPageResourcesProps } from "@/types/resources";
import { UserDealsResponseProps } from "@/types/api";

type DealsSectionProps = {
  locale: string;
  resources: RewardsDetailsPageResourcesProps;
  data: UserDealsResponseProps[];
};

export default function DealsSection(props: DealsSectionProps) {
  const { locale, resources, data } = props;

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

  return (
    <div className="mb-4 mt-8 py-5">
      <div className="container text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-full text-center md:w-3/4">
            <h2 className="mb-2 mt-6 text-2xl font-bold text-alt md:text-5xl">
              {resources["readyToSpend"]}
            </h2>
            <p className="mb-0 text-xl">{resources["youHaveEarned"]}</p>
          </div>
        </div>

        <div className="mb-5 mt-8 flex items-center justify-center p-6">
          <div className="flex w-full items-center justify-center gap-6 md:w-3/4">
            <div className="flex">
              <p className="lead mb-0">{resources["filter"]}:</p>
            </div>

            <PointsFilteration
              locale={locale}
              range={range}
              handleRangeChange={handleRangeChange}
              min={minPoints}
              max={maxPoints}
            />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap justify-center pt-4">
          {filteredDeals?.map((item, index) => (
            <div
              className="flex-center relative w-1/2 flex-col px-3 py-12 md:w-1/4"
              key={index}
            >
              <div className="absolute left-0 top-0 -z-10 size-[98%] rounded-3xl bg-gray-100" />

              {item?.IconURL && (
                <NextImage
                  src={item?.IconURL}
                  className="h-44 w-[80%] object-cover object-bottom md:w-[65%]"
                  width="120"
                  height="120"
                  alt={item?.Name || "item"}
                />
              )}

              <div className="flex flex-col items-center justify-center">
                <span className="text-xl font-bold uppercase text-alt md:text-2xl">
                  {item?.Points} {resources["points"]}
                </span>
                <h3 className="text-lg font-bold uppercase text-dark md:text-3xl">
                  {item?.Name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <Button asChild>
          <NextLink href="/menu">{resources["viewMenu"]}</NextLink>
        </Button>
      </div>
    </div>
  );
}
