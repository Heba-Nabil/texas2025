"use client";

import { useCallback, useEffect } from "react";
import {
  ChevronRightIcon,
  MapPinIcon,
  PowerIcon,
  // StarIcon,
} from "@heroicons/react/24/solid";
import { useData } from "@/providers/DataProvider";
import { usePathname, useRouter } from "@/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import cn from "@/utils/cn";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { getClientSession } from "@/store/features/auth/authSlice";
import {
  toggleModal,
  toggleShowDashboardPages,
} from "@/store/features/global/globalSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NextLink from "@/components/global/NextLink";
import NextActiveLink from "@/components/global/NextActiveLink";
import NotificationsIcon from "@/components/icons/NotificationsIcon";
import KeyIcon from "@/components/icons/KeyIcon";
import DealsIcon from "@/components/icons/DealsIcon";
// Types
import { ProfileDataProps } from "@/types/api";
import { DashboardSidebarResourcesProps } from "@/types/resources";

type DashboardSidebarProps = {
  isAccessTokenExpired: boolean;
  data?: ProfileDataProps | null;
  resources: DashboardSidebarResourcesProps;
  locale: string;
};

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const { isAccessTokenExpired, resources, data, locale } = props;

  const clearSession = useCallback(async () => {
    await clearServerCookie();

    window.location.replace(`/${locale}`);
  }, [locale]);

  useEffect(() => {
    if (isAccessTokenExpired) {
      clearSession();
    }
  });

  const {
    Data: { EnableLoyaltyProgram, EnableDeals },
  } = useData();

  const router = useRouter();
  const pathname = usePathname()?.toLowerCase();

  const session = useAppSelector(getClientSession);

  const dispatch = useAppDispatch();

  const openMobilePage = useCallback(
    () => setTimeout(() => dispatch(toggleShowDashboardPages(true)), 1000),
    [dispatch],
  );

  useEffect(() => {
    if (pathname !== "/dashboard/profile") {
      dispatch(toggleShowDashboardPages(true));
    }
  }, [dispatch, router, pathname]);

  const handleTriggerLogout = () => {
    dispatch(toggleModal({ logOutModal: { isOpen: true } }));
  };

  if (!data) return null;

  return (
    <div className="sticky top-0 flex w-full flex-col rounded-lg bg-white p-5 lg:top-28">
      <div className="mb-3 rounded-lg bg-white p-4 shadow">
        <div className="relative flex items-center gap-3">
          <NextLink href="/dashboard/profile" className="shrink-0">
            <Avatar>
              {session?.picture && (
                <AvatarImage src={session?.picture} alt="profile logo" />
              )}
              <AvatarFallback>
                {data?.FirstName[0]} {data?.LastName[0]}
              </AvatarFallback>
            </Avatar>
          </NextLink>

          <div
            // href="/dashboard/profile"
            className="w-full flex-grow pe-24"
          >
            <h1 className="text-lg font-bold capitalize">{data?.FirstName}</h1>
            {data?.Phone && (
              <p className="font-bold rtl:text-right" dir="ltr">
                {data?.Phone}
              </p>
            )}
            {data?.Email && <p className="text-gray-500">{data?.Email}</p>}
          </div>

          <button
            type="button"
            className="absolute top-0 flex items-center gap-2 ltr:right-0 rtl:left-0"
            onClick={handleTriggerLogout}
          >
            <i className="flex-center size-5 shrink-0 rounded-full bg-alt text-white">
              <PowerIcon className="size-3" />
            </i>
            <span className="text-base font-bold capitalize">
              {resources["logOut"]}
            </span>
          </button>
        </div>

        <div className="flex-center">
          <Button asChild className="mt-3 w-4/5">
            <NextLink href="/dashboard/profile" onClick={openMobilePage}>
              {resources["updateYourDetails"]}
            </NextLink>
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div
          className={cn(
            "mb-3 flex bg-white py-3",
            EnableLoyaltyProgram
              ? "justify-around gap-2"
              : "justify-center gap-4",
          )}
        >
          <NextActiveLink
            href="/dashboard/favourites"
            className="flex-center shrink-0 flex-col text-center"
            activeClassName="text-main"
            onClick={openMobilePage}
          >
            {/* <span className="flex-center mb-1 size-16 rounded-full bg-main/20 sm:size-20"> */}
            <img
              src="/images/icons/favourits.svg"
              alt={resources["favourites"]}
              width={64}
              height={64}
              className="mb-1 size-16 max-w-full object-contain sm:size-20"
              loading="lazy"
            />
            {/* </span> */}
            <span className="text-sm capitalize">
              {resources["favourites"]}
            </span>
          </NextActiveLink>

          {EnableLoyaltyProgram && (
            <NextActiveLink
              href="/dashboard/rewards"
              className="flex-center shrink-0 flex-col text-center"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              {/* <span className="flex-center mb-1 size-16 rounded-full bg-main/20 sm:size-20"> */}
              <img
                src="/images/icons/empty-rewards.svg"
                alt={resources["rewards"]}
                width={64}
                height={64}
                className="mb-1 size-16 max-w-full object-contain sm:size-20"
              />
              {/* </span> */}
              <span className="text-sm capitalize">{resources["rewards"]}</span>
            </NextActiveLink>
          )}

          <NextActiveLink
            href="/dashboard/orders"
            className="flex-center shrink-0 flex-col text-center"
            activeClassName="text-main"
            onClick={openMobilePage}
          >
            {/* <span className="flex-center mb-1 size-16 rounded-full bg-main/20 sm:size-20"> */}
            <img
              src={
                locale === "ar"
                  ? "/images/icons/emptyCart-ar.svg"
                  : "/images/icons/cart-with-circle.svg"
              }
              alt={resources["orders"]}
              width={64}
              height={64}
              className="mb-1 aspect-square size-16 max-w-full object-contain sm:size-20"
            />
            {/* </span> */}
            <span className="text-sm capitalize">{resources["orders"]}</span>
          </NextActiveLink>
        </div>

        <ul className="divide-y divide-slate-100">
          <li>
            <NextActiveLink
              href="/dashboard/addresses"
              className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              <MapPinIcon className="size-5" />
              <h3 className="flex-grow font-semibold">
                {resources["myAddresses"]}
              </h3>
              <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
            </NextActiveLink>
          </li>
          <li>
            <NextActiveLink
              href="/dashboard/change-password"
              className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              <KeyIcon className="size-5" />
              <h3 className="flex-grow font-semibold">
                {resources["changePassword"]}
              </h3>
              <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
            </NextActiveLink>
          </li>
          {/* <li>
            <NextActiveLink
              href="/dashboard/offers"
              className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              <StarIcon className="size-5" />
              <h3 className="flex-grow font-semibold">{resources["Offers"]}</h3>
              <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
            </NextActiveLink>
          </li> */}
          {(EnableLoyaltyProgram || EnableDeals) && (
            <li>
              <NextActiveLink
                href="/dashboard/deals"
                className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
                activeClassName="text-main"
                onClick={openMobilePage}
              >
                <DealsIcon className="size-5" />
                <h3 className="flex-grow font-semibold">
                  {resources["deals"]}
                </h3>
                <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
              </NextActiveLink>
            </li>
          )}
          <li>
            <NextActiveLink
              href="/dashboard/notifications"
              className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              <NotificationsIcon className="size-5" />
              <h3 className="flex-grow font-semibold">
                {resources["notifications"]}
              </h3>
              <ChevronRightIcon className="size-3 rtl:-scale-x-100" />
            </NextActiveLink>
          </li>
          <li>
            <NextActiveLink
              href="/dashboard/delete"
              className="smooth flex items-center gap-2 px-4 py-3 hover:text-main"
              activeClassName="text-main"
              onClick={openMobilePage}
            >
              <img
                src="/images/icons/delete-account.svg"
                alt="delete account"
                width={20}
                height={20}
                className="size-5 shrink-0 object-contain"
                loading="lazy"
              />

              <h3 className="flex-grow font-semibold text-alt">
                {resources["deleteMyAccount"]}
              </h3>

              {/* <ChevronRightIcon className="size-3 rtl:-scale-x-100" /> */}
            </NextActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
