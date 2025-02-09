import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  AUTH_ROUTES,
  fixedKeywords,
  REDIRECT_STATUS,
  SESSION_ID,
  sessionIdExpireTime,
} from "./utils/constants";
// import { displayInOrder } from "./utils";
// import { defaultLanguage } from "./config";
import { defaultLocales } from "./config";
import i18nMiddleware from "./server/middlewares/i18nMiddleware";
import getRequestHeaders from "./server/lib/getRequestHeaders";
// import { getCountryData } from "./server/services/globalService";
import { getSession } from "./server/lib/auth";
// Types
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Protect From CSRF Attacks
  // if (request.method !== "GET") {
  //   const originHeader = request.headers.get("Origin");
  //   const hostHeader = request.headers.get("X-Forwarded-Host");

  //   if (originHeader === null || hostHeader === null) {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }

  //   let origin: URL;

  //   try {
  //     origin = new URL(originHeader);
  //   } catch {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }

  //   if (origin.host !== hostHeader) {
  //     return new NextResponse(null, {
  //       status: 403,
  //     });
  //   }
  // }

  // Function to get fbclid from the page URL
  function getFbclid() {
    const urlParams = request.nextUrl.searchParams;
    return urlParams.get("fbclid") || "defaultFbclid";
  }

  function getSubdomainIndex() {
    const hostname = request.nextUrl.hostname;
    const parts = hostname.split(".");

    if (parts.length === 2) {
      return 1; // example.com
    } else if (parts.length === 3) {
      return 2; // www.example.com
    } else {
      return 0; // com
    }
  }

  function getSessionId() {
    const fbclid = getFbclid();
    const subdomainIndex = getSubdomainIndex();
    const creationTime = Date.now();

    const sessionId = `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
    return sessionId;
  }

  let url = request.nextUrl.pathname.toLowerCase();

  // let sessionId = request.cookies.get(SESSION_ID)?.value;
  let sessionId = getSessionId();

  // Set Session ID in case of Not Exist
  if (!sessionId) {
    sessionId = uuidv4();
  }

  // Internationalization
  const response = await i18nMiddleware(request);

  response.cookies.set({
    name: SESSION_ID,
    value: sessionId,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + sessionIdExpireTime),
  });

  // const countryData = await getCountryData(defaultLanguage);
  const languageCodes = defaultLocales;
  // const languageCodes =
  //   countryData?.data?.Languages?.map((item) => item.Code) || [];

  for (let i in languageCodes) {
    url = url.replace(`/${languageCodes[i]}`, "");
  }

  // Menu Redirects
  const { orderTypeId, orderLocation } = getRequestHeaders();

  // Trigger Select Order Type Modal in case of no store selected
  if (url.includes("/menu")) {
    //   if (
    //     !countryData?.hasError &&
    //     countryData?.data?.Data?.IsCartOrderTypeRequired
    //   ) {
    if (!orderTypeId || !orderLocation?.storeId) {
      return NextResponse.redirect(
        new URL(
          `/?${fixedKeywords.triggerApp}=true&${fixedKeywords.redirectTo}=${url}`,
          request.nextUrl,
        ),
      );
    }

    //     const { userId } = await getSession();
    //     const selectedOrderType = countryData?.data?.OrderTypes?.find(
    //       (item) => item.ID === orderTypeId,
    //     )?.IsStoreDependent;

    //     // In case of user & order type like delivery & there is no address selected =>  redirect to initialize
    //     if (userId && !Boolean(selectedOrderType) && !orderLocation?.addressId) {
    //       return NextResponse.redirect(
    //         new URL(
    //           `/?${fixedKeywords.triggerApp}=true&${fixedKeywords.redirectTo}=${newPath}`,
    //           request.nextUrl,
    //         ),
    //       );
    //     }
    //   }
    // }

    // Redirect /menu to first category in menu
    // if (url.endsWith("/menu")) {
    //   const categories = displayInOrder(countryData?.data?.Categories || []);

    //   if (categories?.length > 0) {
    //     return NextResponse.redirect(
    //       new URL(`/menu/${categories[0].NameUnique}`, request.nextUrl),
    //     );
    //   }
  }

  // Authentications
  const isAuthRoute = AUTH_ROUTES.includes(url);

  if (isAuthRoute) {
    const authSession = await getSession();
    // Redirect to profile page in case of user try access login or register, etc..
    if (authSession?.userId) {
      return NextResponse.redirect(
        new URL("/dashboard/profile", request.nextUrl),
      );
    } else {
      if (request.nextUrl.pathname === "/Login") {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl),
          REDIRECT_STATUS.permanent,
        );
      }
      if (request.nextUrl.pathname === "/Signup") {
        return NextResponse.redirect(
          new URL("/signup", request.nextUrl),
          REDIRECT_STATUS.permanent,
        );
      }
      if (request.nextUrl.pathname === "/forgetPassword") {
        return NextResponse.redirect(
          new URL("/forgetpassword", request.nextUrl),
          REDIRECT_STATUS.permanent,
        );
      }
    }
  }

  // Redirect to Homepage in case of user visit checkout page and country require order type and there is no order type selected
  // if (url.endsWith("/checkout")) {
  //   const isOrderTypeRequired = Boolean(
  //     countryData?.data?.Data?.IsCartOrderTypeRequired,
  //   );

  //   if (isOrderTypeRequired && !orderTypeId) {
  //     return NextResponse.redirect(
  //       new URL(
  //         `/?${fixedKeywords.triggerApp}=true&${fixedKeywords.redirectTo}=/menu`,
  //         request.nextUrl,
  //       ),
  //     );
  //   }
  // }

  // Map Redirects from old paths to new paths
  if (request.nextUrl.pathname.startsWith("/Locations")) {
    return NextResponse.redirect(
      new URL("/locations", request.nextUrl),
      REDIRECT_STATUS.temporary,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Story")) {
    return NextResponse.redirect(
      new URL("/about", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Halal")) {
    return NextResponse.redirect(
      new URL("/halal", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/PrivacyRequest")) {
    return NextResponse.redirect(
      new URL("/privacy-request", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Contact")) {
    return NextResponse.redirect(
      new URL("/contact", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/FAQ")) {
    return NextResponse.redirect(
      new URL("/faq", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Blog")) {
    return NextResponse.redirect(
      new URL("/blogs", request.nextUrl),
      REDIRECT_STATUS.temporary,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Careers")) {
    return NextResponse.redirect(
      new URL("/careers", request.nextUrl),
      REDIRECT_STATUS.temporary,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Terms")) {
    return NextResponse.redirect(
      new URL("/terms", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }
  if (request.nextUrl.pathname.startsWith("/Privacy")) {
    return NextResponse.redirect(
      new URL("/privacy", request.nextUrl),
      REDIRECT_STATUS.permanent,
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
