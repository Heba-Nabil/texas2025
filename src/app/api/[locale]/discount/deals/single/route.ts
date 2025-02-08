import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints, fixedKeywords } from "@/utils/constants";
import { getSession } from "@/server/lib/auth";
// Types
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params: { locale } }: { params: { locale: string } },
) {
  const searchParams = request.nextUrl.searchParams;

  const DealHeaderID = searchParams?.get(fixedKeywords.DealHeaderID);

  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.getUserSingleDeal, {
    method: "POST",
    body: JSON.stringify({
      DealHeaderID,
    }),
    headers: {
      "Content-Type": "application/json",
      AccessToken: userId!,
      ...commonHeaders,
    },
  });

  return Response.json(data);
}
