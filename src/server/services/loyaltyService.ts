import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import { getSession } from "@/server/lib/auth";
import { apiEndpoints } from "@/utils/constants";
import apiFetcher from "@/server/lib/apiFetcher";
// Types
import { GenericResponse } from "@/types";
import {
  UserDealsResponseProps,
  UserLoyaltyHistoryResponseProps,
  UserLoyaltyStatusResponseProps,
} from "@/types/api";

export async function getUserLoyaltyHistory(
  lang: string,
): Promise<GenericResponse<UserLoyaltyHistoryResponseProps[]>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(lang!);

  const headers = {
    AccessToken: userId!,
    ...commonHeaders,
  };

  const data = await apiFetcher(apiEndpoints.getUserLoyaltyHistory, {
    method: "GET",
    headers,
  });

  return data;
}

export async function getUserLoyaltyStatus(
  lang: string,
): Promise<GenericResponse<UserLoyaltyStatusResponseProps>> {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(lang!);

  const headers = {
    AccessToken: userId!,
    ...commonHeaders,
  };

  const data = await apiFetcher(apiEndpoints.getUserLoyaltyStatus, {
    method: "GET",
    headers,
  });

  return data;
}

export async function getUserLoyaltyDeals(
  lang: string,
): Promise<GenericResponse<UserDealsResponseProps[]>> {
  // const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(lang!);

  const headers = {
    // AccessToken: userId!,
    ...commonHeaders,
  };

  const data = await apiFetcher(apiEndpoints.getUserLoyaltyDeals, {
    method: "GET",
    headers,
  });

  return data;
}
