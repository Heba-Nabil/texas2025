import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/navigation";
import { getSession, isAuthenticated } from "@/server/lib/auth";
import { getCartItems } from "@/server/services/cartService";
import { getUserDeals } from "@/server/services/dealsService";
import { getUserProfileData } from "@/server/services/userService";
import {
  BILL_LINE,
  CHECKOUT_RESPONSE,
  GUEST_DATA,
  ORDER_DATE,
} from "@/utils/constants";
import CheckoutView from "@/views/checkout/CheckoutView";
// Types
import type { Metadata } from "next";
import { CheckoutPageResourcesProps } from "@/types/resources";
import { BillLineCookieProps, UserSessionDataProps } from "@/types";

type CheckoutPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: CheckoutPageProps,
): Promise<Metadata> {
  return {
    title: "Checkout",
  };
}

export const dynamic = "force-dynamic";

export default async function CheckoutPage(props: CheckoutPageProps) {
  const {
    params: { locale },
  } = props;

  const isLogedIn = await isAuthenticated();
  const { userId } = await getSession();
  if (!isLogedIn) return redirect("/login");

  const [t, cartResponse] = await Promise.all([
    getTranslations(),
    getCartItems(locale),
  ]);

  let userDealsResponse, userProfileResponse;

  if (userId) {
    [userDealsResponse, userProfileResponse] = await Promise.all([
      getUserDeals(locale),
      getUserProfileData(locale),
    ]);
  }

  const cookieStore = cookies();

  const guestDataFromCookie: UserSessionDataProps = cookieStore.get(GUEST_DATA)
    ?.value
    ? JSON.parse(cookieStore.get(GUEST_DATA)?.value!)
    : null;

  const billDataFromCookie: BillLineCookieProps = cookieStore.get(BILL_LINE)
    ?.value
    ? JSON.parse(cookieStore.get(BILL_LINE)?.value!)
    : null;

  let cartData = cartResponse?.data
    ? cartResponse?.data?.Lines?.length > 0
      ? cartResponse?.data
      : billDataFromCookie
    : billDataFromCookie;

  const cachedOrderTime = cookieStore.get(ORDER_DATE)?.value
    ? cookieStore.get(ORDER_DATE)?.value === "now"
      ? cookieStore.get(ORDER_DATE)?.value
      : JSON.parse(cookieStore.get(ORDER_DATE)?.value!)
    : "";
  const cachedCheckoutResponse = cookieStore.get(CHECKOUT_RESPONSE)?.value
    ? JSON.parse(cookieStore.get(CHECKOUT_RESPONSE)?.value!)
    : null;

  const currentDate = new Date();

  if (
    !cartData ||
    (cartData?.Lines?.length < 1 &&
      cartData?.Deals &&
      cartData.Deals.length < 1)
  ) {
    return redirect("/cart");
  }

  const resources: CheckoutPageResourcesProps = {
    checkout: t("checkout"),
    backToCart: t("backToCart"),
    requiredName: t("requiredName"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    specialInstructions: t("specialInstructions"),
    change: t("change"),
    alreadyHaveAccount: t("alreadyHaveAccount"),
    orderSummary: t("orderSummary"),
    item: t("item"),
    items: t("items"),
    placeOrderNow: t("placeOrderNow"),
    subTotal: t("subTotal"),
    deliveryFees: t("deliveryFees"),
    tax: t("tax"),
    discount: t("discount"),
    selectPaymentMode: t("selectPaymentMode"),
    orderNow: t("orderNow"),
    scheduleOrder: t("scheduleOrder"),
    scheduleOrderDesc: t("scheduleOrderDesc"),
    today: t("today"),
    tomorrow: t("tomorrow"),
    orderTime: t("orderTime"),
    selectTimeFirst: t("selectTimeFirst"),
    save: t("save"),
    cancel: t("cancel"),
    captchaRequired: t("captchaRequired"),
    paymentMethod: t("paymentMethod"),
    confirm: t("confirm"),
    logIn: t("logIn"),
    chooseTime: t("chooseTime"),
    addInstructionsOptional: t("addInstructionsOptional"),
    from: t("from"),
    to: t("to"),
    workingHours: t("workingHours"),
    pleaseSelectOrderDate: t("pleaseSelectOrderDate"),
    paymentRequired: t("paymentRequired"),
    orPayWith: t("orPayWith"),
    total: t("total"),
    missingRequiredParameter: t("missingRequiredParameter"),
    time: t("time"),
    at: t("at"),
    promoCodeDiscount: t("promoCodeDiscount"),
    dealsDiscount: t("dealsDiscount"),
    allPricesAreVatInclusive: t("allPricesAreVatInclusive"),
    phone: t("phone"),
    texasChicken: t("texasChicken"),
  };

  return (
    <CheckoutView
      resources={resources}
      locale={locale}
      cartData={cartData}
      currentDate={currentDate}
      defaultGuestData={guestDataFromCookie}
      cachedOrderTime={cachedOrderTime}
      cachedCheckoutResponse={cachedCheckoutResponse}
      userDeals={userDealsResponse?.data}
      userProfile={userProfileResponse?.data}
    />
  );
}
