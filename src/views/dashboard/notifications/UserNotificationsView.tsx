"use client";

import { useState } from "react";
import { clientSideFetch, sortByDate } from "@/utils";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import EmptyNotifications from "@/components/emptyStates/EmptyNotifications";
import { UserNotificationsPageResourcesProps } from "@/types/resources";
import NotificationItem from "@/components/items/NotificationItem";
// Types
import { GenericResponse } from "@/types";
import { NotificationItemProps } from "@/types/api";
import { routeHandlersKeys } from "@/utils/constants";

type UserNotificationsViewProps = {
  resources: UserNotificationsPageResourcesProps;
  locale: string;
  data: NotificationItemProps[];
};

export default function UserNotificationsView(
  props: UserNotificationsViewProps,
) {
  const { resources, data, locale } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const [allNotifications, setAllNotifications] = useState(data);
  const [isEnded, setIsEnded] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await clientSideFetch<
        GenericResponse<NotificationItemProps[]>
      >(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.getNotifications}?PageNumber=${nextPage}`,
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

      if (response?.data && response?.data.length > 0) {
        setAllNotifications((prevNotifications) => [
          ...prevNotifications,
          ...response.data!,
        ]);

        setCurrentPage(nextPage);
      } else {
        setIsEnded(true);
      }
    } catch (error) {
      console.log("error from notification:", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <DashBoardPagesWrapper label={resources["notifications"]}>
      <div className="flex-grow overflow-y-auto px-5 @container/main">
        {allNotifications && allNotifications?.length > 0 ? (
          <div className="space-y-4">
            {sortByDate(allNotifications).map((item) => (
              <NotificationItem key={item.ID} data={item} locale={locale} />
            ))}

            <div className="flex-center w-full">
              {!isEnded ? (
                <button onClick={handleLoadMore}>{resources.loadMore}</button>
              ) : (
                <span>{resources.noMoreNotifications}</span>
              )}
            </div>
          </div>
        ) : (
          <EmptyNotifications
            resources={{
              noNotificationsYet: resources["noNotificationsYet"],
            }}
          />
        )}
      </div>
    </DashBoardPagesWrapper>
  );
}
