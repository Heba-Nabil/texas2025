import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";

export async function checkoutController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    OrderTypeID: requestBody?.OrderTypeID,
    StoreID: requestBody?.StoreID,
    Note: requestBody?.Note ? requestBody?.Note : "",
    RecaptchaToken: requestBody?.RecaptchaToken,
    OrderDateTime: requestBody?.OrderDateTime,
    Name: requestBody?.Name ? requestBody?.Name : "",
    Phone: requestBody?.Phone ? requestBody?.Phone : "",
    Email: requestBody?.Email ? requestBody?.Email : "",
    AreaID: requestBody?.AreaID ? requestBody?.AreaID : "",
    Block: requestBody?.Block ? requestBody?.Block : "",
    Street: requestBody?.Street ? requestBody?.Street : "",
    Building: requestBody?.Building ? requestBody?.Building : "",
    Floor: requestBody?.Floor ? requestBody?.Floor : "",
    Apartment: requestBody?.Apartment ? requestBody?.Apartment : "",
    Landmark: requestBody?.Landmark ? requestBody?.Landmark : "",
    // Instructions: requestBody?.Instructions ? requestBody?.Instructions : "",
    Longitude: requestBody?.Longitude ? requestBody?.Longitude : "",
    Latitude: requestBody?.Latitude ? requestBody?.Latitude : "",
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.checkout, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
