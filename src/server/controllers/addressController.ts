import { RedirectType } from "next/navigation";
import { redirect } from "@/navigation";
import { isAuthenticated } from "@/server/lib/auth";
import getRequestHeaders, {
  getCommonHeaders,
} from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";

// Get User Addresses
export async function getUserAddressesController(locale: string) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const commonHeaders = getCommonHeaders(locale);
  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.getUserAddresses, {
    method: "GET",
    headers,
  });

  return Response.json(response);
}

// Create Address
export async function createAddressController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const requestBody = await request.json();

  const body = JSON.stringify({
    Phone: "+97312345671",
    CityID: requestBody?.city,
    AreaID: requestBody?.area,
    Block: requestBody?.block,
    Street: requestBody?.street,
    Building: requestBody?.building,
    Floor: requestBody?.floor,
    Apartment: requestBody?.apartment,
    Landmark: requestBody?.landmark,
    Instructions: requestBody?.instructions,
  });

  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
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

// Update Address
export async function updateAddressController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();

  const requestBody = await request.json();

  const body = JSON.stringify({
    AddressID: requestBody.AddressID,
    Phone: "+97312345671",
    CityID: requestBody?.city,
    AreaID: requestBody?.area,
    Block: requestBody?.block,
    Street: requestBody?.street,
    Building: requestBody?.building,
    Floor: requestBody?.floor,
    Apartment: requestBody?.apartment,
    Landmark: requestBody?.landmark,
    Instructions: requestBody?.instructions,
  });
  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
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

// Delete Address
export async function deleteAddressController(
  request: Request,
  locale: string,
) {
  const AccessToken = await isAuthenticated();

  const requestBody = await request.json();

  const body = JSON.stringify({
    AddressID: requestBody.AddressID,
  });

  const { AllowTracking } = getRequestHeaders(locale);
  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken!,
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
