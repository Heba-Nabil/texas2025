import { getSession } from "@/server/lib/auth";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { UserDealsResponseProps } from "@/types/api";

export async function getUserDeals(
  lang: string,
): Promise<GenericResponse<UserDealsResponseProps[]>> {
  const { userId } = await getSession();

  // const { orderTypeId } = getRequestHeaders(lang);

  const commonHeaders = getCommonHeaders(lang!);

  const body = JSON.stringify({ OrderTypeID: "" });
  // const body = JSON.stringify({ OrderTypeID: orderTypeId ? orderTypeId : "" });

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const data = await apiFetcher(apiEndpoints.getUserDeals, {
    method: "POST",
    body,
    headers,
  });

  return data;
}

export async function getUserSingleDeal(lang: string, dealId: string) {
  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(lang!);

  const body = JSON.stringify({ DealHeaderID: dealId });

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const data = await apiFetcher(apiEndpoints.getUserSingleDeal, {
    method: "POST",
    body,
    headers,
  });

  return data;
}
