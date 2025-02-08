import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";

export async function payController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    PaymentMethodID: requestBody?.PaymentMethodID,
    OrderNumber: requestBody?.OrderNumber,
    PaymentToken: requestBody?.PaymentToken,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.pay, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

export async function paymentStatusController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login");

  const requestBody = await request.json();

  const body = JSON.stringify({
    PaymentID: requestBody?.PaymentID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.paymentStatus, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
