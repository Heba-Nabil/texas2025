import { memo, useCallback, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraProps,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { DEFAULT_MAP_ZOOM } from "@/utils/constants";
// Types
import { StoreProps } from "@/types/api";

type PickupMapProps = {
  store: StoreProps;
  zoom: number;
};

const PickupMap = ({ store, zoom }: PickupMapProps) => {
  const INITIAL_CAMERA = {
    center: {
      lat: Number(store?.Latitude),
      lng: Number(store?.Longitude),
    },
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
        id={"1f396983-5ec0-4b29-adb6"}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "map_id"}
        className="h-40 overflow-hidden rounded-md"
        reuseMaps
        {...cameraProps}
        onCameraChanged={handleCameraChange}
      >
        <AdvancedMarker position={INITIAL_CAMERA.center}>
          <img
            src="/images/pin2.png"
            alt="map pin"
            width={20}
            height={40}
            loading="lazy"
            className="object-contain"
          />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default memo(PickupMap);
