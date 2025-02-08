"use client";

import useSWRImmutable from "swr/immutable";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
// Types
import { AddressWithSelectForm, GenericResponse } from "@/types";
import { UserAddressProps } from "@/types/api";

export default function useAddresses(
  locale: string,
  sendRequest: boolean = true,
  initialData?: UserAddressProps[] | null,
) {
  const {
    data: nativeData,
    isLoading,
    error,
    mutate,
  } = useSWRImmutable<GenericResponse<UserAddressProps[]>>(
    sendRequest && locale
      ? `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getUserAddresses}`
      : null,
    clientSideFetch,
  );

  const getAddressById = (id: string) => {
    return nativeData?.data?.find((item) => item.ID === id);
  };

  const createAddress = async (
    locale: string,
    values: AddressWithSelectForm,
  ) => {
    const response = await clientSideFetch<Promise<GenericResponse<string>>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.createAddress}`,
      {
        method: "POST",
        body: JSON.stringify(values),
      },
    );

    return response;
  };

  const editAddress = async (locale: string, values: AddressWithSelectForm) => {
    const response = await clientSideFetch<Promise<GenericResponse<string>>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.updateAddress}`,
      {
        method: "POST",
        body: JSON.stringify(values),
      },
    );

    return response;
  };

  const deleteAddress = async (locale: string, id: string) => {
    const response = await clientSideFetch<Promise<GenericResponse<string>>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.deleteAddress}`,
      {
        method: "POST",
        body: JSON.stringify({ AddressID: id }),
      },
    );

    return response;
  };

  return {
    data: nativeData ? nativeData?.data : initialData,
    isLoading,
    hasError: error || nativeData?.hasError,
    mutate,
    getAddressById,
    createAddress,
    editAddress,
    deleteAddress,
  };
}
