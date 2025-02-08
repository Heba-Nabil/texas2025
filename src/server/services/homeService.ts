import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import { HomeBannerResponseProps } from "@/types/api";

export async function getHomeBanners(
  locale: string,
): Promise<GenericResponse<HomeBannerResponseProps[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.homeBanners, {
    headers: {
      ...commonHeaders,
    },
  });

  return data;
}
