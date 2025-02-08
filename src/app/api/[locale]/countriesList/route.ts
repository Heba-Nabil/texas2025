import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.countriesList, {
    headers: {
      ...commonHeaders,
    },
  });

  return Response.json(data);
}
