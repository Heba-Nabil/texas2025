import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { CareersItemType } from "@/types/api";

export async function getCareers(
  locale: string,
): Promise<GenericResponse<CareersItemType[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.careers, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleCareer(
  locale: string,
  slug: string,
): Promise<GenericResponse<CareersItemType>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.careers, {
    method: "POST",
    body: JSON.stringify({ CareerCode: slug }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}
