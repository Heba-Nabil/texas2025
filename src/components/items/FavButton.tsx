import { toggleModal } from "@/store/features/global/globalSlice";
import { useAppDispatch } from "@/store/hooks";
import { clientSideFetch } from "@/utils";
import { apiErrorCodes, routeHandlersKeys } from "@/utils/constants";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { usePathname } from "@/navigation";
import { mutatePath } from "@/server/actions";
import cn from "@/utils/cn";
// Types
import { GenericResponse } from "@/types";
import {
  facebookAnalyticContent,
  googleAnalyticContents,
  snapchatAnalyticContents,
  tiktokAnalyticContent,
} from "@/types/analytics";

const RenderIcon = ({ status }: { status: boolean }) => {
  return status ? (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      className="size-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
};

type FavButtonProps = {
  id: string;
  className?: string;
  locale: string;
  resources: { removeFromFavSuccess: string; addToFavSuccess: string };
  isFav: boolean;
  facebookAnalytic: facebookAnalyticContent;
  tiktokAnalytic: tiktokAnalyticContent;
  googleAnalytic: googleAnalyticContents;
  snapchatAnalytic: snapchatAnalyticContents;
  setIsFav: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FavButton(props: FavButtonProps) {
  const {
    id,
    className,
    locale,
    isFav,
    setIsFav,
    resources,
    facebookAnalytic,
    tiktokAnalytic,
    googleAnalytic,
    snapchatAnalytic,
  } = props;

  const dispatch = useAppDispatch();

  const pathname = usePathname();

  const handleToggleFav = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const toaster = (await import("@/components/global/Toaster")).toaster;

      let response;

      // Uncomment and implement user action if necessary
      if (isFav) {
        // Remove from Favourite
        response = await clientSideFetch<Promise<GenericResponse<string>>>(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.removeFromFav}`,
          {
            method: "POST",
            body: JSON.stringify({ MenuItemID: id }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response?.hasError) {
          const isTokenExpired = response?.errors?.find(
            (item) => item.Code === apiErrorCodes.tokenExpired,
          );

          if (isTokenExpired) {
            await clearServerCookie();

            window.location.replace(`/${locale}`);
          }

          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        toaster.success({ message: resources["removeFromFavSuccess"] });
        setIsFav(false);
        await mutatePath(pathname);
      } else {
        // Add to Favourite
        response = await clientSideFetch<Promise<GenericResponse<null>>>(
          `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.addToFav}`,
          {
            method: "POST",
            body: JSON.stringify({ MenuItemID: id }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response?.hasError) {
          const isTokenExpired = response?.errors?.find(
            (item) => item.Code === apiErrorCodes.tokenExpired,
          );

          if (isTokenExpired) {
            await clearServerCookie();

            window.location.replace(`/${locale}`);
          }

          return response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        // Facebook Analytics
        !!window.fbq && fbq("track", "AddToWishlist", facebookAnalytic);

        // Tiktok Analytics
        !!window.ttq && ttq.track("AddToWishlist", tiktokAnalytic);

        // Google Analytics
        !!window.gtag &&
          window.gtag("event", "add_to_wishlist", googleAnalytic);

        // Snapchat Analytics
        !!window.snaptr && snaptr("track", "ADD_TO_WISHLIST", snapchatAnalytic);

        toaster.success({ message: resources["addToFavSuccess"] });
        setIsFav(true);
        await mutatePath(pathname);
      }
    } catch (error) {
      console.log("Err from customization page", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <button
      type="button"
      aria-label="add to fav"
      className={cn("smooth shrink-0 hover:text-main", className)}
      onClick={handleToggleFav}
    >
      <RenderIcon status={isFav} />
    </button>
  );
}
