import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";

export async function ordersController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.orders, {
    method: "GET",
    headers,
  });

  return Response.json(response);
}

export async function ordersRollBackController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({ OrderNumber: requestBody.OrderNumber });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.rollback, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
export async function reorderController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    OrderNumber: requestBody?.OrderNumber,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.reorder, {
    method: "POST",
    headers,
    body,
  });

  return Response.json(response);
}

export async function preCheckoutController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    StoreID: requestBody?.StoreID,
    OrderTypeID: requestBody?.OrderTypeID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.preCheckout, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
