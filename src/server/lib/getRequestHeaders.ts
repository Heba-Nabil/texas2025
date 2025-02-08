import { headers, cookies } from "next/headers";
import { osName } from "react-device-detect";
import {
  ALLOW_TRACKING,
  NEXT_LOCALE,
  ORDER_LOCATION,
  ORDER_TYPE_ID,
  SESSION_ID,
} from "@/utils/constants";
import { defaultLanguage } from "@/config";
// // Types
import { RequestHeadersProps } from "@/types";

export function getUserIP() {
  const userIp = headers().get("x-real-ip")
    ? headers().get("x-real-ip")
    : headers().get("x-forwarded-for")?.split(",")[0];

  return userIp;
}

export function getSessionId() {

  const creationTime = Date.now();
  
  const sessionId = cookies().get(SESSION_ID)?.value || "test";

  return sessionId;
}

export default function getRequestHeaders(lang?: string) {
  const requestHeaders: RequestHeadersProps = {};

  // Request Source
  const requestSource = process.env.REQUEST_SOURCE!;
  if (!requestSource) throw new Error("Missing RequestSource");
  requestHeaders.RequestSource = requestSource;

  // Version
  const version = process.env.API_VERSION!;
  if (!version) throw new Error("Missing Version");
  requestHeaders.Version = version;

  // Country Id
  const countryID = process.env.COUNTRY_ID;
  if (!countryID) throw new Error("Missing CountryID");
  requestHeaders.CountryID = countryID;

  // Language Code
  const languageCode =
    lang || cookies().get(NEXT_LOCALE)?.value || defaultLanguage;
  if (!languageCode) throw new Error("Missing LanguageCode");
  requestHeaders.LanguageCode = languageCode;

  // User IP
  const userIP = getUserIP();
  requestHeaders.UserIP = userIP!;

  // Session ID
  const sessionId = getSessionId();
  requestHeaders.BrowserID = sessionId;

  // Device Model
  // const userAgent = headers().get("User-Agent") || "";
  // const { browserName } = getSelectorsByUserAgent(userAgent);
  requestHeaders.DeviceModel = osName || ""; // operating system

  // Allow Server Tracking
  const allowTracking = cookies().get(ALLOW_TRACKING)?.value;
  requestHeaders.AllowTracking = allowTracking;

  // Selected Order Type ID
  const orderTypeId = cookies().get(ORDER_TYPE_ID)?.value;
  requestHeaders.orderTypeId = orderTypeId;

  // Selected Order Location
  const orderLocation = cookies().get(ORDER_LOCATION)?.value;
  requestHeaders.orderLocation = orderLocation
    ? JSON.parse(orderLocation)
    : undefined;

  return requestHeaders;
}

export function getCommonHeaders(lang: string) {
  const {
    RequestSource,
    Version,
    CountryID,
    LanguageCode,
    BrowserID,
    DeviceModel,
  } = getRequestHeaders(lang);

  return {
    RequestSource: RequestSource!,
    Version: Version!,
    CountryID: CountryID!,
    LanguageCode: LanguageCode!,
    BrowserID: BrowserID!,
    DeviceModel: DeviceModel!,
  };
}
