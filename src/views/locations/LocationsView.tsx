"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import cn from "@/utils/cn";
import { defaultEndInputIconClassNames } from "@/utils/classNames";
import { isModuleOn } from "@/utils";
import { useData } from "@/providers/DataProvider";
import PageHeader from "@/components/global/PageHeader";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import LocationItem from "./LocationItem";
import LocationsMap from "./LocationsMap";
// Types
import { LocationsPageResourcesProps } from "@/types/resources";
import { StoreProps } from "@/types/api";
import { MapPositionProps } from "@/types";

const DynamicLocationItem = dynamic(() => import("./LocationItem"), {
  ssr: false,
});

type LocationsViewProps = {
  locale: string;
  resources: LocationsPageResourcesProps;
  stores: StoreProps[];
  countryCustomerService: string;
  countryCenter: MapPositionProps;
  zoom: number;
  isMobileView: boolean;
};

export default function LocationsView(props: LocationsViewProps) {
  const {
    locale,
    stores,
    resources,
    countryCustomerService,
    zoom,
    countryCenter,
    isMobileView,
  } = props;

  const { Module } = useData();

  const [userLocation, setUserLocation] = useState<MapPositionProps | null>(
    null,
  );
  const [showMsg, setShowMsg] = useState(false);

  const isMapAllowed = useMemo(() => {
    return Boolean(isModuleOn(Module, "LocationIfram"));
  }, [Module]);

  useEffect(() => {
    function geoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess);

        navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            setShowMsg(result.state !== "granted");
          });
      }
    }

    function handleLocationSuccess(position: GeolocationPosition) {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    isMapAllowed && geoLocation();
  }, [isMapAllowed]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedEffect(searchTerm, 1000);

  const [searchResults, setSearchResults] = useState(stores);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const newResults = stores?.filter((item) => {
        return (
          item.Address?.trim()
            ?.toLowerCase()
            .includes(debouncedSearchTerm?.trim()?.toLowerCase()) ||
          item.Name?.trim()
            .toLowerCase()
            .includes(debouncedSearchTerm?.trim()?.toLowerCase())
        );
      });

      setSearchResults(newResults);
    } else {
      setSearchResults(stores);
    }
  }, [debouncedSearchTerm, stores]);

  return (
    <div className="flex w-full flex-col bg-gray-100">
      <div className="container flex-grow py-10">
        <div className="grid grid-cols-12 gap-6">
          <div
            className={cn("order-2 col-span-full lg:order-1", {
              "lg:col-span-6": isMapAllowed,
            })}
          >
            <div className="rounded-lg bg-white p-5">
              {isMapAllowed && showMsg && (
                <div className="mb-5">
                  <div className="flex w-fit items-center gap-3 rounded-lg border border-accent bg-main/20 p-4 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-alt" />
                    {resources["allowLocationMsg"]}
                  </div>
                </div>
              )}

              {!isMobileView && (
                <PageHeader
                  title={resources["locations"]}
                  backHref="/"
                  backTitle={resources["backToHome"]}
                />
              )}

              <div className="mt-8">
                <div className="mb-5">
                  <h2 className="mb-4 text-xl font-semibold uppercase">
                    {resources["driveThruOrPickupFromLocation"]}
                  </h2>

                  <FloatingLabelInput
                    id="locations_search"
                    type="text"
                    label={resources["findNearstTexasChicken"]}
                    endIcon={
                      <MagnifyingGlassIcon
                        className={defaultEndInputIconClassNames()}
                      />
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>

                <div
                  className={cn("w-full", {
                    "grid grid-cols-12 gap-3": !isMapAllowed,
                  })}
                >
                  {searchResults?.length === 0 && (
                    <div className="col-span-full">
                      {resources["noResultsFound"]}
                    </div>
                  )}

                  {searchResults?.map((item, index) => (
                    <div
                      key={index}
                      className={cn("col-span-full mt-5", {
                        "border-b pb-5":
                          index < searchResults.length - 1 && isMapAllowed,
                        "rounded-xl p-5 shadow-xl sm:col-span-6 lg:col-span-4":
                          !isMapAllowed,
                      })}
                    >
                      <DynamicLocationItem
                        data={item}
                        locale={locale}
                        resources={resources}
                        userLocation={userLocation}
                        countryCustomerService={countryCustomerService}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isMapAllowed && (
            <div className="order-1 col-span-full lg:order-2 lg:col-span-6">
              <div className="top-32 z-10 h-[50vh] lg:sticky lg:h-[80vh]">
                <div className="h-full overflow-hidden rounded-lg bg-white p-5">
                  <LocationsMap
                    stores={searchResults}
                    zoom={zoom}
                    userLocation={userLocation}
                    countryCenter={countryCenter}
                    resources={resources}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
