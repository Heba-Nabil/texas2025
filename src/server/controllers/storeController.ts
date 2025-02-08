import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";

export async function getStoreGeoFencingController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    Latitude: requestBody?.Latitude,
    Longitude: requestBody?.Longitude,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.getStoreGeoFencing, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

export async function getStoreByAreaController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    AreaID: requestBody?.AreaID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.getStoreByArea, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
