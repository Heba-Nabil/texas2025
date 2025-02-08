import { cookies } from "next/headers";
import { RedirectType } from "next/navigation";
import getRequestHeaders, {
  getCommonHeaders,
} from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { getSession } from "@/server/lib/auth";
import {
  apiEndpoints,
  fixedKeywords,
  THIRD_PARTY_INFO,
} from "@/utils/constants";
import { redirect } from "@/navigation";
import { syncUserCart } from "@/server/lib/syncUserCart";

// Guest Controller
export async function createGuestController(request: Request, locale: string) {
  const requestBody = await request.json();

  const body = JSON.stringify({
    RecaptchaToken: requestBody?.RecaptchaToken,
  });

  const commonHeaders = getCommonHeaders(locale);
  const { AllowTracking } = getRequestHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking ? AllowTracking : requestBody?.AllowTracking,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.guestTokenize, {
    method: "POST",
    body,
    headers,
  });

  if (!response?.hasError) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.guestId = response?.data?.Token;
    await session.save();
  }

  response && (response.data = null);

  return Response.json(response);
}

// User Login
export async function userLoginController(request: Request, locale: string) {
  const requestBody = await request.json();

  const body = JSON.stringify({
    UserName: requestBody?.UserName,
    Password: requestBody?.Password,
    ReCaptchaToken: requestBody?.ReCaptchaToken,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userLogin, {
    method: "POST",
    body,
    headers,
  });

  if (!response?.hasError) {
    cookies().delete(THIRD_PARTY_INFO);

    const userToken = response?.data?.Token;

    const session = await getSession();

    session.isLoggedIn = true;
    session.userId = userToken;
    session.info = {
      firstName: response?.data?.Profile?.FirstName,
      lastName: response?.data?.Profile?.LastName,
      email: response?.data?.Profile?.Email,
      phone: response?.data?.Profile?.Phone,
    };

    session.picture = response?.data?.Profile?.ProfileImageURL;

    await session.save();

    await syncUserCart(locale, userToken, session?.guestId);
  }

  return Response.json(response);
}

// User Signup
export async function userSignupController(request: Request, locale: string) {
  const requestBody = await request.json();

  const body = JSON.stringify({
    ReCaptchaToken: requestBody?.ReCaptchaToken,
    FirstName: requestBody?.FirstName,
    LastName: requestBody?.LastName,
    Phone: requestBody?.Phone,
    Email: requestBody?.Email,
    UserName: requestBody?.Email,
    Password: requestBody?.Password,
    IsSubscribedMarketing: requestBody?.IsSubscribedMarketing,
    IsSubscribedNotification: requestBody?.IsSubscribedNotification,
  });

  const commonHeaders = getCommonHeaders(locale);
  const { AllowTracking } = getRequestHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking ? AllowTracking : requestBody?.AllowTracking,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userSignup, {
    method: "POST",
    body,
    headers,
  });

  if (!response?.hasError) {
    cookies().delete(THIRD_PARTY_INFO);

    const userToken = response?.data?.Token;

    const session = await getSession();

    session.isLoggedIn = true;
    session.userId = userToken;
    session.info = {
      firstName: response?.data?.Profile?.FirstName,
      lastName: response?.data?.Profile?.LastName,
      email: response?.data?.Profile?.Email,
      phone: response?.data?.Profile?.Phone,
    };

    session.picture = response?.data?.Profile?.ProfileImageURL;

    await session.save();

    await syncUserCart(locale, userToken, session?.guestId);
  }

  return Response.json(response);
}

// User forget password
export async function userForgetPasswordController(
  request: Request,
  locale: string,
) {
  const { guestId } = await getSession();

  const requestBody = await request.json();

  const body = JSON.stringify({
    Phone: requestBody?.Phone,
    Email: requestBody?.Email,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: guestId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.forgetPassword, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// User Logout
export async function userLogoutController(request: Request, locale: string) {
  const session = await getSession();

  const AccessToken = session?.userId;
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    AccessToken,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userLogout, {
    method: "POST",
    headers,
  });

  if (!response?.hasError) {
    session.destroy();
  }

  return Response.json(response);
}

// User Delete Account
export async function userDeleteController(request: Request, locale: string) {
  const session = await getSession();

  const AccessToken = session?.userId;
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    AccessToken,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userDeleteAccount, {
    method: "POST",
    headers,
  });

  if (!response?.hasError) {
    session.destroy();
  }

  return Response.json(response);
}

// User update profile
export async function updateUserProfileController(
  request: Request,
  locale: string,
) {
  const requestBody = await request.json();

  const body = JSON.stringify({
    ReCaptchaToken: requestBody?.ReCaptchaToken,
    FirstName: requestBody?.FirstName,
    LastName: requestBody?.LastName,
    Phone: requestBody?.Phone,
    IsSubscribedMarketing: requestBody?.IsSubscribedMarketing,
    IsSubscribedNotification: requestBody?.IsSubscribedNotification,
  });

  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);
  const { AllowTracking } = getRequestHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking ? AllowTracking : requestBody?.AllowTracking,
    AccessToken: userId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.updateUser, {
    method: "POST",
    body,
    headers,
  });

  if (!response?.hasError) {
    cookies().delete(THIRD_PARTY_INFO);

    const session = await getSession();

    session.info = {
      firstName: requestBody?.FirstName,
      lastName: requestBody?.LastName,
      email: session?.info?.email ? session?.info?.email : requestBody?.Email,
      phone: requestBody?.Phone,
    };

    await session.save();
  }

  return Response.json(response);
}

// Change user password
export async function changeUserPasswordController(
  request: Request,
  locale: string,
) {
  const requestBody = await request.json();

  const body = JSON.stringify({
    OldPassword: requestBody?.OldPassword,
    NewPassword: requestBody?.NewPassword,
  });

  const { userId } = await getSession();

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.changeUserPassword, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Add To Fav
export async function addToFavController(request: Request, locale: string) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    MenuItemID: requestBody?.MenuItemID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.addToFav, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Remove from Fav
export async function removeFromFavController(
  request: Request,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    MenuItemID: requestBody?.MenuItemID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.removeFromFav, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// User change language
export async function changeLanguageController(
  request: Request,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.changeLanguage, {
    method: "POST",
    headers,
  });

  return Response.json(response);
}

// User address => GET
export async function getUserAddressesController(locale: string) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    AccessToken: userId,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.getUserAddresses, {
    method: "GET",
    headers,
  });

  return Response.json(response);
}

// User create address
export async function createAddressController(
  request: Request,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    Phone: requestBody?.Phone,
    CityID: requestBody?.CityID,
    AreaID: requestBody?.AreaID,
    Block: requestBody?.Block,
    Street: requestBody?.Street,
    Building: requestBody?.Building,
    Floor: requestBody?.Floor,
    Apartment: requestBody?.Apartment,
    Landmark: requestBody?.Landmark,
    // Instructions: requestBody?.Instructions,
    Longitude: requestBody?.Longitude ? requestBody?.Longitude : 0,
    Latitude: requestBody?.Latitude ? requestBody?.Latitude : 0,
  });

  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.createAddress, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// User update address
export async function updateAddressController(
  request: Request,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    AddressID: requestBody.AddressID,
    Phone: requestBody.Phone,
    CityID: requestBody?.CityID,
    AreaID: requestBody?.AreaID,
    Block: requestBody?.Block,
    Street: requestBody?.Street,
    Building: requestBody?.Building,
    Floor: requestBody?.Floor,
    Apartment: requestBody?.Apartment,
    Landmark: requestBody?.Landmark,
    // Instructions: requestBody?.Instructions,
    Longitude: requestBody?.Longitude ? requestBody?.Longitude : 0,
    Latitude: requestBody?.Latitude ? requestBody?.Latitude : 0,
  });
  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.updateAddress, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// User delete address
export async function deleteAddressController(
  request: Request,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    AddressID: requestBody.AddressID,
  });

  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId,
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.deleteAddress, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Signin with Third Party
export async function thirdPartyController(request: any, locale: string) {
  const requestBody = await request.json();

  const { AllowTracking } = getRequestHeaders(locale);

  const body = JSON.stringify({
    ThirdPartyID: requestBody?.ThirdPartyID,
    ThirdPartyEmail: requestBody?.ThirdPartyEmail,
    AuthenticationTypeID: requestBody?.AuthenticationTypeID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.userSignInThirdParty, {
    method: "POST",
    body,
    headers,
  });

  if (!response?.hasError) {
    const session = await getSession();

    session.userId = response?.data?.Token;

    await session.save();
  }
  return Response.json(response);
}

// Complete user info
export async function completeUserInfoController(request: any, locale: string) {
  const requestBody = await request.json();

  const { AllowTracking } = getRequestHeaders(locale);

  const body = JSON.stringify({
    FirstName: requestBody?.firstName,
    LastName: requestBody?.lastName,
    ThirdPartyEmail: requestBody?.email,
    Phone: requestBody?.phone,
    IsSubscribedMarketing: requestBody?.IsSubscribedMarketing,
    IsSubscribedNotification: requestBody?.IsSubscribedNotification,
    ThirdPartyID: requestBody?.id,
    AuthenticationTypeID: `${requestBody?.type}`,
    ReCaptchaToken: requestBody?.captcha,
  });
  console.log("request body from complete info", body);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AllowTracking: AllowTracking!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.completeInfo, {
    method: "POST",
    body,
    headers,
  });
  console.log("response body from complete info", response);

  if (!response?.hasError) {
    cookies().delete(THIRD_PARTY_INFO);

    const userToken = response?.data?.Token;

    const session = await getSession();

    session.isLoggedIn = true;
    session.userId = userToken;
    session.info = {
      firstName: response?.data?.Profile?.FirstName,
      lastName: response?.data?.Profile?.LastName,
      email: response?.data?.Profile?.Email,
      phone: response?.data?.Profile?.Phone,
    };

    session.picture = requestBody?.picture;

    await session.save();

    await syncUserCart(locale, userToken, session?.guestId);
  }

  return Response.json(response);
}

// Get User Notifications
export async function getNotificationController(request: any, locale: string) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const { searchParams } = new URL(request.url);
  const pageNumber = searchParams.get(fixedKeywords.PageNumber);

  const body = JSON.stringify({ PageNumber: pageNumber });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.getNotifications, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// User mark notification as read
export async function markNotificationAsReadController(
  request: any,
  locale: string,
) {
  const { userId } = await getSession();
  if (!userId) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({ NotificationID: requestBody?.NotificationID });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: userId!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.markAsRead, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
