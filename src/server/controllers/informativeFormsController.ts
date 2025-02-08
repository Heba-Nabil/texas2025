import { getCommonHeaders } from "@/server/lib/getRequestHeaders";
import apiFetcher from "@/server/lib/apiFetcher";
import { apiEndpoints } from "@/utils/constants";

export async function birthdayPackageRequestController(
  request: Request,
  locale: string,
) {
  const requestHeaders = new Headers(request.headers);
  const RecaptchaToken = requestHeaders.get("recaptchatoken")!;

  const formData = await request.formData();

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    ...commonHeaders,
    RecaptchaToken,
  };

  const response = await apiFetcher(apiEndpoints.submitBirthdayPackage, {
    method: "POST",
    body: formData,
    headers,
  });

  return Response.json(response);
}

export async function contactUsController(request: Request, locale: string) {
  const requestHeaders = new Headers(request.headers);
  const RecaptchaToken = requestHeaders.get("recaptchatoken")!;

  const formData = await request.formData();

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    ...commonHeaders,
    RecaptchaToken,
  };

  const response = await apiFetcher(apiEndpoints.contactUs, {
    method: "POST",
    body: formData,
    headers,
  });

  return Response.json(response);
}

export async function submitCareerController(request: Request, locale: string) {
  const requestHeaders = new Headers(request.headers);
  const RecaptchaToken = requestHeaders.get("recaptchatoken")!;

  const formData = await request.formData();

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    ...commonHeaders,
    RecaptchaToken,
  };

  const response = await apiFetcher(apiEndpoints.submitCareer, {
    method: "POST",
    body: formData,
    headers,
  });

  return Response.json(response);
}

export async function partyRequestController(request: Request, locale: string) {
  const requestHeaders = new Headers(request.headers);
  const RecaptchaToken = requestHeaders.get("recaptchatoken")!;

  const formData = await request.formData();

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    ...commonHeaders,
    RecaptchaToken,
  };

  const response = await apiFetcher(apiEndpoints.submitParty, {
    method: "POST",
    body: formData,
    headers,
  });

  return Response.json(response);
}

export async function privacyRequestController(
  request: Request,
  locale: string,
) {
  const requestBody = await request.json();

  const body = JSON.stringify(requestBody);

  const commonHeaders = getCommonHeaders(locale);

  const headers = {
    "Content-Type": "application/json",
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.privacyRequest, {
    method: "POST",
    body,
    headers,
  });

  return Response.json(response);
}
