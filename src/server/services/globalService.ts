import { defaultLanguage } from "@/config";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import {
  apiEndpoints,
  apiResponseKeys,
  RESOURCES_CACHE,
} from "@/utils/constants";
import { successResponse } from "@/utils";
// Types
import {
  CountryResourcesProps,
  FaqItemType,
  PageMetadata,
  PageSectionContentType,
  PageSectionMediaType,
  PageSectionResponseType,
  SingleCategoryDocResponseProps,
  SingleCategoryMediaProps,
  SingleCountryDataProps,
} from "@/types/api";
import { GenericResponse } from "@/types";

export const getCountryMessages = async (): Promise<
  GenericResponse<CountryResourcesProps[]>
> => {
  console.log("Fetching country messages (not from cache)");

  const headers = {
    CountryID: process.env.COUNTRY_ID!,
    RequestSource: process.env.REQUEST_SOURCE!,
    Version: process.env.API_VERSION!,
  };

  const response = await fetch(
    `${process.env.BASE_URL}/Resource/AllResources`,
    {
      headers,
      cache: "force-cache",
      next: {
        tags: [RESOURCES_CACHE],
      },
    },
  );

  const responseJson = await response?.json();

  const data = successResponse(
    responseJson[apiResponseKeys?.responseCode],
    responseJson[apiResponseKeys?.results],
  );

  return data;
};

// export async function getCountryMessages(): Promise<
//   GenericResponse<CountryResourcesProps[]>
// > {
//   const commonHeaders = getCommonHeaders(defaultLanguage);

//   const headers = {
//     RequestSource: commonHeaders?.RequestSource,
//     CountryID: commonHeaders?.CountryID,
//     Version: commonHeaders?.Version,
//   };

//   const data = await apiFetcher(apiEndpoints.resources, {
//     headers,
//     cache: "force-cache",
//     next: {
//       tags: [RESOURCES_CACHE],
//     },
//   });

//   return data;
// }

export async function getCountryData(
  locale: string,
  source: string,
): Promise<GenericResponse<SingleCountryDataProps>> {
  // console.log("Country data from", source);

  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.countrySingle, {
    headers: {
      ...commonHeaders,
    },
    cache: "force-cache",
    next: {
      tags: [`${locale}_country_data`],
    },
  });

  return data;
}

export async function getCountryLocales(locale: string) {
  const countryData = await getCountryData(locale, "I18n");

  if (!countryData || countryData?.hasError)
    throw new Error("Something went wrong while fetching country Data");

  const data = countryData?.data;

  const locales = data?.Languages?.map((item) => item.Code);
  const defaultLocale =
    data?.Languages?.find((item) => item.IsDefault)?.Code || defaultLanguage;

  return {
    locales,
    defaultLocale,
  };
}

export async function getAllPageSection(
  locale: string,
  InstanceCode: string,
): Promise<GenericResponse<PageSectionResponseType[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.allSections, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleSectionMedia(
  locale: string,
  InstanceCode: string,
  CategoryCode: string,
): Promise<GenericResponse<SingleCategoryMediaProps[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.SingleSectionMedia, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
      CategoryCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleSectionSingleContent(
  locale: string,
  InstanceCode: string,
  CategoryCode: string,
  ContentCode: string,
): Promise<GenericResponse<PageSectionContentType>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.SingleSectionSingleContent, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
      CategoryCode,
      ContentCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleSectionSingleContentMedia(
  locale: string,
  InstanceCode: string,
  ContentCode: string,
): Promise<GenericResponse<PageSectionMediaType[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.SingleSectionSingleContentMedia, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
      ContentCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleSectionContent(
  locale: string,
  InstanceCode: string,
  CategoryCode: string,
): Promise<GenericResponse<PageSectionContentType[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.SingleSectionContent, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
      CategoryCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getSingleCategoryDocument(
  locale: string,
  InstanceCode: string,
  CategoryCode: string,
): Promise<GenericResponse<SingleCategoryDocResponseProps[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.singleCategoryDocument, {
    method: "POST",
    body: JSON.stringify({
      InstanceCode,
      CategoryCode,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getMetaData(
  locale: string,
  ControlName: string,
  ViewPage: string,
): Promise<GenericResponse<PageMetadata>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.SEO, {
    method: "POST",
    body: JSON.stringify({
      ControlName,
      ViewPage,
    }),
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}

export async function getFaqs(
  locale: string,
): Promise<GenericResponse<FaqItemType[]>> {
  const commonHeaders = getCommonHeaders(locale);

  const data = await apiFetcher(apiEndpoints.Faq, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...commonHeaders,
    },
  });

  return data;
}
