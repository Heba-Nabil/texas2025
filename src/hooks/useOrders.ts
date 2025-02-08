import useSWRImmutable from "swr/immutable";
import { routeHandlersKeys } from "@/utils/constants";
import { clientSideFetch } from "@/utils";
// Types
import { SingleOrderResponseProps } from "@/types/api";
import { GenericResponse } from "@/types";

export default function useOrders(lang: string, sendRequest: boolean) {
  const {
    data: nativeData,
    isLoading,
    error,
    mutate,
  } = useSWRImmutable<GenericResponse<SingleOrderResponseProps[]>>(
    sendRequest && lang
      ? `${process.env.NEXT_PUBLIC_API}/${lang}${routeHandlersKeys.orders}`
      : null,
    clientSideFetch,
  );

  return {
    data: nativeData?.data,
    isLoading,
    hasError: error || nativeData?.hasError,
    mutate,
  };
}
