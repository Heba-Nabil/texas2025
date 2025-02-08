import { isAuthenticated } from "@/server/lib/auth";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { SingleOrderResponseProps } from "@/types/api";

export async function getAllOrdersService(
  lang: string,
): Promise<GenericResponse<SingleOrderResponseProps[]>> {
  const AccessToken = await isAuthenticated();

  const commonHeaders = getCommonHeaders(lang);

  const headers = {
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.orders, {
    method: "GET",
    headers,
  });

  return response;
}

export async function getSingleOrderService(
  lang: string,
  OrderNumber: string,
): Promise<GenericResponse<SingleOrderResponseProps>> {
  const AccessToken = await isAuthenticated();

  const body = JSON.stringify({
    OrderNumber: OrderNumber,
  });

  const commonHeaders = getCommonHeaders(lang);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.singleOrder, {
    method: "POST",
    body,
    headers,
  });

  return response;
}
