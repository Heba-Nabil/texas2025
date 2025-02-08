import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/server/lib/auth";
import {
  apiEndpoints,
  BILL_LINE,
  CHECKOUT_RESPONSE,
  GUEST_DATA,
  NEXT_LOCALE,
  ORDER_DATE,
  PAYMENT_ID,
} from "@/utils/constants";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { deleteServerCookie } from "@/server/actions/serverCookie";
import { defaultLanguage } from "@/config";

export async function GET(request: NextRequest) {
  const locale = cookies()?.get(NEXT_LOCALE)?.value || defaultLanguage;

  const searchParams = request.nextUrl.searchParams;

  const status = searchParams.get("status");
  const orderNumber = searchParams.get("orderNumber");

  const AccessToken = await isAuthenticated();

  // Delete any cached data in from checkout
  await deleteServerCookie([
    BILL_LINE,
    CHECKOUT_RESPONSE,
    ORDER_DATE,
    PAYMENT_ID,
  ]);

  // Redirect to failed page incase of there is no access token or miss of reuired search params
  if (!AccessToken || !status || !orderNumber) {
    return redirect(`/${locale}/failed`);
  }

  // Redirect to Track order
  if (status === "success") {
    return redirect(`/${locale}/track-order/${orderNumber}`);
  }

  // Trigger rollback and redirect to checkout
  if (status === "fail") {
    const commonHeaders = getCommonHeaders(locale);

    const headers = {
      "Content-Type": "application/json",
      AccessToken: AccessToken!,
      ...commonHeaders,
    };

    await apiFetcher(apiEndpoints.rollBack, {
      method: "POST",
      body: JSON.stringify({
        OrderNumber: orderNumber,
      }),
      headers,
    });

    return redirect(`/${locale}/checkout`);
  }

  // const cookieStore = cookies();
  // const paymentId = cookieStore.get(PAYMENT_ID)?.value;
  // if (!AccessToken || !paymentId) return redirect("/not-found");
  // const body = JSON.stringify({
  //   PaymentID: paymentId,
  // });
  // const commonHeaders = getCommonHeaders("en");
  // const headers = {
  //   "Content-Type": "application/json",
  //   AccessToken: AccessToken!,
  //   ...commonHeaders,
  // };
  // const response = await apiFetcher(apiEndpoints.paymentStatus, {
  //   method: "POST",
  //   body,
  //   headers,
  // });
  // cookieStore.delete(PAYMENT_ID);
  // if (response?.data?.IsPaymentResponseSucceeded) {
  //   deleteServerCookie([GUEST_DATA, BILL_LINE, CHECKOUT_RESPONSE, ORDER_DATE]);
  //   return redirect(`/${locale}/track-order/${response?.data?.OrderNumber}`);
  // } else {
  // await apiFetcher(apiEndpoints.rollBack, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     OrderNumber: response?.data?.OrderNumber,
  //   }),
  //   headers,
  // });
  //   await deleteServerCookie([BILL_LINE, CHECKOUT_RESPONSE, ORDER_DATE]);
  //   return redirect(`/${locale}/checkout`);
  // }
}
