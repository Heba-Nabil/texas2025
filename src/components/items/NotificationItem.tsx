import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { routeHandlersKeys } from "@/utils/constants";
import { useRouter } from "@/navigation";
import cn from "@/utils/cn";
import NextLink from "@/components/global/NextLink";
// Types
import { NotificationItemProps } from "@/types/api";
import { clientSideFetch } from "@/utils";
import { GenericResponse } from "@/types";

type NotificationProps = {
  data: NotificationItemProps;
  locale: string;
};

export default function NotificationItem({ data, locale }: NotificationProps) {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [isReaded, setIsReaded] = useState<boolean>(data.IsRead);

  const handleMarkAsRead = async () => {
    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      if (!data.IsRead) {
        dispatch(toggleModal({ loadingModal: { isOpen: true } }));

        const response = await clientSideFetch<GenericResponse<string>>(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.markAsRead}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ NotificationID: data?.ID }),
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

        setIsReaded(true);

        data?.DeepLinkPath?.trim() && router.push(data?.DeepLinkPath?.trim());
      } else {
        data?.DeepLinkPath?.trim() && router.push(data?.DeepLinkPath?.trim());

        return;
      }
    } catch (error) {
      console.log("Err from notification", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <div
      className={cn(
        "smooth relative flex h-full cursor-pointer items-center rounded-lg p-1 shadow hover:shadow-md",
        !isReaded && "bg-gray-100",
      )}
      onClick={() => handleMarkAsRead()}
    >
      {data.IconURL && (
        <div className="relative h-full w-20 shrink-0">
          <img
            src={data.IconURL}
            alt={data.Title}
            width={80}
            height={80}
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex h-full w-full flex-col p-2">
        <div className="flex-between gap-1">
          {data?.DeepLinkPath?.trim() ? (
            <NextLink href={data?.DeepLinkPath?.trim()}>
              <h3 className="smooth mb-2 line-clamp-1 text-xl font-semibold capitalize group-hover:text-alt">
                {data?.Title}
              </h3>
            </NextLink>
          ) : (
            <h3 className="smooth mb-2 line-clamp-1 text-xl font-semibold capitalize group-hover:text-alt">
              {data?.Title}
            </h3>
          )}
          <span className="text-xs text-gray-500">{data?.CreatedDate}</span>
        </div>

        {data?.DeepLinkPath?.trim() ? (
          <NextLink href={data?.DeepLinkPath?.trim()}>
            <p className="h-auto flex-grow self-stretch truncate leading-tight text-gray-500">
              {data?.Description}
            </p>
          </NextLink>
        ) : (
          <p className="h-auto flex-grow self-stretch truncate leading-tight text-gray-500">
            {data?.Description}
          </p>
        )}
      </div>
    </div>
  );
}
