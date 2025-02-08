"use client";

import useSWRImmutable from "swr/immutable";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
import { GenericResponse } from "@/types";
import { NotificationItemProps } from "@/types/api";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";

export default function useNotification(
  locale: string,
  sendRequest: boolean = true,
) {
  const dispatch = useAppDispatch();
  const {
    data: notifications,
    isLoading,
    error,
    mutate,
  } = useSWRImmutable<GenericResponse<NotificationItemProps[]>>(
    sendRequest && locale
      ? `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getNotifications}?PageNumber=1`
      : null,
    clientSideFetch,
  );
  const getNotifications = async (pageNumber: string) => {
    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));
      const response = await clientSideFetch<
        GenericResponse<NotificationItemProps[]>
      >(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getNotifications}?PageNumber=${pageNumber}`,
        {
          method: "GET",
        },
      );
      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }
      return response;
    } catch (error) {
      console.log("error from notification:", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };
  const markAsRead = async (NotificationID: string) => {
    try {
      const response = await clientSideFetch<Promise<GenericResponse<string>>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.markAsRead}`,
        {
          method: "POST",
          body: JSON.stringify({ NotificationID }),
        },
      );
      return response;
    } catch (error) {
      console.log("error from mark As Readed", error);
    }
  };

  return {
    data: notifications?.data,
    isLoading,
    hasError: error || notifications?.hasError,
    mutate,
    markAsRead,
    getNotifications,
  };
}
