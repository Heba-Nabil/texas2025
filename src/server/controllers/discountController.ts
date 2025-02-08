import { RedirectType } from "next/navigation";
import { getSession, isAuthenticated } from "@/server/lib/auth";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { redirect } from "@/navigation";

// Apply promocode controller
export async function applyPromoCodeController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    Code: requestBody?.Code,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.applyPromoCode, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Remove promocode controller
export async function removePromoCodeController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    Code: requestBody?.Code,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.removePromoCode, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Apply deal controller
export async function applyDealController(request: Request, locale: string) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const Lists = requestBody.Lists;

  const body = JSON.stringify({
    DealHeaderID: requestBody?.DealHeaderID,
    ...(Lists ? { Lists } : {}),
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.applyDeal, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Remove deal controller
export async function removeDealController(request: Request, locale: string) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    DealHeaderID: requestBody?.DealHeaderID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.removeDeal, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Add Loyalty Controller
export async function addLoyaltyDealController(request: Request, locale: string) {
  const { userId } = await getSession();

  const requestBody = await request.json();

  const body = JSON.stringify({
    DealHeaderID: requestBody?.DealHeaderID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.addLoyaltyDeal, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
