import { RedirectType } from "next/navigation";
import { getSession, isAuthenticated } from "@/server/lib/auth";
import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";
import { redirect } from "@/navigation";

// Get cart controller
export async function getCartItemsByAccessToken(
  request: Request,
  locale: string,
) {
  const requestBody = await request.json();

  const AccessToken = requestBody?.AccessToken;

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.retrieveCart, {
    method: "GET",
    headers,
  });

  return Response.json(response);
}

// Initialize Cart
export async function initializeCartController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    StoreID: requestBody?.StoreID,
    OrderTypeID: requestBody?.OrderTypeID,
    CityID: requestBody?.CityID ? requestBody?.CityID : "",
    AreaID: requestBody?.AreaID ? requestBody?.AreaID : "",
    AddressID: requestBody?.AddressID ? requestBody?.AddressID : "",
    Latitude: requestBody?.Latitude ? requestBody?.Latitude : "",
    Longitude: requestBody?.Longitude ? requestBody?.Longitude : "",
    Block: requestBody?.Block ? requestBody?.Block : "",
    Street: requestBody?.Street ? requestBody?.Street : "",
    Building: requestBody?.Building ? requestBody?.Building : "",
    Floor: requestBody?.Floor ? requestBody?.Floor : "",
    Apartment: requestBody?.Apartment ? requestBody?.Apartment : "",
    Landmark: requestBody?.Landmark ? requestBody?.Landmark : "",
    // Instructions: requestBody?.Instructions ? requestBody?.Instructions : "",
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.initializeCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Add to Cart
export async function addToCartController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    OrderTypeID: requestBody?.OrderTypeID,
    StoreID: requestBody?.StoreID,
    MenuItem: requestBody?.MenuItem,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.addToCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Quick Add to Cart
export async function quickAddToCartController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    OrderTypeID: requestBody?.OrderTypeID,
    StoreID: requestBody?.StoreID,
    MenuItemID: requestBody?.MenuItemID,
    SelectedQuantity: requestBody?.SelectedQuantity,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.quickAddToCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Update Cart Line
export async function updateCartController(request: Request, locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    ID: requestBody?.ID,
    OrderTypeID: requestBody?.OrderTypeID,
    StoreID: requestBody?.StoreID,
    MenuItem: requestBody?.MenuItem,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.updateCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Quick Update Line
export async function quickUpdateCartLineController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    OrderTypeID: requestBody?.OrderTypeID,
    StoreID: requestBody?.StoreID,
    ID: requestBody?.ID,
    MenuItemID: requestBody?.MenuItemID,
    SelectedQuantity: requestBody?.SelectedQuantity,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.quickUpdateCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Remove Cart Line
export async function removeCartLineController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();
  const body = JSON.stringify({
    ID: requestBody?.ID,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.removeFromCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}

// Cart Transfer
export async function cartTransferController(request: Request, locale: string) {
  const { guestId } = await getSession();

  const requestBody = await request.json();
  const body = JSON.stringify({
    OldUserAccessToken: guestId,
  });

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: requestBody?.ID,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.transferCart, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
