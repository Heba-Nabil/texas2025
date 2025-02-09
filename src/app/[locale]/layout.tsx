import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getCountryData } from "@/server/services/globalService";
import { getSession } from "@/server/lib/auth";
import {
  getCartItems,
  initializeCartService,
} from "@/server/services/cartService";
import getRequestHeaders from "@/server/lib/getRequestHeaders";
import cn from "@/utils/cn";
import { bahij, biker, texas } from "@/utils/fonts";
import { apiErrorCodes } from "@/utils/constants";
import Providers from "@/providers/Providers";
import Shared from "@/components/global/Shared";
import MainLayout from "@/components/layout/MainLayout";
// Types
import type { Metadata, Viewport } from "next";
import { ClientSessionProps, OrderLocationProps } from "@/types";

import "@/styles/react-toastify.min.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "Texas Chicken | %s",
    default: "Texas Chicken",
  },
  description: "Created by PSdigital",
};

export const viewport: Viewport = {
  themeColor: "light",
  width: "device-width",
  initialScale: 1,
  // userScalable: false,
  maximumScale: 5,
};

type LocaleLayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  auth: React.ReactNode;
  customize: React.ReactNode;
};

export default async function LocaleLayout(props: LocaleLayoutProps) {
  const {
    params: { locale },
    children,
    auth,
    customize,
  } = props;

  const [messages, countryResults, session] = await Promise.all([
    getMessages(),
    getCountryData(locale),
    getSession(),
  ]);

  let cartItems;

  if (session?.isLoggedIn) {
    cartItems = await getCartItems(locale);
  }

  // Get Language Direction
  const countryData = countryResults?.data;

  if (!countryData) throw new Error("Missing Country Data");

  // Get Default App Start Values
  const { orderTypeId, AllowTracking, orderLocation } = getRequestHeaders();

  // Initialize Cart Incase of Expired and there is Order Type Id and store id
  if (cartItems?.hasError) {
    const isExpired = Array.isArray(cartItems?.errors)
      ? cartItems?.errors?.find((err) => err.Code === apiErrorCodes.cartExpired)
      : cartItems?.errors;

    if (
      isExpired &&
      orderLocation?.storeId &&
      orderTypeId &&
      session?.isLoggedIn
    ) {
      await initializeCartService(locale, {
        StoreID: orderLocation?.storeId,
        OrderTypeID: orderTypeId,
        CityID: orderLocation?.cityId ? orderLocation?.cityId : "",
        AreaID: orderLocation?.areaId ? orderLocation?.areaId : "",
        AddressID: orderLocation?.addressId ? orderLocation?.addressId : "",
        Latitude: orderLocation?.lat ? orderLocation?.lat : 0,
        Longitude: orderLocation?.lng ? orderLocation?.lng : 0,
        Block: orderLocation?.block ? orderLocation?.block : "",
        Street: orderLocation?.street ? orderLocation?.street : "",
        Building: orderLocation?.building ? orderLocation?.building : "",
        Floor: orderLocation?.floor ? orderLocation?.floor : "",
        Apartment: orderLocation?.apartment ? orderLocation?.apartment : "",
        Landmark: orderLocation?.landmark ? orderLocation?.landmark : "",
      });
    }
  }

  // Initial Session
  const clientSession: ClientSessionProps = {
    isGuest: Boolean(session?.guestId && !session?.userId),
    isUser: !!session?.userId,
    isLoggedIn: session?.isLoggedIn,
    info: session?.info,
    picture: session?.picture,
  };

  const cartInitializeData = {
    orderTypeId: cartItems?.data?.OrderTypeID,
    storeId: cartItems?.data?.StoreID,
    cityId: cartItems?.data?.AddressInformation?.CityID,
    areaId: cartItems?.data?.AddressInformation?.AreaID,
    addressId: cartItems?.data?.AddressInformation?.AddressID,
    apartment: cartItems?.data?.AddressInformation?.Apartment,
    block: cartItems?.data?.AddressInformation?.Block,
    building: cartItems?.data?.AddressInformation?.Building,
    floor: cartItems?.data?.AddressInformation?.Floor,
    landmark: cartItems?.data?.AddressInformation?.Landmark,
    street: cartItems?.data?.AddressInformation?.Street,
    lat: cartItems?.data?.AddressInformation?.Latitude,
    lng: cartItems?.data?.AddressInformation?.Longitude,
  };

  const activeOrderTypeId = cartInitializeData?.orderTypeId
    ? cartInitializeData?.orderTypeId
    : countryData?.OrderTypes?.find((item) => item.ID === orderTypeId)?.ID;

  const activeOrderType = countryData?.OrderTypes?.find(
    (item) => item.ID === activeOrderTypeId,
  );

  const activeCity = activeOrderType?.Cities?.find(
    (item) =>
      item.ID ===
      (cartInitializeData?.cityId
        ? cartInitializeData?.cityId
        : orderLocation?.cityId),
  );

  const activeStoreId = cartInitializeData?.storeId
    ? cartInitializeData?.storeId
    : activeCity?.Stores?.find((item) => item.ID === orderLocation?.storeId)
        ?.ID;

  const activeStore = activeCity?.Stores?.find(
    (item) => item.ID === activeStoreId,
  );

  const activeAreaId = activeStore?.AreaID;

  const validatedOrderLocation: OrderLocationProps = {
    storeId: activeStoreId,
    cityId: activeCity?.ID,
    areaId: activeAreaId,
    addressId: cartInitializeData?.addressId
      ? cartInitializeData?.addressId
      : orderLocation?.addressId,
    apartment: cartInitializeData?.apartment
      ? cartInitializeData?.apartment
      : orderLocation?.apartment,
    block: cartInitializeData?.block
      ? cartInitializeData?.block
      : orderLocation?.block,
    building: cartInitializeData?.building
      ? cartInitializeData?.building
      : orderLocation?.building,
    floor: cartInitializeData?.floor
      ? cartInitializeData?.floor
      : orderLocation?.floor,
    landmark: cartInitializeData?.landmark
      ? cartInitializeData?.landmark
      : orderLocation?.landmark,
    street: cartInitializeData?.street
      ? cartInitializeData?.street
      : orderLocation?.street,
    lat: cartInitializeData?.lat ? cartInitializeData?.lat : orderLocation?.lat,
    lng: cartInitializeData?.lng ? cartInitializeData?.lng : orderLocation?.lng,
  };

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn("light", bahij.variable, texas.variable, {
        [biker.variable]: locale !== "ar",
      })}
      style={{ fontSize: locale === "ar" ? 14 : 16 }}
    >
      <body>
        {/* <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="3a34656b-cb7c-4976-8b47-2f227870317e"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        /> */}

        {/* Facebook Pixel */}
        <Script id="facebook-pixel">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Tiktok Pixel */}
        <Script id="tiktok-pixel">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
            ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


              ttq.load('${process.env.TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
        {/* Snapchat Pixel */}
        <Script id="snapchat-pixel">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');

            snaptr('init', '${process.env.SNAPCHAT_PIXEL_ID}');

            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_PIXEL_ID}`}
        ></Script>
        <Script id="google-analytics">
          {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());

            gtag('config', '${process.env.GOOGLE_PIXEL_ID}');
            `}
        </Script>

        <NextIntlClientProvider messages={messages}>
          <Providers
            countryData={countryData}
            session={clientSession}
            orderTypeId={activeOrderTypeId}
            orderLocation={validatedOrderLocation}
            allowTracking={
              clientSession?.isLoggedIn ? AllowTracking : undefined
            }
            cartItems={cartItems}
          >
            <Shared
              locale={locale}
              orderTypes={countryData?.OrderTypes}
              session={clientSession}
            >
              <MainLayout
                locale={locale}
                modules={countryData?.Module}
                enableLoyalty={countryData?.Data?.EnableLoyaltyProgram}
              >
                {children}
                {auth}
                {customize}
              </MainLayout>
            </Shared>
          </Providers>
        </NextIntlClientProvider>

        {/* <Script
          crossOrigin="anonymous"
          src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"
        /> */}
      </body>
    </html>
  );
}
