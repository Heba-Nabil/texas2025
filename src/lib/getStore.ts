import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
// Types
import { GenericResponse, MapCoordinatesProps } from "@/types";
import { StoreProps } from "@/types/api";

export const getStoreByGeoFencing = async (
  locale: string,
  coordinates: MapCoordinatesProps,
) => {
  const response = await clientSideFetch<Promise<GenericResponse<StoreProps>>>(
    `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getStoreGeoFencing}`,
    {
      method: "POST",
      body: JSON.stringify(coordinates),
    },
  );

  return response;
};

export const getStoreByAreaId = async (locale: string, AreaID: string) => {
  const response = await clientSideFetch<Promise<GenericResponse<StoreProps>>>(
    `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getStoreByArea}`,
    {
      method: "POST",
      body: JSON.stringify({ AreaID }),
    },
  );

  return response;
};
