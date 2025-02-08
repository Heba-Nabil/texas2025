import { getSession } from "@/server/lib/auth";
import getRequestHeaders, {
  getCommonHeaders,
} from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import {
  CategoryItemProps,
  NotificationItemProps,
  ProfileDataProps,
  UserAddressProps,
} from "@/types/api";
import { AuthenticationTypeIdEnum } from "@/types/enums";

// Get user data
export async function getUserProfileData(
  locale: string,
): Promise<GenericResponse<ProfileDataProps>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.getUserProfileData, {
    headers: {
      AccessToken: userId as string,
      ...commonHeaders,
    },
  });

  return data;
}

// Login with ThirdParty
export async function loginThirdParty(
  locale: string,
  data: {
    ThirdPartyID: string;
    ThirdPartyEmail?: string;
    AuthenticationTypeID: `${AuthenticationTypeIdEnum}`;
  },
) {
  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const body = JSON.stringify(data);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userSignInThirdParty, {
    method: "POST",
    body,
    headers,
  });

  return response;
}

// Get user favs
export async function getUserFavService(
  locale: string,
): Promise<GenericResponse<CategoryItemProps[]>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);
  const { orderTypeId, orderLocation } = getRequestHeaders(locale);

  const body = JSON.stringify({
    StoreID: orderLocation?.storeId,
    OrderTypeID: orderTypeId,
  });

  const data = await apiFetcher(apiEndpoints.getFavItems, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      AccessToken: userId as string,
      ...commonHeaders,
    },
  });

  return data;
}

// Get user addresses
export async function getUserAddressesService(
  locale: string,
): Promise<GenericResponse<UserAddressProps[]>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.getUserAddresses, {
    headers: {
      AccessToken: userId as string,
      ...commonHeaders,
    },
  });

  return data;
}

// Get user notifications
export async function getUserNotificationService(
  locale: string,
): Promise<GenericResponse<NotificationItemProps[]>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);

  const body = JSON.stringify({ PageNumber: 1 });

  const data = await apiFetcher(apiEndpoints.getNotifications, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      AccessToken: userId as string,
      ...commonHeaders,
    },
  });

  return data;
}
