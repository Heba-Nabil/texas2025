"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@/providers/DataProvider";
import { usePathname } from "@/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import {
  setActiveOrderType,
  toggleModal,
  toggleShowDashboardPages,
} from "@/store/features/global/globalSlice";
import useOrders from "@/hooks/useOrders";
import { findById, getGreeting } from "@/utils";
import { AUTH_NOT_AVAILIABLE_REDIRECT, fixedKeywords } from "@/utils/constants";
import { getGuestSession } from "@/utils/getSessionHandler";
import OrderLocation from "./OrderLocation";
import NextLink from "@/components/global/NextLink";
import OrderTypesNav from "./OrderTypesNav";
import GuestDropdownMenu from "./GuestDropdownMenu";
import UserDropdownMenu from "./UserDropdownMenu";
import CartIcon from "@/components/layout/CartIcon";
import LocaleSwitcher from "@/components/global/LocaleSwitcher";
// Types
import { HeaderResourcesProps } from "@/types/resources";

type HeaderProps = {
  locale: string;
  resources: HeaderResourcesProps;
};

export default function Header({ locale, resources }: HeaderProps) {
  const {
    Languages,
    OrderTypes,
    Stores,
    Cities,
    Data: { EnableLoyaltyProgram },
  } = useData();

  // const [welcomeMsg, setWelcomeMsg] = useState("");

  // useEffect(() => {
  //   setWelcomeMsg(
  //     getGreeting({
  //       goodAfternoon: resources["goodAfternoon"],
  //       goodEvening: resources["goodEvening"],
  //       goodMorning: resources["goodMorning"],
  //     }),
  //   );
  // }, []);
  const welcomeMsg = getGreeting({
    goodAfternoon: resources["goodAfternoon"],
    goodEvening: resources["goodEvening"],
    goodMorning: resources["goodMorning"],
  });

  const pathname = usePathname()?.toLowerCase();
  const searchParams = useSearchParams();

  const isAuthRoute = AUTH_NOT_AVAILIABLE_REDIRECT?.find((item) =>
    pathname.startsWith(item),
  );

  const session = useAppSelector(getClientSession);

  const { data: ordersData } = useOrders(locale, session?.isGuest);

  const guestHasCompletedOrders = ordersData ? ordersData?.length > 0 : false;

  const showOrderTypesNav =
    pathname.indexOf("/checkout") === -1 &&
    pathname.indexOf("/track-order") === -1;
  // pathname.indexOf("/menu") === -1;

  // const showSearch = pathname.indexOf("/menu") !== -1;

  const isCheckout = pathname.indexOf("/checkout") !== -1;

  const {
    selectedOrderTypeId,
    orderLocation: { storeId, cityId, areaId },
  } = useAppSelector((state) => state.order);

  const selectedOrderType = findById(OrderTypes, selectedOrderTypeId!);
  const selectedStore = findById(Stores, storeId!);
  const selectedCity = findById(Cities, cityId!);

  const dispatch = useAppDispatch();

  const availableGuestSession = getGuestSession();

  // Handle Find Store
  const handleOrderLocation = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedOrderType) {
      dispatch(setActiveOrderType(id));
    } else {
      dispatch(setActiveOrderType(OrderTypes[0]?.ID));
    }

    dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));
  };

  // Handle Select Order Type
  const handleSelectActiveOrderType = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(setActiveOrderType(id));

    dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));
  };

  const openMobilePage = useCallback(
    () => setTimeout(() => dispatch(toggleShowDashboardPages(true)), 1000),
    [dispatch],
  );

  // Checkout Simple Header
  if (isCheckout) return null;

  if (searchParams.get(fixedKeywords.AppView)) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white py-1 lg:sticky lg:top-0 lg:z-30 lg:h-[104px]">
      <nav className="flex-between container gap-3 max-lg:flex-wrap lg:h-[95px]">
        <div className="order-1 flex items-center max-md:w-full">
          <NextLink href="/" className="flex shrink-0" aria-label="logo">
            <img
              src={
                locale === "ar"
                  ? "/images/icons/Texas logo AR.svg"
                  : "/images/icons/Texas logo.svg"
              }
              alt={resources["texasChicken"]}
              width={64}
              height={64}
              loading="lazy"
              className="size-16 object-contain lg:size-24"
            />
          </NextLink>

          <div className="flex flex-col max-md:flex-grow">
            {session?.isUser && (
              <NextLink
                href="/dashboard/profile"
                className="w-fit px-1 text-lg font-bold capitalize"
                onClick={openMobilePage}
              >
                {welcomeMsg ? welcomeMsg : resources["goodMorning"]}{" "}
                {session?.info?.firstName && (
                  <span className="text-accent">
                    {session?.info?.firstName?.trim()} !
                  </span>
                )}
              </NextLink>
            )}

            <OrderLocation
              selectedOrderType={selectedOrderType}
              selectedStore={selectedStore}
              selectedCity={selectedCity}
              areaId={areaId}
              resources={{
                change: resources["change"],
                findStore: resources["findStore"],
              }}
              handleClick={handleOrderLocation}
            />
          </div>

          {EnableLoyaltyProgram && (
            <div className="ms-auto md:hidden">
              <NextLink
                href={session?.isUser ? "/dashboard/rewards" : "/rewards"}
                className="flex"
                aria-label="texas rewards"
              >
                <img
                  src="/images/icons/tex-rewards-tm.svg"
                  alt="tex rewards"
                  width={60}
                  height={43}
                  loading="lazy"
                  className="object-contain"
                />
              </NextLink>
            </div>
          )}
        </div>

        <div className="flex-center order-3 shrink-0 flex-grow lg:order-2">
          {/* {showSearch && (
            <MenuSearch
              locale={locale}
              resources={{
                searchHere: resources["searchHere"],
              }}
              // branchId={orderLocation?.branchId}
              // orderTypeId={orderTypeId}
            />
          )} */}

          {showOrderTypesNav && OrderTypes?.length !== 0 && (
            <OrderTypesNav
              data={OrderTypes}
              selectedOrderTypeId={selectedOrderTypeId}
              handleClick={handleSelectActiveOrderType}
            />
          )}
        </div>

        <ul className="order-2 hidden items-center gap-3 md:order-3 md:flex">
          <li>
            <CartIcon
              label={resources["myCart"]}
              iconClassName="size-[30px]"
              iconSrc={
                locale === "ar"
                  ? "/images/icons/bottom-emptyCart-ar.svg"
                  : "/images/icons/cart.svg"
              }
            />
          </li>

          <li className="group relative mt-2">
            {session?.isGuest && (
              <>
                {ordersData &&
                guestHasCompletedOrders &&
                availableGuestSession ? (
                  <GuestDropdownMenu
                    resources={resources}
                    orderNumber={ordersData[0]?.OrderNumber}
                  />
                ) : (
                  <NextLink
                    href={
                      isAuthRoute
                        ? "/login"
                        : `/login?${fixedKeywords.redirectTo}=${pathname}`
                    }
                    className="flex-center smooth flex-col text-center hover:text-main"
                    scroll={false}
                  >
                    <UserIcon className="size-[30px] shrink-0" />{" "}
                    {resources["signIn"]}
                  </NextLink>
                )}
              </>
            )}

            {session?.isUser && (
              <UserDropdownMenu
                locale={locale}
                enableLoyaltyProgram={EnableLoyaltyProgram}
                resources={resources}
                data={session?.info}
                userImg={session?.picture}
              />
            )}
          </li>

          {Languages?.length === 2 && (
            <li>
              <Suspense>
                <LocaleSwitcher
                  locale={locale}
                  languages={Languages}
                  className="hover:text-main"
                  isUser={session?.isUser}
                >
                  {Languages?.find(
                    (item) =>
                      item.Code?.toLowerCase() !== locale?.toLowerCase(),
                  )?.Name || resources["langBtn"]}
                </LocaleSwitcher>
              </Suspense>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
