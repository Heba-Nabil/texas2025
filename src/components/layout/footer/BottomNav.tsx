"use client";

import { useSearchParams } from "next/navigation";
import {
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  GlobeAltIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/solid";
import cn from "@/utils/cn";
import { isModuleOn } from "@/utils";
import { usePathname } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import useOrders from "@/hooks/useOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { AUTH_NOT_AVAILIABLE_REDIRECT, fixedKeywords } from "@/utils/constants";
import { getGuestSession } from "@/utils/getSessionHandler";
import {
  toggleModal,
  toggleShowDashboardPages,
} from "@/store/features/global/globalSlice";
import NextActiveLink from "@/components/global/NextActiveLink";
import NextLink from "@/components/global/NextLink";
import CartIcon from "@/components/layout/CartIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetContentWrapper,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LocaleSwitcher from "@/components/global/LocaleSwitcher";
import TexasIcon from "@/components/icons/TexasIcon";
import PinsIcon from "@/components/icons/PinsIcon";
import HelpCenterIcon from "@/components/icons/HelpCenterIcon";
import TrackIcon from "@/components/icons/TrackIcon";
// Types
import { BottomNavResourcesProps } from "@/types/resources";

type BottomNavProps = {
  resources: BottomNavResourcesProps;
  locale: string;
};

export default function BottomNav(props: BottomNavProps) {
  const { resources, locale } = props;

  const pathname = usePathname()?.toLowerCase();
  const searchParams = useSearchParams();

  const isAuthRoute = AUTH_NOT_AVAILIABLE_REDIRECT?.find((item) =>
    pathname.startsWith(item),
  );

  const isCheckout = pathname.indexOf("/checkout") !== -1;

  const {
    Languages,
    Data: { CustomerServiceLine, EnableLoyaltyProgram },
    Module,
  } = useData();

  const session = useAppSelector(getClientSession);

  const { data: guestOrdersData } = useOrders(locale, session?.isGuest);
  const { data: userOrdersData } = useOrders(locale, session?.isUser);

  const availableGuestSession = getGuestSession();

  const dispatch = useAppDispatch();

  const openMobilePage = () => {
    dispatch(toggleShowDashboardPages(false));
  };

  // Remove it in case of Checkout page
  if (isCheckout) return null;

  if (searchParams.get(fixedKeywords.AppView)) {
    return null;
  }

  return (
    <nav className="flex-center fixed inset-x-0 bottom-0 z-20 h-[70px] w-full border-t bg-white/80 shadow backdrop-blur">
      <div className="container py-1">
        <ul className="flex gap-2">
          <li className="flex-center flex-grow">
            <NextActiveLink
              href="/"
              className="flex-center flex-col gap-0.5 text-center text-sm capitalize"
              activeClassName="text-main"
            >
              <HomeIcon className="size-5" />

              <span className="text-dark dark:text-white">
                {resources["home"]}
              </span>
            </NextActiveLink>
          </li>

          <li className="flex-center flex-grow">
            <NextLink
              href="/menu"
              className={cn(
                "flex-center flex-col gap-0.5 text-center text-sm capitalize",
                {
                  "text-main": pathname.includes("/menu"),
                },
              )}
            >
              <Squares2X2Icon className="size-5" />

              <span className="text-dark">{resources["menu"]}</span>
            </NextLink>
          </li>

          <li className="flex-center flex-grow">
            <CartIcon
              iconSrc={
                locale === "ar"
                  ? "/images/icons/bottom-emptyCart-ar.svg"
                  : "/images/icons/cartFooter.svg"
              }
              iconWrapperClassName="p-2 rounded-full bg-main"
              iconClassName="size-6"
            />
          </li>

          <li className="flex-center flex-grow">
            <NextActiveLink
              href={
                session?.isUser
                  ? "/dashboard/profile"
                  : isAuthRoute
                    ? "/login"
                    : `/login?${fixedKeywords.redirectTo}=${pathname}`
              }
              className="flex-center flex-col gap-0.5 text-center text-sm capitalize"
              activeClassName="text-main"
              onClick={openMobilePage}
              scroll={false}
            >
              <UserIcon className="size-5" />

              <span className="text-dark">
                {session?.isUser ? resources["profile"] : resources["login"]}
              </span>
            </NextActiveLink>
          </li>

          <li className="flex-center flex-grow">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex-center flex-col gap-0.5 text-center text-sm capitalize"
                >
                  <EllipsisHorizontalIcon className="size-5" />

                  <span className="text-dark">{resources["more"]}</span>
                </button>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="flex max-h-[85vh] w-full flex-col gap-0 rounded-t-3xl"
              >
                <SheetHeader showCloseButton={true}>
                  <SheetTitle>{resources["settings"]}</SheetTitle>
                  <SheetDescription className="sr-only">
                    {resources["settings"]}
                  </SheetDescription>
                </SheetHeader>

                <SheetContentWrapper className="bg-gray-100 p-0 pb-10">
                  <ul className="flex w-full flex-grow flex-col items-start bg-white px-3">
                    {Languages?.length === 2 && (
                      <li className="w-full border-b px-2 py-3">
                        <LocaleSwitcher
                          className="flex w-full items-center gap-3 capitalize"
                          locale={locale}
                          languages={Languages}
                          isUser={session?.isUser}
                        >
                          <GlobeAltIcon className="size-5 shrink-0" />

                          <span className="flex-grow text-start">
                            {Languages?.find(
                              (item) =>
                                item.Code?.toLowerCase() !==
                                locale?.toLowerCase(),
                            )?.Name || resources["langBtn"]}
                          </span>

                          <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                        </LocaleSwitcher>
                      </li>
                    )}

                    <li className="w-full border-b px-2 py-3">
                      <SheetClose asChild>
                        <button
                          type="button"
                          className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                          onClick={() =>
                            dispatch(
                              toggleModal({
                                changeCountryModal: { isOpen: true },
                              }),
                            )
                          }
                        >
                          <FlagIcon className="size-5 shrink-0" />

                          <span className="flex-grow text-start">
                            {resources["country"]}
                          </span>

                          <ChevronRightIcon className="h-4 w-4 shrink-0 rtl:-scale-x-100" />
                        </button>
                      </SheetClose>
                    </li>

                    {Boolean(isModuleOn(Module, "LOCATION")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/locations"
                            className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                            activeClassName="text-main"
                          >
                            <PinsIcon />

                            <span className="flex-grow text-start">
                              {resources["locations"]}
                            </span>

                            <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "STORY")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/about"
                            className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                            activeClassName="text-main"
                          >
                            <TexasIcon />

                            <span className="flex-grow text-start">
                              {resources["ourStory"]}
                            </span>

                            <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "HALAL")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/halal"
                            className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                            activeClassName="text-main"
                          >
                            <img
                              src="/images/icons/halal.svg"
                              alt="halal"
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                              loading="lazy"
                            />

                            <span className="flex-grow text-start">
                              {resources["halal"]}
                            </span>

                            <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "FAQ")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/faq"
                            className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                            activeClassName="text-main"
                          >
                            <QuestionMarkCircleIcon className="size-5 shrink-0" />

                            <span className="flex-grow text-start">
                              {resources["faq"]}
                            </span>

                            <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {session?.isGuest &&
                      availableGuestSession &&
                      guestOrdersData &&
                      guestOrdersData?.length > 0 && (
                        <li className="w-full border-b px-2 py-3">
                          <SheetClose asChild>
                            <NextActiveLink
                              href={`/track-order/${guestOrdersData[0]?.OrderNumber}`}
                              className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                              activeClassName="text-main"
                            >
                              <TrackIcon className="size-5" />

                              <span className="flex-grow text-start">
                                {resources["trackOrder"]}
                              </span>

                              <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                            </NextActiveLink>
                          </SheetClose>
                        </li>
                      )}

                    {session?.isUser &&
                      userOrdersData &&
                      userOrdersData?.length > 0 && (
                        <li className="w-full border-b px-2 py-3">
                          <SheetClose asChild>
                            <NextActiveLink
                              href="/dashboard/orders"
                              className="smooth flex w-full items-center gap-3 capitalize hover:text-main"
                              activeClassName="text-main"
                            >
                              <TrackIcon className="size-5" />

                              <span className="flex-grow text-start">
                                {resources["trackOrder"]}
                              </span>

                              <ChevronRightIcon className="size-4 shrink-0 rtl:-scale-x-100" />
                            </NextActiveLink>
                          </SheetClose>
                        </li>
                      )}
                  </ul>

                  <ul className="mt-3 flex w-full flex-grow flex-col items-start bg-white px-3">
                    {EnableLoyaltyProgram && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/rewards"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["rewards"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "News")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/news"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["news"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "BLOG")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/blogs"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["blogs"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "CAREER")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/careers"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["careers"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "BirthDay")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/party"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["party"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "BirthDayForm")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/birthday"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["birthdayPackage"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "FRANCHISING")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <a
                            href="https://franchise.texaschicken.com/"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            rel="noopener"
                            target="_blank"
                          >
                            {resources["franchising"]}
                          </a>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "PrivacyRequest")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/privacy-request"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["privacyRequest"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(
                      isModuleOn(Module, "Footer_TermsAndcondition"),
                    ) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/terms"
                            className="smooth group flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["termsConditions"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "Footer_Privacy")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/privacy"
                            className="smooth group flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["privacyPolicy"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "ReportIssue")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/report-issue"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["reportIssue"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "SuggestFeature")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/suggest-feature"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["suggestFeature"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "GetTheApp")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/get-app"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["getApp"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {Boolean(isModuleOn(Module, "CONTACT")) && (
                      <li className="w-full border-b px-2 py-3">
                        <SheetClose asChild>
                          <NextActiveLink
                            href="/contact"
                            className="smooth flex w-full items-center gap-3 capitalize text-dark-gray hover:text-dark"
                            activeClassName="text-main"
                          >
                            <span className="flex-grow text-start">
                              {resources["contactUs"]}
                            </span>
                          </NextActiveLink>
                        </SheetClose>
                      </li>
                    )}

                    {parseInt(CustomerServiceLine?.trim()) ? (
                      <li className="w-full px-2 py-3">
                        <SheetClose asChild>
                          <a
                            href={`tel:${CustomerServiceLine?.trim()?.replace(/-/g, "")}`}
                            className="smooth flex w-full items-center gap-2 capitalize hover:text-main"
                          >
                            <HelpCenterIcon className="size-7" />

                            <span className="flex-grow text-start text-sm font-bold">
                              {CustomerServiceLine?.trim()}
                            </span>
                          </a>
                        </SheetClose>
                      </li>
                    ) : null}
                  </ul>
                </SheetContentWrapper>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </div>
    </nav>
  );
}
