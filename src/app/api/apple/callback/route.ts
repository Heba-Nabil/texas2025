import { cookies } from "next/headers";
import { ArcticFetchError, OAuth2RequestError } from "arctic";
import jwt from "jsonwebtoken";
import {
  fixedKeywords,
  LOGIN_REDIRECT,
  LOGIN_REDIRECT_COOKIE,
  NEXT_LOCALE,
  THIRD_PARTY_INFO,
} from "@/utils/constants";
import { apple } from "@/server/lib/oauth";
import { syncUserCart } from "@/server/lib/syncUserCart";
import { loginThirdParty } from "@/server/services/userService";
import { defaultLanguage } from "@/config";
import { getSession } from "@/server/lib/auth";
// Types
import {
  AppleLoginDecodeProps,
  AppleProfileResponseProps,
  CompleteInfoDataProps,
} from "@/types";
import { AuthenticationTypeIdEnum } from "@/types/enums";

export async function POST(request: Request) {
  const locale = cookies()?.get(NEXT_LOCALE)?.value || defaultLanguage;
  const redirect =
    cookies()?.get(LOGIN_REDIRECT_COOKIE)?.value || LOGIN_REDIRECT;

  try {
    const formdata = await request.formData();

    const code = formdata.get("code");
    const user = formdata.get("user");

    if (!code) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }

    const tokens = await apple.validateAuthorizationCode(code as string);
    const idToken = tokens.idToken();

    if (!idToken) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }

    const decoded = jwt.decode(idToken, {
      complete: true,
    }) as AppleLoginDecodeProps;

    const sub = decoded?.payload?.sub;
    const verifiedEmail = decoded?.payload?.email;

    if (!sub) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }

    const userObject: AppleProfileResponseProps = user
      ? JSON.parse(user as string)
      : {};

    const completeData: CompleteInfoDataProps = {
      thirdPartyId: sub,
      thirdPartyType: AuthenticationTypeIdEnum.Apple,
      email: userObject?.email || verifiedEmail || "",
      firstName: userObject?.name?.firstName || "",
      lastName: userObject?.name?.lastName,
    };

    const temp_data = {
      firstName: completeData?.firstName || "",
      lastName: completeData?.lastName || "",
      email: completeData?.email || "",
      phone: completeData?.phone || "",

      id: completeData?.thirdPartyId,
      typeId: completeData?.thirdPartyType,
    };

    cookies().set(THIRD_PARTY_INFO, JSON.stringify(temp_data), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // if (!completeData?.email) {
    //   return new Response(null, {
    //     status: 302,
    //     headers: {
    //       Location: `/${locale}/login?${fixedKeywords.completeInfo}=true&${fixedKeywords.redirectTo}=${redirect}`,
    //     },
    //   });
    // }

    const response = await loginThirdParty(locale, {
      AuthenticationTypeID: `${completeData?.thirdPartyType}`,
      ThirdPartyID: completeData?.thirdPartyId,
      ThirdPartyEmail: completeData?.email,
    });

    if (response?.hasError || response?.responseCode === 206) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/${locale}/login?${fixedKeywords.completeInfo}=true&${fixedKeywords.redirectTo}=${redirect}`,
        },
      });
    }

    cookies().delete(THIRD_PARTY_INFO);

    const userToken = response?.data?.Token;

    const session = await getSession();

    session.isLoggedIn = true;
    session.userId = userToken;
    session.info = {
      firstName: response?.data?.Profile?.FirstName || "",
      lastName: response?.data?.Profile?.LastName || "",
      email: response?.data?.Profile?.Email || completeData?.email,
      phone: response?.data?.Profile?.Phone || "",
    };

    await session.save();

    await syncUserCart(locale, userToken, session?.guestId);

    // Facebook pixels
    !!window?.fbq &&
    fbq("track", "UserLogin", {
      content_name: "User Login",
      user_data: {
        email: response?.data?.Profile?.Email,
      },
      login_type: "apple",
      platform: "website"
    });

    // Tiktok pixels
    !!window?.ttq &&
      ttq?.track("UserLogin", {
        content_name: "User Login",
        content_type: "product",
        email: response?.data?.Profile?.Email,
        external_id: response?.data?.Profile?.Email,
        platform: 'website', 
        login_type: "apple"
      });

    // Google events
    !!window?.gtag &&
      window?.gtag("event", "login", {
        method: "apple",
        items: [
          {
            item_id: response?.data?.Profile?.Email,
            item_name: "User Login",
            item_category: "Account",
          },
        ],
        user_properties: {
          email: response?.data?.Profile?.Email,
        },
        custom_data: {
          platform: 'website',
        }
      });

    // Snapchat pixels
    !!window?.snaptr &&
      snaptr("track", "LOGIN", {
        content_name: "User Login",
        login_type: 'apple',
        platform:'website',
        user_email: response?.data?.Profile?.Email,
        user_data: {
          email: response?.data?.Profile?.Email,
        },
      });

    return new Response(null, {
      status: 302,
      headers: {
        Location: `/${locale}${redirect}`,
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      const code = error.code;
      console.log("code error from callback", code);

      return new Response("Failed");
    }
    if (error instanceof ArcticFetchError) {
      // Failed to call `fetch()`
      const cause = error.cause;
      console.log("error from callback fetch", cause);

      return new Response("Failed");
    }

    return new Response("Please restart the process.", {
      status: 400,
    });
  }
}
