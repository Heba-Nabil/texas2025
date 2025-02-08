import { memo, useCallback, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  MapCameraProps,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import cn from "@/utils/cn";
import { getStoreByGeoFencing } from "@/lib/getStore";
import { DEFAULT_MAP_ZOOM } from "@/utils/constants";
// Types
import { StoreProps } from "@/types/api";
import { MapPositionProps } from "@/types";
import LocateIcon from "@/components/icons/LocateIcon";

type StoreMapProps = {
  className?: string;
  locale: string;
  zoom: number;
  center: MapPositionProps;
  selectedMapLocation: MapPositionProps | undefined;
  setSelectedMapLocation: React.Dispatch<
    React.SetStateAction<MapPositionProps | undefined>
  >;
  setSelectedStore?: React.Dispatch<
    React.SetStateAction<StoreProps | undefined>
  >;
  failCB?: () => void;
  userLocation: MapPositionProps | undefined;
  resources: {
    detectMyCurrentLocation: string;
    pleaseAllowAccessToYourLocation: string;
  };
};

const StoreMap = (props: StoreMapProps) => {
  const {
    className,
    locale,
    zoom,
    center,
    selectedMapLocation,
    setSelectedMapLocation,
    setSelectedStore,
    failCB,
    userLocation,
    resources,
  } = props;

  const dispatch = useAppDispatch();

  const INITIAL_CAMERA = {
    center: {
      lat: Number(center.lat),
      lng: Number(center.lng),
    },
    zoom: zoom < 1 ? DEFAULT_MAP_ZOOM : zoom,
  };

  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);

  const validatePickedPoint = useCallback(
    async (point: MapPositionProps) => {
      try {
        dispatch(toggleModal({ loadingModal: { isOpen: true } }));

        const toaster = (await import("@/components/global/Toaster")).toaster;

        const response = await getStoreByGeoFencing(locale, {
          Latitude: point.lat,
          Longitude: point.lng,
        });

        if (response) {
          if (response?.hasError) {
            setSelectedStore && setSelectedStore(undefined);
            setSelectedMapLocation(undefined);
            failCB && failCB();

            return response?.errors?.forEach((item: any) =>
              toaster.error({
                title: item.Title,
                message: item.Message,
              }),
            );
          }

          setSelectedMapLocation({ lat: point.lat, lng: point.lng });
          response?.data &&
            setSelectedStore &&
            setSelectedStore(response?.data);
        }
      } catch (error) {
        console.error("Error in creating address", (error as Error)?.message);
      } finally {
        dispatch(toggleModal({ loadingModal: { isOpen: false } }));
      }
    },
    [dispatch, failCB, locale, setSelectedMapLocation, setSelectedStore],
  );

  const handleDetectLocation = useCallback(async () => {
    const toaster = (await import("@/components/global/Toaster")).toaster;

    if (userLocation) {
      validatePickedPoint({
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
    } else {
      toaster.error({ message: resources["pleaseAllowAccessToYourLocation"] });
    }
  }, [userLocation, resources, validatePickedPoint]);

  const handleCameraChange = useCallback(
    (ev: MapCameraChangedEvent) => setCameraProps(ev.detail),
    [],
  );

  const handleMapClick = useCallback(
    async (event: MapMouseEvent) => {
      const { latLng } = event.detail;

      if (latLng) {
        validatePickedPoint({ lat: latLng.lat, lng: latLng.lng });
      }
    },
    [validatePickedPoint],
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
      <Map
        id={"d3e27ed5-e7cd-47f4-9dc6"}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "map_id"}
        className={cn("h-64 w-full", className)}
        reuseMaps
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        onClick={handleMapClick}
      >
        <button
          type="button"
          className="absolute bottom-1 start-1 flex items-center gap-1 rounded bg-white px-2 py-1 text-sm text-dark-gray shadow-sm"
          onClick={handleDetectLocation}
        >
          {resources["detectMyCurrentLocation"]}{" "}
          <LocateIcon className="size-4" />
        </button>

        {selectedMapLocation && (
          <>
            {selectedMapLocation?.lat && selectedMapLocation?.lng ? (
              <AdvancedMarker
                position={{
                  lat: Number(selectedMapLocation?.lat),
                  lng: Number(selectedMapLocation?.lng),
                }}
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
            ) : null}
          </>
        )}
      </Map>
    </APIProvider>
  );
};

export default memo(StoreMap);
