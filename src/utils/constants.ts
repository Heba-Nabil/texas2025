import { CartProps } from "@/types/api";

// Cache TAGS
export const RESOURCES_CACHE = "RESOURCES_CACHE";

// Redirect status codes
export const REDIRECT_STATUS = {
  permanent: 308,
  temporary: 307,
};

// Cookies Names
export const SESSION_ID = "SID",
  SESSION = "SESSION",
  NEXT_LOCALE = "NEXT_LOCALE",
  ORDER_TYPE_ID = "ORDER_TYPE_ID",
  ORDER_LOCATION = "ORDER_LOCATION",
  CITY_ID = "CITY_ID",
  STORE_ID = "STORE_ID",
  AREA_ID = "AREA_ID",
  ADDRESS_ID = "ADDRESS_ID",
  LNG = "LNG",
  LAT = "LAT",
  cookieName = "cookieName",
  cookieValue = "cookieValue",
  ALLOW_TRACKING = "ALLOW_TRACKING",
  PAYMENT_ID = "PAYMENT_ID",
  BILL_LINE = "BILL_LINE",
  GUEST_DATA = "GUEST_DATA",
  CHECKOUT_RESPONSE = "CHECKOUT_RESPONSE",
  ORDER_DATE = "ORDER_DATE",
  google_oauth_state = "google_oauth_state",
  google_code_verifier = "google_code_verifier",
  facebook_oauth_state = "facebook_oauth_state",
  LOGIN_REDIRECT_COOKIE = "LOGIN_REDIRECT_COOKIE",
  THIRD_PARTY_INFO = "THIRD_PARTY_INFO";

export const defaultSession = {
  guestId: null,
  userId: null,
  isLoggedIn: false,
};

export const DEFAULT_MAP_ZOOM = 8;

// API Response Keys
export const apiResponseKeys = {
  responseCode: "ResponseCode",
  results: "Results",
};

// Fixed Keywords
export const fixedKeywords = {
  redirectTo: "redirectTo",
  triggerApp: "triggerApp",
  activeDealId: "activeDealId",
  DealHeaderID: "DealHeaderID",
  AppView: "appview",
  PageNumber: "PageNumber",
  completeInfo: "completeInfo",
  completeData: "completeData",
  locale: "locale",
};

// Route Handlers Keys
export const routeHandlersKeys = {
  // Country
  countriesListRoute: "/countriesList",
  // Auth
  createGuest: "/auth/guest",
  createUser: "/auth/user",
  saveSession: "/save-session",
  signInThirdParty: "/auth/thirdParty",
  completeUserInfo: "/auth/complete-info",
  signInWithGoogle: "/auth/thirdParty/google",
  signInWithFacebook: "/auth/thirdParty/facebook",
  userLogin: "/auth/user/login",
  userSignup: "/auth/user/signup",
  forgetPassword: "/auth/user/forgetPassword",
  userDeleteAccount: "/auth/user/delete",
  userLogout: "/auth/user/logout",
  updateUserProfile: "/auth/user/update",
  changeUserPassword: "/auth/user/change-password",
  addToFav: "/auth/user/favs/add",
  removeFromFav: "/auth/user/favs/remove",
  changeLanguage: "/auth/user/change-language",
  getUserAddresses: "/auth/user/addresses",
  createAddress: "/auth/user/addresses/create",
  updateAddress: "/auth/user/addresses/update",
  deleteAddress: "/auth/user/addresses/delete",
  // Cart
  getCart: "/cart",
  initializeCart: "/cart/initialize",
  addToCart: "/cart/add",
  quickAddToCart: "/cart/quick-add",
  updateCart: "/cart/update",
  quickUpdateCart: "/cart/quick-update",
  removeFromCart: "/cart/remove",
  transferCart: "/cart/transfer",
  // Checkout
  checkout: "/checkout",
  preCheckout: "/orders/precheckout",
  //RollBack
  rollback: "/orders/rollback",
  // Payment
  pay: "/payment/pay",
  paymentStatus: "/payment/status",
  // Rate Us
  rateUs: "/rate-us",
  // Orders
  orders: "/orders",
  rollBack: "/orders/rollback",
  reorder: "/orders/reorder",
  // Get store
  getStoreGeoFencing: "/store/getStoreByGeoFencing",
  getStoreByArea: "/store/getStoreByAreaId",
  // Promo code
  applyPromoCode: "/discount/promocode/apply",
  removePromoCode: "/discount/promocode/remove",
  // Deals
  getSingleDeal: "/discount/deals/single",
  applyDeal: "/discount/deals/apply",
  removeDeal: "/discount/deals/remove",
  // Notification
  sendNotification: "/send-notification",
  getNotifications: "/auth/user/notifications",
  markAsRead: "/auth/user/notifications/markAsRead",
  // Loyalty
  addLoyaltyDeal: "/discount/loyalty/add",
  // Get cookie value
  getCookieValue: "/get-cookie",
  // Informative Forms
  submitBirthdayPackage: "/informative/birthday-package",
  contactUs: "/informative/contact-us",
  submitCareer: "/informative/careers",
  submitParty: "/informative/party",
  privacyRequest: "/informative/privacy-request",
};

// API Endpoints
export const apiEndpoints = {
  // Country
  countriesList: "/Countries",
  countrySingle: "/Country",
  resources: "/Resource/AllResources",
  // Guest
  userGuestTokenize: "/Guest/Tokenization",
  // Home
  homeBanners: "/HomePage/Banners",
  // User
  userSignIn: "/User/SignIn",
  userSignUp: "/User/SignUp",
  userSignInThirdParty: "/User/SignInThirdParty",
  completeInfo: "/User/CompleteInfo",
  // User
  guestTokenize: "/Guest/Tokenization",
  userLogin: "/User/SignIn",
  userSignup: "/User/SignUp",
  forgetPassword: "/User/ForgetPassword",
  userLogout: "/User/SignOut",
  userDeleteAccount: "/User/DeleteAccount",
  getUserProfileData: "/User/Profile",
  updateUser: "/User/UpdateProfile",
  changeUserPassword: "/User/ChangePassword",
  getFavItems: "/User/GetFavoriteItems",
  addToFav: "/User/Favorite",
  removeFromFav: "/User/UnFavorite",
  changeLanguage: "/User/ChangeLanguage",
  getUserAddresses: "/User/Addresses",
  createAddress: "/User/CreateAddress",
  updateAddress: "/User/UpdateAddress",
  deleteAddress: "/User/DeleteAddress",
  getUserDeals: "/Discount/GetUserDeals",
  getUserSingleDeal: "/Discount/GetSingleDeal",
  applyDeal: "/Discount/Redeem",
  removeDeal: "/Discount/UnRedeem",
  getUserLoyaltyHistory: "/Loyalty/History",
  getUserLoyaltyDeals: "/Loyalty/Deals",
  getUserLoyaltyStatus: "/Loyalty/Status",
  addLoyaltyDeal: "/Loyalty/Redeem",
  // Cart
  retrieveCart: "/Cart",
  initializeCart: "/Cart/Initialize",
  addToCart: "/Cart/Add",
  quickAddToCart: "/Cart/QuickAdd",
  updateCart: "/Cart/Update",
  quickUpdateCart: "/Cart/QuickUpdate",
  removeFromCart: "/Cart/Remove",
  transferCart: "/Cart/Transfer",
  getSuggested: "/Menu/MenuItem/SuggestedSelling",
  // Menu
  menuCategories: "/Menu/Categories/",
  menuCategory: "/Menu/Category/ByNameUnique",
  menuItem: "/Menu/MenuItem/ByNameUnique",
  topDeals: "/Menu/MenuItem/BestSold",
  // Checkout
  checkout: "/Order/CheckOut",
  preCheckout: "/Order/PreCheckOut",
  // Payment
  pay: "/Payment/Pay",
  paymentStatus: "/Payment/Status",
  // order
  orders: "/Orders",
  rollback: "/Order/RollBack",
  singleOrder: "/Order",
  rollBack: "/Order/RollBack",
  reorder: "/Order/ReOrder",
  // Rate Us
  rateUs: "/Order/RateUs",
  // Get store geo fencing
  getStoreGeoFencing: "/Store/GetStoreByGeoFencing",
  getStoreByArea: "/Store/GetStoreByArea",
  // Promo code
  applyPromoCode: "/Discount/ApplyPromoCode",
  removePromoCode: "/Discount/RemovePromoCode",
  // Notifications
  sendNotification: "/send-notification",
  getNotifications: "/Notifications",
  markAsRead: "/Notifications/MarkAsRead",
  allSections: "/AdvancedContent/Category",
  SingleSectionMedia: "/AdvancedContent/Category/Single/Media",
  SingleSectionContent: "/AdvancedContent/Category/Single/Content",
  SingleSectionSingleContent: "/AdvancedContent/Category/Single/Content/Single",
  SingleSectionSingleContentMedia:
    "/AdvancedContent/Category/Single/Content/Single/Media",
  singleCategoryDocument: "/AdvancedContent/Category/Single/Document",
  // SEO
  SEO: "/SEO/Retrieve",
  Faq: "/FAQ/RetriveAll",
  // Careers
  careers: "/Career/Jobs",
  submitCareer: "/Forms/Career/Submit",
  // Informative Forms
  submitBirthdayPackage: "/Forms/BirthDay/Submit",
  contactUs: "/Forms/ContactUS/Submit",
  submitParty: "/Forms/PartyPickup/Submit",
  privacyRequest: "/Forms/PrivacyRequest/Submit",
};

// Login | Signup Redirect
export const LOGIN_REDIRECT = "/menu";
// Reorder Redirect
export const REORDER_REDIRECT = "/cart";

// Mobile Apps URLs
export const GOOGLE_PLAY_APP_URL =
    "https://play.google.com/store/apps/details?id=com.paradigm.texaschicken",
  APP_GALLERY_URL = "https://apps.apple.com/eg/app/texas-chicken/id1438764129";

// Expiration
export const sessionIdExpireTime = 24 * 30 * 24 * 60 * 60 * 1000;
export const cookiesExpireTime = 30 * 24 * 60 * 60 * 1000;
export const allowTrackingExpireTime = 10 * 24 * 60 * 60 * 1000;

// Elements IDs
export const elementsIds = {
  pickupFormSelect: "order_location_form",
  deliveryForm: "deliveryForm",
  customizeWrapper: "customize_wrapper",
  checkoutGuestInfoForm: "checkoutGuestInfoForm",
  checkoutCaptchaWrapper: "checkoutCaptchaWrapper",
  orderDateWrapper: "orderDateWrapper",
  completeInfoFrom: "completeInfoFrom",
  addressWithSelect: "addressWithSelect",
};

// Cart Initial State
export const cartInitialState: CartProps = {
  TotalQuantity: 0,
  Lines: [],
  Deals: [],
  SubTotalAfterDiscount: 0.0,
  PromoCode: null,
  DealHeaderID: "",
  IsHeaderContainsLists: false,
  ExpiredDate: "",
  StoreID: "",
  OrderTypeID: "",
  SubTotal: 0.0,
  DiscountAmount: 0.0,
  DeliveryChargeAmount: 0.0,
  TaxAmount: 0.0,
  Total: 0.0,
  ID: "",
  AddressInformation: undefined,
};

// API Errors Response Codes
export const apiErrorCodes = {
  cartExpired: 409,
  tokenExpired: 401,
  missingParameter: 400,
  notFound: 404,
};

// Date of Birth
export const MAX_AGE = 99;
export const today = new Date();
export const minBirthDate = new Date(
  today.getFullYear() - MAX_AGE,
  today.getMonth(),
  today.getDate(),
);

// Auth Routes
export const AUTH_ROUTES = ["/login", "/signup", "/forgetpassword"];
export const AUTH_NOT_AVAILIABLE_REDIRECT = [
  "/login",
  "/signup",
  "/forgetpassword",
  "/track-order",
];

// file validations
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const AVAILABE_FILE_TYPES = [
  { "image/png": "PNG" },
  { "image/jpeg": "JPG" },
  { "image/gif": "GIF" },
  { "image/bmp": "BMP" },
  { "image/tiff": "TIFF" },
  { "image/webp": "WEBP" },
  { "application/pdf": "PDF" },
  { "application/msword": "DOC" },
  {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
  },
  { "application/vnd.ms-excel": "XLS" },
  {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  },
  { "application/vnd.ms-powerpoint": "PPT" },
  {
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
  },
  { "text/plain": "TXT" },
  { "application/rtf": "RTF" },
  { "text/csv": "CSV" },
];

// Regex
export const NAMES_REGEX = new RegExp(/^[\p{L}\p{M}\s’]+$/u);
export const PROMOCODE_REGEX = new RegExp(/[a-zA-Z0-9_@!$#]*$/);
// export const PROMOCODE_REGEX = new RegExp(/^[a-z_]*[@!$#][a-z_]*$/);
export const STRING_REGEX = new RegExp(
  /^[a-zA-Z\u0600-\u06FF_0-9_@!$#]+(?:\s+[a-zA-Z\u0600-\u06FF_0-9_@!$#]+)*$/,
);
// export const FLOOR_REGEX = new RegExp(/^[a-zA-Z0-9\u0621-\u064A\u0660-\u0669- ]+$/);
export const FLOOR_REGEX = new RegExp(/^[A-Za-z0-9-\u0600-\u06FF-. ]+$/);

export const LOWER_CASE_REGEX = new RegExp(/^(?=.*[a-z])/);
export const UPPER_CASE_REGEX = new RegExp(/^(?=.*[A-Z])/);
export const NO_SPACES_REGEX = new RegExp(/\s/);
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!])[A-Za-z\d@$!]{8,}$/,
);
export const MIN_NUMBER_REGEX = new RegExp(/^(?=.*\d)/);
export const PASSWORD_SPECIAL_CHARACTER_REGEX = new RegExp(
  /^(?=.*[@$!])[A-Za-z\d@$!/\s/]{1,}$/,
);

export const FIRST_NAME_REGEX = new RegExp(/^[a-zA-Z0-9_]+$/);
export const LAST_NAME_REGEX = new RegExp(/^[a-zA-Z0-9_]+$/);

export const TIME_REGEX = new RegExp(/^([01]\d|2[0-3]):([0-5]\d)$/);

export const ADDRESS_REGEX = new RegExp(
  /^[a-zA-Z0-9\u0600-\u06FF\u0660-\u0669,-\s]+$/,
);
// export const ADDRESS_REGEX = new RegExp(/^[a-zA-Z0-9,-\s]+$/);

export const rewardTabs = {
  ALL: "all",
  COLLECTED: "collected",
  CONSUMED: "consumed",
};

export const EducationLevel = {
  HighSchool: "HighSchool",
  AssociateDegree: "AssociateDegree",
  BachelorDegree: "BachelorDegree",
  MasterDegree: "MasterDegree",
  Doctorate: "Doctorate",
  Certificate: "Certificate",
  NoEducation: "NoEducation",
};

export const preferedWorkLocation = {
  OnSite: "OnSite",
  Remote: "Remote",
  Hybrid: "Hybrid",
};

export const jobType = {
  FullTime: "FullTime",
  PartTime: "PartTime",
};

export const InquiryType = {
  WeddingParty: "WeddingParty",
  BirthdayParty: "BirthdayParty",
  OfficeParty: "OfficeParty",
  SummerBackyardParty: "SummerBackyardParty",
  ChristmasParty: "ChristmasParty",
  WatchingTV: "WatchingTV",
  EmployeeLunch: "EmployeeLunch",
  Other: "Other",
};

export const MeatPreference = {
  BothWhiteDark: "BothWhiteDark",
  WhiteMeat: "WhiteMeat",
  DarkMeat: "DarkMeat",
};
