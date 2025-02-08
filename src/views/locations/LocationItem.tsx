import { memo } from "react";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { calculateDistance, displayInOrder, getDateInHours } from "@/utils";
import Facilities from "./Facilities";
// Types
import { LocationsPageResourcesProps } from "@/types/resources";
import { StoreProps } from "@/types/api";
import { MapPositionProps } from "@/types";

type LocationItemProps = {
  resources: LocationsPageResourcesProps;
  locale: string;
  data: StoreProps;
  userLocation: MapPositionProps | null;
  countryCustomerService: string;
};

const LocationItem = (props: LocationItemProps) => {
  const { resources, data, userLocation, countryCustomerService, locale } =
    props;

  const opening = getDateInHours(data?.WorkingHoursFrom, locale);
  const closing = getDateInHours(data?.WorkingHoursTo, locale);

  const facilities = data?.Facilities ? displayInOrder(data?.Facilities) : [];

  return (
    <>
      <div className="flex flex-wrap gap-x-3">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${data?.Latitude},${data?.Longitude}`}
          target="_blank"
          rel="noopener"
        >
          <h3 className="text-xl font-bold text-alt hover:text-main">
            {data.Name}
          </h3>
        </a>

        {userLocation && (
          <p className="flex items-center gap-1 font-bold leading-none">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            {calculateDistance(
              data?.Latitude,
              data?.Longitude,
              userLocation?.lat,
              userLocation?.lng,
            )}{" "}
            KM &nbsp;
            {resources["farFromLocation"]}
          </p>
        )}
      </div>

      <p className="mt-2 first-letter:capitalize">{data?.Address}</p>

      {data?.Phone?.trim() ? (
        <a
          href={`tel:${data?.Phone?.trim()}`}
          className="mt-1 flex w-fit gap-1 leading-none"
        >
          <span className="font-bold">{resources["phoneNumber"]}:</span>
          {data?.Phone?.trim()}
        </a>
      ) : (
        countryCustomerService && (
          <a
            href={`tel:${countryCustomerService}`}
            className="mt-1 flex w-fit gap-1 leading-none"
          >
            <span className="font-bold">{resources["hotLine"]}:</span>
            {countryCustomerService}
          </a>
        )
      )}

      {opening && closing && (
        <p
          // href={`https://www.google.com/maps/search/?api=1&query=${data?.Latitude},${data?.Longitude}`}
          // target="_blank"
          // rel="noopener"
          className="mb-1 flex w-fit gap-1"
        >
          <span className="font-bold">{resources["openDaily"]}:</span>
          {opening} - {closing}
        </p>
      )}

      {facilities?.length > 0 && <Facilities data={facilities} />}

      <div className="mt-3 w-fit">
        <Button asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${data.Latitude},${data.Longitude}`}
            className="w-full"
            target="_blank"
            rel="noopener"
          >
            {resources["getDirections"]}
          </a>
        </Button>
      </div>
    </>
  );
};

export default memo(LocationItem);
