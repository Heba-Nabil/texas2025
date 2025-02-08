import useSWRImmutable from "swr/immutable";
import { fixedKeywords, routeHandlersKeys } from "@/utils/constants";
import { clientSideFetch } from "@/utils";
// Types
import { UserSingleDealResponseProps } from "@/types/api";
import { GenericResponse } from "@/types";

export default function useSingleDeal(lang: string, DealHeaderID: string) {
  const {
    data: nativeData,
    isLoading,
    error,
  } = useSWRImmutable<GenericResponse<UserSingleDealResponseProps>>(
    DealHeaderID && lang
      ? `${process.env.NEXT_PUBLIC_API}/${lang}${routeHandlersKeys.getSingleDeal}?${fixedKeywords.DealHeaderID}=${DealHeaderID}`
      : null,
    clientSideFetch,
  );

  return {
    data: nativeData?.data,
    isLoading,
    hasError: error || nativeData?.hasError,
  };
}
