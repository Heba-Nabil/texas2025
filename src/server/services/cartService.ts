import { isAuthenticated } from "@/server/lib/auth";
import getRequestHeaders, {
  getCommonHeaders,
} from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { CartProps, CategoryItemProps } from "@/types/api";
import { errorResponse } from "@/utils";

export async function getCartItems(
  lang?: string,
  providerAccessToken?: string,
): Promise<GenericResponse<CartProps>> {
  const AccessToken = providerAccessToken
    ? providerAccessToken
    : await isAuthenticated();

  const commonHeaders = getCommonHeaders(lang!);

  const data = await apiFetcher(apiEndpoints.retrieveCart, {
    headers: {
      AccessToken: AccessToken as string,
      ...commonHeaders,
    },
  });

  return data;
}

export async function initializeCartService(
  lang: string,
  data: {
    StoreID?: string;
    OrderTypeID?: string;
    CityID?: string;
    AreaID?: string;
    AddressID?: string;
    Latitude?: number;
    Longitude?: number;
    Block?: string;
    Street?: string;
    Building?: string;
    Floor?: string;
    Apartment?: string;
    Landmark?: string;
    // Instructions?: string;
  },
) {
  const AccessToken = await isAuthenticated();

  const body = JSON.stringify(data);

  const commonHeaders = getCommonHeaders(lang!);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.initializeCart, {
    method: "POST",
    body,
    headers,
  });

  return response;
}

export async function transferCartService(
  locale: string,
  guestToken?: string | null,
  userToken?: string,
) {
  if (!guestToken || !userToken) return errorResponse(400, []);

  const body = JSON.stringify({
    OldUserAccessToken: guestToken,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userToken,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.transferCart, {
    method: "POST",
    body,
    headers,
  });

  return response;
}

export async function getSuggestiveItems(
  locale: string,
): Promise<GenericResponse<CategoryItemProps[]>> {
  const AccessToken = await isAuthenticated();

  const commonHeaders = getCommonHeaders(locale);

  const { orderTypeId, orderLocation } = getRequestHeaders(locale);

  const body = JSON.stringify({
    StoreID: orderLocation?.storeId,
    OrderTypeID: orderTypeId,
  });

  const data = await apiFetcher(apiEndpoints.getSuggested, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      AccessToken: AccessToken as string,
      ...commonHeaders,
    },
  });

  return data;
}
