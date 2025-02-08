"use client";

import dynamic from "next/dynamic";
import {
  createRef,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeftIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { getClientSession } from "@/store/features/auth/authSlice";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { clientSideFetch, findById, formatDateTo24HourISO } from "@/utils";
import { useRouter } from "@/navigation";
import {
  apiErrorCodes,
  BILL_LINE,
  CHECKOUT_RESPONSE,
  elementsIds,
  fixedKeywords,
  ORDER_DATE,
  PAYMENT_ID,
  routeHandlersKeys,
} from "@/utils/constants";
import {
  deleteServerCookie,
  setServerCookie,
} from "@/server/actions/serverCookie";
import { clearServerCookie } from "@/server/actions/clearCookies";
import PageHeader from "@/components/global/PageHeader";
import UserInfoStep from "./steps/UserInfoStep";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleHeader from "@/components/layout/header/SimpleHeader";
// Types
import { CheckoutPageResourcesProps } from "@/types/resources";
import {
  BillLineCookieProps,
  CaptchaRefProps,
  GenericResponse,
  UserSessionDataProps,
} from "@/types";
import {
  CartProps,
  CheckoutResponseProps,
  PaymentStatusResponseProps,
  ProfileDataProps,
  UserDealsResponseProps,
} from "@/types/api";
import {
  CartAnalyticsProps,
  facebookAnalyticItems,
  googleAnalyticItems,
  tiktokAnalyticItems,
} from "@/types/analytics";
import { useData } from "@/providers/DataProvider";
import { setGuestSession } from "@/utils/getSessionHandler";
import LoadingModal from "@/components/modals/LoadingModal";

const DynamicOrderLocationStep = dynamic(
  () => import("./steps/OrderLocationStep"),
  { ssr: false, loading: () => <Skeleton className="h-16" /> },
);

const DynamicOrderDateStep = dynamic(() => import("./steps/OrderDateStep"), {
  ssr: false,
  loading: () => <Skeleton className="h-16" />,
});

const DynamicCheckoutSummary = dynamic(() => import("./CheckoutSummary"));

const DynamicPaymentModal = dynamic(() => import("./steps/PaymentModal"));

const DynamicCheckoutGuestInfoModal = dynamic(
  () => import("./CheckoutGuestInfoModal"),
);

type CheckoutViewProps = {
  resources: CheckoutPageResourcesProps;
  cartData: CartProps | BillLineCookieProps;
  locale: string;
  currentDate: Date;
  defaultGuestData: UserSessionDataProps | undefined;
  cachedOrderTime?: string;
  cachedCheckoutResponse: CheckoutResponseProps | null;
  userDeals?: UserDealsResponseProps[] | null;
  userProfile?: ProfileDataProps | null;
};

export default function CheckoutView(props: CheckoutViewProps) {
  const {
    resources,
    cartData,
    locale,
    currentDate,
    defaultGuestData,
    cachedOrderTime,
    cachedCheckoutResponse,
    userDeals,
    userProfile,
  } = props;

  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const {
    // OrderTypes,
    Data: { CurrencyName, CurrencyISOCode, IsCartOrderTypeRequired },
  } = useData();

  const router = useRouter();

  // Facebook analytics items
  const facebookMenuItems: facebookAnalyticItems = useMemo(() => {
    return (cartData as CartAnalyticsProps)?.Lines?.map((item, index) => ({
      index: index,
      id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      item_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }));
  }, [cartData, CurrencyISOCode]);

  // Tiktok analytics items
  const tiktokMenuItems: tiktokAnalyticItems = useMemo(() => {
    return (cartData as CartAnalyticsProps)?.Lines?.map((item, index) => ({
      index: index,
      content_id: item?.MenuItem?.NameUnique,
      content_name: item?.MenuItem?.Name,
      content_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      value: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
      content_type: "product",
      description: "Product",
    }));
  }, [cartData, CurrencyISOCode]);

  // Google analytics items
  const googleMenuItems: googleAnalyticItems = useMemo(() => {
    return (cartData as CartAnalyticsProps)?.Lines?.map((item, index) => ({
      index: index,
      item_id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      item_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }));
  }, [cartData, CurrencyISOCode]);

  const facebookContentID = useMemo(() => {
    return (cartData as CartAnalyticsProps)?.Lines?.map(
      (item) => item?.MenuItem?.NameUnique,
    );
  }, [cartData]);

  useEffect(() => {
    // Facebook pixels
    !!window.fbq &&
      fbq("track", "InitiateCheckout", {
        content_type: "product",
        content_ids: facebookContentID,
        contents: facebookMenuItems,
      });

    // Tiktok pixels
    !!window.ttq &&
      ttq.track("InitiateCheckout", {
        content_type: "product",
        contents: tiktokMenuItems,
      });

    // Google events
    !!window.gtag &&
      window.gtag("event", "begin_checkout", {
        currency: CurrencyISOCode,
        value: cartData?.Total,
        items: googleMenuItems,
      });

    // Snapchat events
    !!window.snaptr &&
      window.snaptr("track", "START_CHECKOUT", {
        item_ids: (cartData as CartAnalyticsProps)?.Lines?.map(
          (item) => item?.MenuItem?.NameUnique,
        ),
        item_category: (cartData as CartAnalyticsProps)?.Lines?.map(
          (item) => item?.MenuItem?.CategoryNameUnique,
        ),
        price: (cartData as CartAnalyticsProps)?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.PriceAfterDiscount,
          0,
        ),
        item_name: (cartData as CartAnalyticsProps)?.Lines?.map(
          (item) => item?.MenuItem?.Name,
        ),
        number_items: (cartData as CartAnalyticsProps)?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.SelectedQuantity,
          0,
        ),
        currency: CurrencyISOCode,
        discount: (cartData as CartAnalyticsProps)?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.DiscountAmount,
          0,
        ),
      });
  }, [
    cartData,
    CurrencyISOCode,
    facebookContentID,
    facebookMenuItems,
    tiktokMenuItems,
    googleMenuItems,
  ]);

  // Note
  const noteRef = createRef<HTMLInputElement>();

  // Captcha
  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);

  // Order Date
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(
    cachedOrderTime ? cachedOrderTime === "now" : true,
  );
  const [orderDate, setOrderDate] = useState<string>(
    cachedOrderTime ? cachedOrderTime : formatDateTo24HourISO(new Date()),
  );
  const [orderDateError, setOrderDateError] = useState<string>("");
  const [orderTimePlan, setOrderTimePlan] = useState<number | null>(1);

  // Checkout Response
  const [checkoutResponse, setCheckoutResponse] =
    useState<CheckoutResponseProps | null>(cachedCheckoutResponse);

  // Selected Payment
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  // Personal Info Data
  const { isGuest } = useAppSelector(getClientSession);
  const [guestInfo, setGuestInfo] = useState<UserSessionDataProps | undefined>(
    defaultGuestData ? defaultGuestData : undefined,
  );
  const { selectedOrderTypeId, orderLocation } = useAppSelector(
    (state) => state.order,
  );

  // State to check whether visitor allowed to leave this page without calling rollback
  const dispatch = useAppDispatch();

  const [openGuestInfoModal, setOpenGuestInfoModal] = useState(
    isGuest && !guestInfo,
  );

  useEffect(() => {
    if (isGuest && !guestInfo) {
      setOpenGuestInfoModal(true);
    }
  }, [isGuest, guestInfo]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };

  const handleCaptchaRef = (e: SetStateAction<CaptchaRefProps>) => {
    setCaptchaRef(e);
  };

  const handleRollBack = useCallback(async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    const response = await clientSideFetch<
      Promise<GenericResponse<CheckoutResponseProps>>
    >(`${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.rollback}`, {
      method: "POST",
      body: JSON.stringify({ OrderNumber: checkoutResponse?.OrderNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await deleteServerCookie([
      ORDER_DATE,
      CHECKOUT_RESPONSE,
      PAYMENT_ID,
      ORDER_DATE,
    ]);

    setCaptcha(null);
    captchaRef?.reset();

    setCheckoutResponse(null);
    setOrderDate("");
    setOrderTimePlan(null);
    setUseCurrentTime(false);
    dispatch(toggleModal({ loadingModal: { isOpen: false } }));

    return response?.data;
  }, [checkoutResponse, locale, dispatch, captchaRef]);

  const handleCheckout = async () => {
    // Open payments modal in case of already checked out
    if (checkoutResponse) {
      const response = await clientSideFetch<{ value: string | undefined }>(
        `${process.env.NEXT_PUBLIC_API}${routeHandlersKeys.getCookieValue}`,
        {
          method: "POST",
          body: JSON.stringify({ cookieName: PAYMENT_ID }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const triggerRollback = response.value;

      console.log("cachedOrderTime", cachedOrderTime);
      if (!triggerRollback) {
        console.log("open modal");

        return setOpenPaymentModal(true);
      } else {
        console.log("rollback cachedOrderTime");

        await handleRollBack();
      }
    }

    // Validate captcha Exist
    if (!captcha) {
      const captchaWrapper = document.getElementById(
        elementsIds.checkoutCaptchaWrapper,
      );

      captchaWrapper && captchaWrapper.scrollIntoView({ behavior: "smooth" });

      return setCaptchaError(resources["captchaRequired"]);
    }

    if (isGuest && !guestInfo) return setOpenGuestInfoModal(true);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    if (!orderDate) {
      toaster.error({
        title: resources["missingRequiredParameter"],
        message: resources["pleaseSelectOrderDate"],
      });

      const orderDateWrapper = document.getElementById(
        elementsIds.orderDateWrapper,
      );

      orderDateWrapper &&
        orderDateWrapper.scrollIntoView({ behavior: "smooth" });

      return setOrderDateError(resources["pleaseSelectOrderDate"]);
    }

    const requestBody = {
      OrderTypeID: selectedOrderTypeId,
      StoreID: orderLocation?.storeId,
      Note: noteRef?.current?.value?.trim()?.replace(/[<>*#]/g, ""),
      RecaptchaToken: captcha,
      OrderDateTime: useCurrentTime
        ? formatDateTo24HourISO(new Date())
        : orderDate,
      Name: userProfile
        ? `${userProfile?.FirstName} ${userProfile?.LastName}`
        : `${guestInfo?.firstName} ${guestInfo?.lastName}`,
      Phone: userProfile ? userProfile?.Phone : guestInfo?.phone,
      Email: userProfile ? userProfile?.Email : guestInfo?.email,
      AddressID: orderLocation?.addressId,
      AreaID: orderLocation?.areaId,
      CityID: orderLocation?.cityId,
      Longitude: orderLocation?.lng,
      Latitude: orderLocation?.lat,
      Block: orderLocation?.block,
      Street: orderLocation?.street,
      Building: orderLocation?.building,
      Floor: orderLocation?.floor,
      Apartment: orderLocation?.apartment,
      Landmark: orderLocation?.landmark,
    };

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const response = await clientSideFetch<
        Promise<GenericResponse<CheckoutResponseProps>>
      >(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.checkout}`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.hasError) {
        setCaptcha(null);
        captchaRef?.reset();

        const isCartRemoved = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isCartRemoved) {
          await deleteServerCookie([BILL_LINE, CHECKOUT_RESPONSE, ORDER_DATE]);

          location.replace("/cart");
        }

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

      setGuestSession();

      if (response?.data) {
        window.history.pushState(null, "", location.href);

        setCheckoutResponse(response?.data);
        setOpenPaymentModal(true);

        await setServerCookie([
          {
            name: CHECKOUT_RESPONSE,
            value: JSON.stringify(response?.data),
            expiration: new Date(Date.now() + 1 * 60 * 60 * 1000),
          },
          {
            name: ORDER_DATE,
            value: useCurrentTime ? "now" : JSON.stringify(orderDate),
            expiration: new Date(Date.now() + 1 * 60 * 60 * 1000),
          },
        ]);
      }
    } catch (error) {
      console.log("Error at fetching payment", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleBackToCart = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    await deleteServerCookie([
      ORDER_DATE,
      CHECKOUT_RESPONSE,
      PAYMENT_ID,
      BILL_LINE,
    ]);

    if (!checkoutResponse?.OrderNumber) {
      return location.replace("/cart");
    }

    await handleRollBack();

    setCheckoutResponse(null);
    location.replace("/cart");
  };

  const handleUserInfoChange = async () => {
    if (checkoutResponse?.OrderNumber) {
      await handleRollBack();

      setCheckoutResponse(null);
    }

    setOpenGuestInfoModal(true);
  };

  // handle navigation rollback
  const handlePopstate = useCallback(
    async (e: PopStateEvent) => {
      if (checkoutResponse?.OrderNumber) {
        e.preventDefault();

        await handleRollBack();

        setCheckoutResponse(null);
        location.replace("/cart");
      }
    },
    [checkoutResponse, handleRollBack],
  );

  // Handle Logo Click in Header
  const handleLogoClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (checkoutResponse?.OrderNumber) {
      e.preventDefault();

      await handleRollBack();

      setCheckoutResponse(null);

      location.replace("/");
    } else {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      location.replace("/");
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [handlePopstate]);

  // Perform rollback in case of online payment cancelor navigate back
  // const getPaymentId = useCallback(async () => {
  //   const response = await clientSideFetch<{ value: string | undefined }>(
  //     `${process.env.NEXT_PUBLIC_API}${routeHandlersKeys.getCookieValue}`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify({ cookieName: PAYMENT_ID }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //   );

  //   return response.value;
  // }, []);

  // const selectedOrderType = findById(OrderTypes, selectedOrderTypeId!);

  // Redirect to Home to Trigger app in case of ordertype not selected
  useEffect(() => {
    if (IsCartOrderTypeRequired && !selectedOrderTypeId) {
      router.replace(
        `/?${fixedKeywords.triggerApp}=true&${fixedKeywords.redirectTo}=/menu`,
      );
    }
  }, [IsCartOrderTypeRequired, selectedOrderTypeId, router]);

  // useEffect(() => {
  //   dispatch(toggleModal({ loadingModal: { isOpen: true } }));

  //   const handleOnlinePaymentCancelRollBack = async () => {
  //     try {
  //       const paymentId = await getPaymentId();

  //       if (paymentId) {
  //         const response = await clientSideFetch<
  //           GenericResponse<PaymentStatusResponseProps>
  //         >(
  //           `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.paymentStatus}`,
  //           {
  //             method: "POST",
  //             body: JSON.stringify({ PaymentID: paymentId }),
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           },
  //         );
  //         console.log("response from payment status", response);

  //         if (response?.data && !response?.data?.IsCompleted) {
  //           console.log("Trigger rollback");
  //           checkoutResponse?.OrderNumber && handleRollBack();
  //         }

  //         if (response?.data && response?.data?.IsPaymentResponseSucceeded) {
  //           // Facebook pixels
  //           !!window.fbq &&
  //             fbq("track", "Purchase", {
  //               content_type: "product",
  //               transaction_id: checkoutResponse?.OrderNumber,
  //               value: cartData?.Total,
  //               currency: CurrencyISOCode,
  //               total_quanity: cartData?.TotalQuantity,
  //               payment: checkoutResponse?.Payments?.find(
  //                 (item) => item.ID === selectedPaymentMethodId,
  //               ),
  //               shipping: selectedOrderType?.Name,
  //               content_ids: facebookContentID,
  //               contents: facebookMenuItems,
  //             });

  //           // Tiktok pixels
  //           !!window.ttq &&
  //             ttq.track("Purchase", {
  //               content_type: "product_group",
  //               transaction_id: checkoutResponse?.OrderNumber,
  //               value: cartData?.Total,
  //               total_quanity: cartData?.TotalQuantity,
  //               currency: CurrencyISOCode,
  //               payment: checkoutResponse?.Payments?.find(
  //                 (item) => item.ID === selectedPaymentMethodId,
  //               ),
  //               shipping: selectedOrderType?.Name,
  //               contents: tiktokMenuItems,
  //             });

  //           // Snapchat pixels
  //           !!window.snaptr &&
  //             snaptr("track", "PURCHASE", {
  //               item_ids: facebookContentID,
  //               item_category: (cartData as CartAnalyticsProps)?.Lines?.map(
  //                 (item) => item?.MenuItem?.CategoryNameUnique,
  //               ),
  //               price: cartData?.Total,
  //               item_name: (cartData as CartAnalyticsProps)?.Lines?.map(
  //                 (item) => item?.MenuItem?.Name,
  //               ),
  //               number_items: cartData?.TotalQuantity,
  //               currency: CurrencyISOCode,
  //               discount: (cartData as CartAnalyticsProps)?.Lines?.reduce(
  //                 (total, item) => total + item?.MenuItem?.DiscountAmount,
  //                 0,
  //               ),
  //               transaction_id: checkoutResponse?.OrderNumber,
  //               tax: cartData?.TaxAmount,
  //               shipping: selectedOrderType?.Name,
  //             });

  //           // Google events
  //           !!window.gtag &&
  //             window.gtag("event", "purchase", {
  //               currency: CurrencyISOCode,
  //               transaction_id: checkoutResponse?.OrderNumber,
  //               value: cartData?.Total,
  //               payment: checkoutResponse?.Payments?.find(
  //                 (item) => item.ID === selectedPaymentMethodId,
  //               ),
  //               coupon: cartData?.PromoCode,
  //               tax: cartData?.TaxAmount,
  //               shipping: selectedOrderType?.Name,
  //               items: googleMenuItems,
  //             });
  //         }
  //       }
  //     } catch (error) {
  //       console.log("Error at fetching payment", (error as Error).message);
  //     } finally {
  //       dispatch(toggleModal({ loadingModal: { isOpen: false } }));
  //     }
  //   };

  //   let timer = setTimeout(() => {
  //     handleOnlinePaymentCancelRollBack();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [
  //   locale,
  //   checkoutResponse,
  //   getPaymentId,
  //   handleRollBack,
  //   dispatch,
  //   CurrencyISOCode,
  //   cartData,
  //   facebookContentID,
  //   facebookMenuItems,
  //   googleMenuItems,
  //   tiktokMenuItems,
  //   selectedOrderType,
  //   selectedPaymentMethodId,
  // ]);

  useEffect(() => {
    dispatch(toggleModal({ orderTypeModal: { isOpen: false } }));
  }, [dispatch]);

  const handleClickOnLogin = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      await deleteServerCookie([CHECKOUT_RESPONSE]);

      setCheckoutResponse(null);
    } catch (error) {
      console.log("Error at set cookie redirect", (error as Error).message);
    }

    router.push(`/login?${fixedKeywords.redirectTo}=/checkout`, {
      scroll: false,
    });

    dispatch(toggleModal({ loadingModal: { isOpen: false } }));
  };

  return (
    <div className="flex min-h-screen w-full flex-grow flex-col">
      <SimpleHeader
        locale={locale}
        resources={{ texasChicken: resources["texasChicken"] }}
        handleClick={handleLogoClick}
      />

      <div className="w-full flex-grow bg-gray-100">
        <div className="container flex-grow py-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-full lg:col-span-7">
              <div className="rounded-lg bg-white p-4">
                <PageHeader title={resources["checkout"]}>
                  <button
                    onClick={handleBackToCart}
                    className="flex-center smooth gap-1 hover:text-gray-600"
                  >
                    <span className="flex-center size-4 shrink-0 rounded-full bg-gray-200">
                      <ChevronLeftIcon className="size-3 rtl:-scale-x-100" />
                    </span>

                    {resources["backToCart"]}
                  </button>
                </PageHeader>

                {isGuest && (
                  <div
                    className="group my-1 flex cursor-pointer items-center gap-3 rounded-[7px] border-b-2 bg-gray-100 p-2"
                    onClick={handleClickOnLogin}
                  >
                    <span className="text-md font-semibold capitalize">
                      {resources["alreadyHaveAccount"]}{" "}
                      <span className="group-hover:underline">
                        {resources["logIn"]}
                      </span>
                    </span>
                  </div>
                )}

                {!isGuest && userProfile && (
                  <>
                    <UserInfoStep
                      data={{
                        firstName: userProfile?.FirstName,
                        lastName: userProfile?.LastName,
                        email: userProfile?.Email,
                        phone: userProfile?.Phone,
                      }}
                      resources={{ change: resources["change"] }}
                      handleChange={handleUserInfoChange}
                    />

                    <div className="my-1 gap-3 rounded-[7px] border-b-2 bg-gray-100 p-2">
                      <p className="text-md mb-3 font-semibold capitalize">
                        {resources["specialInstructions"]}
                      </p>

                      <div>
                        <FloatingLabelInput
                          ref={noteRef}
                          id="notes"
                          name="notes"
                          type="text"
                          label={resources["addInstructionsOptional"]}
                          startIcon={
                            <ClipboardDocumentIcon
                              className={defaultStartInputIconClassNames()}
                            />
                          }
                          defaultValue={guestInfo?.note ? guestInfo?.note : ""}
                          disabled={!!checkoutResponse}
                          readOnly={!!checkoutResponse}
                        />
                      </div>
                    </div>
                  </>
                )}

                {isGuest && guestInfo && (
                  <>
                    <UserInfoStep
                      data={guestInfo}
                      resources={{ change: resources["change"] }}
                      handleChange={handleUserInfoChange}
                    />

                    <div className="my-1 gap-3 rounded-[7px] border-b-2 bg-gray-100 p-2">
                      <p className="text-md mb-3 font-semibold capitalize">
                        {resources["specialInstructions"]}
                      </p>

                      <FloatingLabelInput
                        ref={noteRef}
                        id="notes"
                        name="notes"
                        type="text"
                        label={resources["addInstructionsOptional"]}
                        startIcon={
                          <ClipboardDocumentIcon
                            className={defaultStartInputIconClassNames()}
                          />
                        }
                        defaultValue={guestInfo?.note ? guestInfo?.note : ""}
                        disabled={!!checkoutResponse}
                        readOnly={!!checkoutResponse}
                      />
                    </div>
                  </>
                )}

                <div className="my-4 border-b-2" />

                <DynamicOrderLocationStep
                  locale={locale}
                  resources={{
                    change: resources["change"],
                    from: resources["from"],
                    to: resources["to"],
                    workingHours: resources["workingHours"],
                    phone: resources["phone"],
                  }}
                  orderTypeID={selectedOrderTypeId}
                  orderLocation={orderLocation}
                  handleRollBack={handleRollBack}
                  checkoutResponse={checkoutResponse}
                  setCheckoutResponse={setCheckoutResponse}
                />

                <div className="my-4 border-b-2" />

                <DynamicOrderDateStep
                  locale={locale}
                  resources={{
                    orderTime: resources["orderTime"],
                    orderNow: resources["orderNow"],
                    scheduleOrder: resources["scheduleOrder"],
                    scheduleOrderDesc: resources["scheduleOrderDesc"],
                    chooseTime: resources["chooseTime"],
                    cancel: resources["cancel"],
                    save: resources["save"],
                    tomorrow: resources["tomorrow"],
                    today: resources["today"],
                    selectTimeFirst: resources["selectTimeFirst"],
                    change: resources["change"],
                    time: resources["time"],
                    at: resources["at"],
                  }}
                  orderDate={orderDate}
                  orderDateError={orderDateError}
                  currentDate={currentDate}
                  setOrderDate={setOrderDate}
                  setOrderDateError={setOrderDateError}
                  setUseCurrentTime={setUseCurrentTime}
                  handleRollBack={handleRollBack}
                  checkoutResponse={checkoutResponse}
                  setCheckoutResponse={setCheckoutResponse}
                  useCurrentTime={useCurrentTime}
                  orderTypeID={selectedOrderTypeId}
                  orderTimePlan={orderTimePlan}
                  setOrderTimePlan={setOrderTimePlan}
                />
              </div>
            </div>

            {cartData && (
              <div className="col-span-full lg:col-span-5">
                <DynamicCheckoutSummary
                  resources={resources}
                  data={cartData}
                  handleCheckout={handleCheckout}
                  showCaptcha={!checkoutResponse}
                  handleCaptchaRef={handleCaptchaRef}
                  handleCaptchaChange={handleCaptchaChange}
                  captchaError={captchaError}
                  locale={locale}
                  userDeals={userDeals}
                />
              </div>
            )}
          </div>
        </div>

        {openGuestInfoModal && (
          <DynamicCheckoutGuestInfoModal
            open={openGuestInfoModal}
            guestData={guestInfo}
            userData={userProfile}
            handleClose={() => setOpenGuestInfoModal(false)}
            setGuestInfo={setGuestInfo}
          />
        )}

        {openPaymentModal && checkoutResponse && (
          <DynamicPaymentModal
            open={openPaymentModal}
            cartData={cartData}
            data={checkoutResponse}
            selectedPaymentMethodId={selectedPaymentMethodId}
            locale={locale}
            resources={{
              cancel: resources["cancel"],
              paymentMethod: resources["paymentMethod"],
              placeOrderNow: resources["placeOrderNow"],
              paymentRequired: resources["paymentRequired"],
              orPayWith: resources["orPayWith"],
              total: resources["total"],
            }}
            analytics={{
              facebookMenuItems: facebookMenuItems,
              tiktokMenuItems: tiktokMenuItems,
              googleMenuItems: googleMenuItems,
              facebookContentID: facebookContentID,
            }}
            orderTypeID={selectedOrderTypeId}
            totalPrice={cartData?.Total || 0}
            handleClose={() => setOpenPaymentModal(false)}
            setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            setOpenLoadingModal={setOpenLoadingModal}
          />
        )}
      </div>

      {openLoadingModal && (
        <LoadingModal open={openLoadingModal} locale={locale} />
      )}
    </div>
  );
}
