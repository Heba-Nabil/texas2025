"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
// Types
import { TrackOrderResourcesProps } from "@/types/resources";
import { GenericResponse } from "@/types";
import cn from "@/utils/cn";

const DynamicCustomRating = dynamic(() => import("./CustomRating"), {
  ssr: false,
});

type RateusProps = {
  resources: TrackOrderResourcesProps;
  orderNumber: string;
  rate: number;
  locale: string;
};

export default function RatingSection(props: RateusProps) {
  const { resources, orderNumber, rate, locale } = props;

  const [rating, setRating] = useState(rate > 0 ? rate : 0);

  const dispatch = useAppDispatch();

  const handelChangeRating = async (value: number) => {
    if (rating > 0) return;

    setRating(value);

    try {
      const response = await clientSideFetch<Promise<GenericResponse<string>>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.rateUs}`,
        {
          method: "POST",
          body: JSON.stringify({ OrderNumber: orderNumber, Rate: value }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.hasError) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }
    } catch (error) {
      console.log("Error at fetching payment", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <div className="flex flex-col">
      <p className="flex flex-col text-xl font-semibold capitalize">
        <span className="flex items-center gap-3">
          <img
            src="/images/icons/star.svg"
            alt="track"
            width={25}
            height={25}
            loading="lazy"
            className="bject-contain smooth"
          />
          {resources["rateus"]}
        </span>
      </p>

      <div className={cn("mt-4 flex", { "pointer-events-none": rating > 0 })}>
        <DynamicCustomRating
          rating={rating}
          handelChangeRating={handelChangeRating}
        />
      </div>

      {rating > 0 && (
        <p className="text-accent">{resources["thanksForRating"]}</p>
      )}
    </div>
  );
}
