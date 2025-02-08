import useSWRImmutable from "swr/immutable";
import { routeHandlersKeys } from "@/utils/constants";
import { clientSideFetch } from "@/utils";
// Types
import { PartialCountryProps } from "@/types/api";
import { GenericResponse } from "@/types";

export default function useCountries(lang: string, sendRequest: boolean) {
  const {
    data: nativeData,
    isLoading,
    error,
  } = useSWRImmutable<GenericResponse<PartialCountryProps[]>>(
    sendRequest && lang
      ? `${process.env.NEXT_PUBLIC_API}/${lang}${routeHandlersKeys.countriesListRoute}`
      : null,
    clientSideFetch,
  );

  return {
    data: nativeData?.data,
    isLoading,
    hasError: error || nativeData?.hasError,
  };
}
