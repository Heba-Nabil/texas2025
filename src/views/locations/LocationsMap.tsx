"use client";

import { memo, useCallback, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
  type MapCameraChangedEvent,
  type MapCameraProps,
} from "@vis.gl/react-google-maps";
import { getDateInHours } from "@/utils";
import { DEFAULT_MAP_ZOOM } from "@/utils/constants";
// Types
import { StoreProps } from "@/types/api";
import { MapPositionProps } from "@/types";
import { LocationsPageResourcesProps } from "@/types/resources";

type LocationsMapProps = {
  stores: StoreProps[];
  zoom: number;
  userLocation: MapPositionProps | null;
  countryCenter: MapPositionProps;
  resources: LocationsPageResourcesProps;
};

const LocationsMap = (props: LocationsMapProps) => {
  const { countryCenter, stores, zoom, userLocation, resources } = props;

  const INITIAL_CAMERA = {
    center: countryCenter,
    zoom: zoom < 1 ? DEFAULT_MAP_ZOOM : zoom,
  };

  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);

  const handleCameraChange = useCallback(
    (ev: MapCameraChangedEvent) => setCameraProps(ev.detail),
    [],
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
      <Map
        id={"e02b0f7a-c8db-4c8b-8d2c"}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "map_id"}
        className="size-full overflow-hidden"
        reuseMaps
        {...cameraProps}
        onCameraChanged={handleCameraChange}
      >
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <img
              src="/images/UserPin.png"
              alt="user pin"
              width={32}
              height={32}
              loading="lazy"
              className="object-contain"
            />
          </AdvancedMarker>
        )}

        {stores?.map((item) => (
          <MarkerWithInfo key={item.ID} data={item} resources={resources} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default memo(LocationsMap);

function MarkerWithInfo({
  data,
  resources,
}: {
  data: StoreProps;
  resources: LocationsPageResourcesProps;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    [],
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  const headersContent = (
    <h4 className="text-xl font-bold capitalize text-alt">
      {data?.Name?.trim()}
    </h4>
  );

  const opening = getDateInHours(data?.WorkingHoursFrom);
  const closing = getDateInHours(data?.WorkingHoursTo);

  return (
    <>
      <AdvancedMarker
        position={{
          lat: Number(data.Latitude),
          lng: Number(data.Longitude),
        }}
        ref={markerRef}
        onClick={handleMarkerClick}
      >
        <img
          src="/images/pin2.png"
          alt="map pin"
          width={20}
          height={40}
          loading="lazy"
          className="object-contain"
        />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onClose={handleClose}
          headerContent={headersContent}
        >
          <div className="mb-3 pe-3">
            <p className="mb-2">{data?.Address}</p>

            {data?.Phone && (
              <a
                href={`tel:${data?.Phone}`}
                className="mt-1 flex gap-1 leading-none"
              >
                <span className="font-bold">{resources["phoneNumber"]}:</span>
                {data?.Phone}
              </a>
            )}

            {opening && closing && (
              <p className="flex gap-1">
                <span className="font-bold">{resources["openDaily"]}:</span>
                {opening} - {closing}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
