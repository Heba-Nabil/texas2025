import { ErrorProps, UserLoyaltyHistoryResponseProps } from "./api";
import { AuthenticationTypeIdEnum } from "./enums";

// Request Headers
export type RequestHeadersProps = {
  Version?: string;
  RequestSource?: string;
  LanguageCode?: string;
  CountryID?: string;
  BrowserID?: string;
  DeviceModel?: string;
  UserIP?: string;
  AccessToken?: string;
  AllowTracking?: string | undefined;
  orderTypeId?: string | undefined;
  orderLocation?: OrderLocationProps;
};

export type SessionDataProps = {
  guestId: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  info?: UserSessionDataProps;
  picture?: string | null;
};

export type UserSessionDataProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note?: string;
};

export type ClientSessionProps = {
  isLoggedIn: boolean;
  isUser: boolean;
  isGuest: boolean;
  info?: UserSessionDataProps;
  picture?: string | null;
};

export type CompleteInfoDataProps = {
  thirdPartyId: string;
  thirdPartyType: AuthenticationTypeIdEnum;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
};

export type FacebookProfileResponseProps = {
  id: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  email: string;
};

export type AppleProfileResponseProps = {
  name: { firstName: string; lastName: string };
  email?: string;
};

export type AppleLoginDecodeProps = {
  header: { kid: string; alg: string };
  payload: {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    at_hash: string;
    email: string;
    email_verified: boolean;
    auth_time: number;
    nonce_supported: boolean;
  };
  signature: string;
};

export type FooterLinkProps = {
  id: number;
  title: string;
  href: string;
  isInternal: boolean;
  isOn: boolean;
};

export type SelectPickupOrderDataProps = {
  city: string;
  store: string;
};

export type PasswordValidationsProps = {
  minLength: boolean;
  lowerCase: boolean;
  upperCase: boolean;
  specialCharacter: boolean;
  minNumbers: boolean;
  noSpaces: boolean;
};

export type OrderLocationProps = {
  storeId?: string;
  cityId?: string;
  areaId?: string;
  addressId?: string;
  block?: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  // instructions?: string;
  lng?: number;
  lat?: number;
};

export type MenuItemActionProp = (
  objectId: string,
  parentGroupId: string,
  quantity: number,
  parentItemId?: string,
  subGroupId?: string,
) => void;

export type GenericResponse<T> =
  | {
      hasError: boolean;
      errors: ErrorProps[];
      responseCode: number;
      data: T | null | undefined;
    }
  | undefined;

export type RefactorMenuItem = {
  ID: string;
  SelectedQuantity?: number | undefined;
  ModifierGroups: {
    ID: string;
    ModifierItems: {
      ID: string;
      SelectedQuantity?: number | undefined;
      ModifierGroups: {
        ID: string;
        ModifierItems: {
          ID: string;
          SelectedQuantity?: number | undefined;
        }[];
      }[];
    }[];
  }[];
};

export type BillLineProps = {
  Quantity: number;
  SubTotal: number;
  SubTotalAfterDiscount: number;
  MenuItem: {
    CustomizationDescription: string | null;
    IconURL: string;
    Name: string;
    Description: string;
  };
};

export type BillDealProps = {
  ID: string;
  Name: string;
  Points: number;
  Lines: BillLineProps[];
};

export type BillLineCookieProps = {
  TotalQuantity: number;
  ExpiredDate: string;
  SubTotal: number;
  DiscountAmount: number;
  DeliveryChargeAmount: number;
  TaxAmount: number;
  Total: number;
  PromoCode: string | null;
  DealHeaderID: string | null;
  Lines: BillLineProps[];
  Deals: BillDealProps[];
};

export type CaptchaRefProps = {
  reset: () => void;
} | null;

export type AddressWithSelectForm = {
  AddressID?: string;
  Phone: string;
  CityID: string;
  AreaID: string;
  Block: string;
  Street: string;
  Building: string;
  Floor: string;
  Apartment: string;
  Landmark: string;
  // Instructions: string;
  Latitude?: number;
  Longitude?: number;
};

export type MapCoordinatesProps = { Latitude: number; Longitude: number };

export type MapPositionProps = {
  lat: number;
  lng: number;
};

export type GuestDeliveryOrderTypesFormResourcesProps = {
  pickPinOnMap: string;
  cityRequired: string;
  areaRequired: string;
  requiredBlockNumber: string;
  maxLength: string;
  character: string;
  block: string;
  canOnlyContainLettersNumbersUnderscoes: string;
  requiredStreet: string;
  street: string;
  requiredBuildingNumber: string;
  building: string;
  requiredFloorNumber: string;
  floor: string;
  requiredApartment: string;
  apartment: string;
  requiredLandMark: string;
  landmark: string;
  // instructions: string;
  selectCity: string;
  selectArea: string;
  fieldAcceptsAlphaNumericAndDash: string;
  detectMyCurrentLocation: string;
  pleaseAllowAccessToYourLocation: string;
};

export type GuestDeliveryOrderTypeFormProps = {
  CityID: string;
  AreaID: string;
  Block: string;
  Street: string;
  Building: string;
  Floor: string;
  Apartment: string;
  Landmark: string;
  // Instructions: string;
};

export type ApplyDealValuesProps = {
  DealHeaderID: string;
  Lists?: {
    Details: {
      ID: string;
    }[];
    ID: string;
  }[];
};

export type RewardsHistoryTabs = {
  id: string;
  label: string;
  filterFn?: (item: UserLoyaltyHistoryResponseProps) => boolean;
};
