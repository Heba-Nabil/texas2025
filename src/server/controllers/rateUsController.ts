import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";

export async function rateusController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    OrderNumber: requestBody?.OrderNumber,
    Rate: requestBody?.Rate,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.rateUs, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
