import { cookies } from "next/headers";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { ObjectParser } from "@pilcrowjs/object-parser";
import {
  fixedKeywords,
  google_code_verifier,
  google_oauth_state,
  LOGIN_REDIRECT,
  LOGIN_REDIRECT_COOKIE,
  NEXT_LOCALE,
  THIRD_PARTY_INFO,
} from "@/utils/constants";
import { google } from "@/server/lib/oauth";
import { defaultLanguage } from "@/config";
import { loginThirdParty } from "@/server/services/userService";
import { getSession } from "@/server/lib/auth";
import { syncUserCart } from "@/server/lib/syncUserCart";
// Types
import { CompleteInfoDataProps } from "@/types";
import { AuthenticationTypeIdEnum } from "@/types/enums";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = cookies()?.get(NEXT_LOCALE)?.value || defaultLanguage;
  const redirect =
    cookies()?.get(LOGIN_REDIRECT_COOKIE)?.value || LOGIN_REDIRECT;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get(google_oauth_state)?.value ?? null;
  const codeVerifier = cookies().get(google_code_verifier)?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;

  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const claims = decodeIdToken(tokens.idToken());
    const claimsParser = new ObjectParser(claims);

    const idToken = claimsParser.getString("sub");

    if (!idToken) {
      return new Response("Please restart the process.", {
        status: 400,
      });
    }

    const firstName =
      claimsParser.getString("given_name") || claimsParser.getString("name");

    const completeData: CompleteInfoDataProps = {
      thirdPartyId: idToken,
      thirdPartyType: AuthenticationTypeIdEnum.Google,
      email: claimsParser.getString("email") || "",
      firstName,
      lastName: claimsParser.getString("family_name"),
      picture: claimsParser.getString("picture"),
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
    //       Location: `/${locale}/login?${fixedKeywords.completeInfo}=true&${fixedKeywords.redirectTo}=${redirect}&image=${btoa(completeData?.picture || "")}`,
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
          Location: `/${locale}/login?${fixedKeywords.completeInfo}=true&${fixedKeywords.redirectTo}=${redirect}&image=${btoa(completeData?.picture || "")}`,
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

    session.picture = completeData?.picture;

    await session.save();

    await syncUserCart(locale, userToken, session?.guestId);

    // Facebook pixels
    !!window?.fbq &&
    fbq("track", "UserLogin", {
      content_name: "User Login",
      user_data: {
        email: response?.data?.Profile?.Email,
      },
      login_type: "google",
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
        login_type: "google"
      });

    // Google events
    !!window?.gtag &&
      window?.gtag("event", "login", {
        method: "google",
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
        login_type: 'google',
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
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
}
