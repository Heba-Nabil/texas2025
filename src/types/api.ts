import { HomeBannerEnum, MediaTypeEnum } from "./enums";

// Error Props
export type ErrorProps = {
  Code: number;
  Title: string;
  Message: string;
};

export type CountryResourcesProps = {
  LanguageCode: string;
  Name: string;
  Value: string;
};

// Start of Single Country Props
export type LanguageProps = {
  Code: string;
  IsDefault: boolean;
  Direction: string;
  ID: string;
  Name: string;
};

export type AreaProps = {
  ID: string;
  Name: string;
  NameUnique: string;
};

export type CityProps = {
  ID: string;
  Name: string;
  NameUnique: string;
  Areas: AreaProps[];
};

export type SocialPlatformProps = {
  IconURL: string;
  URL: string;
  ID: string;
  Name: string;
};

export type StoreFacilityProps = {
  ID: number;
  Guid: string;
  Name: string;
  IconURL: string;
  DisplayOrder: number;
};

export type StoreProps = {
  Facilities: StoreFacilityProps[] | null;
  CityID: string;
  AreaID: string;
  Longitude: number;
  Latitude: number;
  Address: string | null;
  Phone: string;
  Email: string;
  OrderMinimumTime: number;
  OrderMaximumTime: number;
  WorkingHoursFrom: string;
  WorkingHoursTo: string;
  IsItBusy: boolean;
  IsItBusyMessage: string | null;
  IfItBusyIsItAvailable: boolean;
  ID: string;
  Name: string;
};

export type PartialCountryProps = {
  Languages: LanguageProps[];
  RegionName: string;
  ISOCode: string;
  FlagURL: string;
  WebsiteURL: string;
  ID: string;
  Name: string;
  NameUnique: string;
  DisplayOrder: number;
};

export type OrderTypeCityProps = {
  Stores: StoreProps[];
  ID: string;
  Name: string;
};

export type OrderTypeProps = {
  Cities: OrderTypeCityProps[];
  TypeID: number;
  IconURL: string;
  IsStoreDependent: boolean;
  ID: string;
  Name: string;
  NameUnique: string;
  DisplayOrder: number;
};

export type AuthenticationPlatformProps = {
  AuthenticationTypeID: number;
  ID: string;
  Name: string;
  DisplayOrder: number;
};

export type CountryModuleProps = {
  Name: string;
  Status: boolean;
};

export type CitizenshipProps = {
  ID: number;
  Name: string;
  DisplayOrder: number;
};

export type SingleCountryDataProps = PartialCountryProps & {
  Data: {
    Longitude: number;
    Latitude: number;
    Zoom: number;
    PhoneRegex: string;
    CountryPhoneCode: string;
    CustomerServiceLine: string;
    OrderEmail: string;
    CurrencyISOCode: string;
    CurrencyName: string;
    IsTaxInclusive: boolean;
    TaxPercentage: number;
    EnableCalories: boolean;
    MinOrderValue: number;
    DeliveryChargeValue: number;
    CartExpirationTime: number;
    EnableCartExpiration: boolean;
    EnableAddressMapLocation: boolean;
    EnableAgeConfirmation: boolean;
    EnablePrivacyPolicyConfirmation: boolean;
    EnableTermsConfirmation: boolean;
    EnableMarketingConfirmation: boolean;
    EnableOrderNotificationConfirmation: boolean;
    EnableLoyaltyProgram: boolean;
    EnableDeals: boolean;
    IsCartOrderTypeRequired: boolean;
    IsCartClearedOnOrderTypeChange: boolean;
    IsGenderRequired: boolean;
    IsBirthDateRequired: boolean;
  };
  Cities: CityProps[];
  OrderTypes: OrderTypeProps[];
  SocialPlatforms: SocialPlatformProps[];
  AuthenticationPlatforms: AuthenticationPlatformProps[];
  Stores: StoreProps[];
  Categories: MenuCategoryProps[];
  Module: CountryModuleProps[];
  Citizenship: CitizenshipProps[];
  RegionName: string;
  ISOCode: string;
  FlagURL: string;
  WebsiteURL: string;
  ID: string;
  Name: string;
  NameUnique: string;
  DisplayOrder: number;
};
// End of Single Country Props

// Start of Guest
export type GuestTokenResponseProps = {
  Token: string;
};
// End of Guest

// Start of Home Banners
export type HomeBannerResponseProps = {
  MenuItem: CategoryItemProps | null;
  CountryID: string;
  TypeID: HomeBannerEnum;
  MobileIconURL: string | null;
  WebPortraitIconURL: string | null;
  WebLandscapeIconURL: string | null;
  DeepLinkPath: string | null;
  ID: string;
  DisplayOrder: number;
};
// End of Home Banners

// Start of Menu
export type MenuCategoryProps = {
  IconURL: string;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type CategoryItemVariantProps = {
  CategoryID: string;
  CategoryName: string;
  CategoryNameUnique: string;
  IsCustomizable: boolean;
  Variants: null;
  IsFavorite: boolean;
  VariantTypeName: string;
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IsFeatured: boolean;
  IsBestSeller: boolean;
  Calories: string | null;
  IconURL: string;
  IsTaxInclusive: boolean;
  TaxPercentage: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type CategoryItemProps = {
  CategoryID: string;
  CategoryName: string;
  CategoryNameUnique: string;
  IsCustomizable: boolean;
  Variants: CategoryItemVariantProps[];
  IsFavorite: boolean;
  VariantTypeName: string;
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IsFeatured: boolean;
  IsBestSeller: boolean;
  Calories: string | null;
  IconURL: string;
  IsTaxInclusive: boolean;
  TaxPercentage: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type MenuSinlgeCategoryProps = MenuCategoryProps & {
  MenuItems: CategoryItemProps[];
};

export type ModifierItemProps = {
  ModifierGroups: ModifierGroupProps[];
  DisplayModeID: number;
  DefaultQuantity: number;
  MinQuantity: number;
  MaxQuantity: number;
  ExtraPrice: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IconURL: string;
  IsDiscountPercentageApplied: boolean;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  SelectedQuantity?: number;
  DisplayOrder: number;
};

export type ModifierGroupProps = {
  ModifierItems: ModifierItemProps[];
  DisplayModeID: number;
  MinQuantity: number;
  MaxQuantity: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type MealItemProps = {
  CategoryID: string;
  CategoryName: string;
  CategoryNameUnique: string;
  IsCustomizable: boolean;
  Variants: CategoryItemVariantProps[];
  ModifierGroups: ModifierGroupProps[];
  IsFavorite: boolean;
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IsFeatured: boolean;
  IsBestSeller: boolean;
  Calories: string | null;
  IconURL: string;
  IsTaxInclusive: boolean;
  TaxPercentage: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
  SelectedQuantity?: number;
};
// End of Menu

// Start of Cart
export type CartModifierItemProps = {
  SelectedQuantity: number;
  SinglePrice: number;
  SingleDiscount: number;
  Total: number;
  ModifierGroups: CartModifierGroupProps[];
  DefaultQuantity: number;
  MinQuantity: number;
  MaxQuantity: number;
  ExtraPrice: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IconURL: string;
  IsDiscountPercentageApplied: boolean;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type CartModifierGroupProps = {
  ModifierItems: CartModifierItemProps[];
  DisplayModeID: number;
  MinQuantity: number;
  MaxQuantity: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type CartLineMenuItemProps = {
  CategoryID: string;
  CategoryName: string;
  CategoryNameUnique: string;
  IsCustomizable: boolean;
  SelectedQuantity: number;
  CustomizationDescription: string;
  ModifierGroups: CartModifierGroupProps[];
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IsFeatured: boolean;
  IsBestSeller: boolean;
  Calories: string | null;
  IconURL: string;
  IsTaxInclusive: boolean;
  TaxPercentage: number;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type CartLineProps = {
  MenuItem: CartLineMenuItemProps;
  CreatedDate: string;
  ModifiedDate: string;
  IsQuickAdd: boolean;
  DealDetailsID: string | null;
  DealHeaderID: string | null;
  DealName: string | null;
  DealPoints: number;
  Quantity: number;
  SinglePrice: number;
  SingleExtraPrice: number;
  SingleDiscountAmount: number;
  SubTotal: number;
  TotalDiscountAmount: number;
  SubTotalAfterDiscount: number;
  Total: number;
  ID: string;
};

export type CartDealProps = {
  ID: string;
  Name: string;
  Points: number;
  Lines: CartLineProps[];
};

export type CartProps = {
  TotalQuantity: number;
  Lines: CartLineProps[];
  Deals: CartDealProps[] | null;
  IsHeaderContainsLists: boolean;
  PromoCode: string | null;
  ExpiredDate: string;
  StoreID: string;
  OrderTypeID: string;
  SubTotal: number;
  SubTotalAfterDiscount: number;
  DiscountAmount: number;
  DeliveryChargeAmount: number;
  TaxAmount: number;
  Total: number;
  DealHeaderID: string;
  ID: string;
  AddressInformation?: {
    Longitude: number;
    Latitude: number;
    CityID: string;
    CityName: string;
    AreaID: string;
    AreaName: string;
    Block: string;
    Street: string;
    Building: string;
    Floor: string;
    Apartment: string;
    Landmark: string;
    Instructions: string | null;
    AddressID: string;
  };
};

export type CartActionResponseProps = {
  Cart: {
    SubTotal: number;
    SubTotalAfterDiscount: number;
    DiscountAmount: number;
    DeliveryChargeAmount: number;
    TaxAmount: number;
    Total: number;
    TotalQuantity: number;
  };
  Line: CartLineProps;
};
// End of Cart

// Start of Checkout
export type PaymentProps = {
  LogoURl: string;
  URL: string;
  TypeID: number;
  ResponseSuccessURL: string | null;
  ResponseFailURL: string | null;
  ID: string;
  Name: string;
  NameUnique: string;
};

export type CheckoutResponseProps = {
  OrderNumber: string;
  Payments: PaymentProps[];
};
// End of Checkout

// Start of Payments
export type PayResponseProps = {
  ID?: string;
  PaymentID?: string;
  URL?: string;
};

export type PaymentStatusResponseProps = {
  PaymentMethodName: string;
  OrderNumber: string;
  LogoURL: string | null;
  ID: string;
  HeaderID: string;
  CurrencyISO: string;
  Amount: number;
  InitializedDate: string;
  ResponseDate: string;
  IsCompleted: boolean;
  PaymentTransactionNumber: number | null;
  IsPaymentResponseSucceeded: boolean;
};
// End of Payments

// Start of Order
export type OrderMenuItemProps = {
  CustomizationDescription: string;
  IsReorderable: boolean;
  DealHeaderGUID: string | null;
  DealDetailsGUID: string | null;
  Quantity: number;
  SinglePrice: number;
  SingleExtraPrice: number;
  SingleDiscountAmount: number;
  SingleTaxAmount: number;
  SubTotal: number;
  TotalDiscount: number;
  TotalTax: number;
  Total: number;
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IsFeatured: boolean;
  IsBestSeller: boolean;
  Calories: string | null;
  IconURL: string;
  IsTaxInclusive: boolean;
  TaxPercentage: number;
  IsAddingPoints: boolean;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
};

export type OrderDealItemProps = {
  ID: string;
  Title: string;
  Name: string;
  Points: number;
  Description: string;
  IconURL: null | string;
  MenuItems: OrderMenuItemProps[];
};

export type TrackingStatusProps = {
  IsOn: boolean;
  StatusIcon: string;
  StatusDate: string;
  Name: string;
  NameUnique: string;
  DisplayOrder: number;
};

export type PaymentsProps = {
  PaymentMethodName: string | null;
  OrderNumber: string | null;
  LogoURL: string;
  TypeID: number;
  ID: string;
  HeaderID: string;
  CurrencyISO: string;
  Amount: number;
  InitializedDate: string;
  ResponseDate: string;
  IsCompleted: boolean;
  PaymentTransactionNumber: number | null;
  IsPaymentResponseSucceeded: boolean;
};

export type TrackOrderTypesProps = {
  TypeID: number;
  IconURL: string;
  IsStoreDependent: boolean;
  Name: string;
};

export type ApplicationUserProps = {
  AreaID: string;
  CityID: string;
  Block: string;
  Street: string;
  Building: string;
  Floor: string;
  Apartment: string;
  Landmark: string;
  Longitude: number;
  Latitude: number;
  Email: string;
  Phone: string;
  Name: string;
  AddressID?: string;
};

export type SingleOrderResponseProps = {
  ID: string;
  DealHeaderID: string | null;
  OrderNumber: string;
  OrderDate: string;
  SubTotal: number;
  DiscountAmount: number;
  DeliveryChargeAmount: number;
  TaxAmount: number;
  Total: number;
  PromoCode: string | null;
  IsCompleted: boolean;
  Points: number;
  Note: string;
  Rate: number;
  MenuItemsCount: number;
  Store: StoreProps;
  ApplicationUserInformation: ApplicationUserProps;
  Payments: PaymentsProps[];
  OrderType: TrackOrderTypesProps;
  TrackingStatus: TrackingStatusProps[];
  MenuItems: OrderMenuItemProps[];
  Deals: OrderDealItemProps[] | null;
  IsReorderable?: boolean;
};

export type OrderRollbackResponseProps = {
  CityID: string;
  ApplicationUserInformation: ApplicationUserProps;
} & CartProps;

export type ReorderResponseProps = {
  CityID: string;
  ApplicationUserInformation: ApplicationUserProps | null;
} & CartProps;
// End of Order

// Start of Application User
export type AuthenticationProps = {
  UserName: string;
  AuthenticationTypeID: number;
  ThirdPartyEmail: string | null;
  ThirdPartyID: string | null;
  IsDisabled: boolean;
  CreatedDate: string;
  ID: string;
};

export type ProfileDataProps = {
  Authentications: AuthenticationProps[];
  CountryID: string;
  PreferredLanguageISOCode: string;
  FirstName: string;
  LastName: string;
  BirthDate: string;
  LastLoginDate: string;
  Phone: string;
  Email: string;
  ProfileImageURL: string;
  Points: number;
  IsMale: boolean;
  IsBlocked: boolean;
  IsVerified: boolean;
  IsSubscribedMarketing: boolean;
  IsSubscribedNotification: boolean;
  IsAllowTracking: boolean;
  TotalGainedPoints: number;
  TotalExpiredPoints: number;
  TotalUsedPoints: number;
  CreatedByRequestSource: string;
  CreatedDate: string;
  ModifiedDate: string;
  IsDeleted: boolean;
  ID: string;
};

export type ApplicationUserResponseProps = {
  Profile: ProfileDataProps;
  Token: string;
};

export type AddressProps = {
  AddressID?: string | null;
  Phone: string;
  CityID: string;
  AreaID: string;
  Block: string | null;
  Street: string | null;
  Building: string | null;
  Floor: string | null;
  Apartment: string | null;
  Landmark: string | null;
  Instructions: string | null;
  Longitude?: string | null;
  Latitude?: string | null;
};

export type GetAddressResponse = {
  Phone: string;
  CityID: string;
  AreaID: string;
  Block: string | null;
  Street: string | null;
  Building: string | null;
  Floor: string | null;
  Apartment: string | null;
  Landmark: string | null;
  Instructions: string | null;
  Longitude?: string | null;
  Latitude?: string | null;
  ID: string;
};
export type UserAddressProps = {
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
  Longitude: number;
  Latitude: number;
  ID: string;
};

export type UserDealsResponseProps = {
  IsHeaderContainsLists: boolean;
  CountryID: string;
  Points: number;
  IconURL: string | null;
  Title: string | null;
  ID: string;
  Name: string;
  Description: string;
  DisplayOrder: number;
};

export type UserSingleDealListDetailsProps = {
  MenuItemName: string;
  MenuItemDescription: string;
  Price: number;
  DiscountAmount: number;
  DiscountPercentage: number;
  PriceAfterDiscount: number;
  IsDiscountViewPercentage: boolean;
  IconURL: string;
  ID: string;
  DisplayOrder: number;
  SelectedQuantity?: number;
};

export type UserSingleDealListItemProps = {
  Details: UserSingleDealListDetailsProps[];
  ID: string;
  Name: string;
  Description: string;
  DisplayOrder: number;
};

export type UserSingleDealResponseProps = UserDealsResponseProps & {
  Lists: UserSingleDealListItemProps[];
};

export type UserLoyaltyTiersResponseProps = {
  PointsRangeStart: number;
  PointsRangeEnd: number;
  PointsExpiryDays: number;
  BackgroundColor: string | null;
  TextColor: string | null;
  ButtonBackgroundColor: string | null;
  ButtonTextColor: string | null;
  IconURL: string;
  IsLastTier: boolean;
  ID: string;
  Name: string;
  NameUnique: string;
  Description: string;
  DisplayOrder: number;
};

export type UserLoyaltyStatusResponseProps = {
  CurrentTier: UserLoyaltyTiersResponseProps;
  TotalPoints: number;
  RemainingPointsToNextTier: number;
  NextTierName: string;
  TotalGainedPoints: number;
  TotalExpiredPoints: number;
  TotalUsedPoints: number;
};

export type UserLoyaltyHistoryResponseProps = {
  RefernceNumber: string;
  TransactionNumber: string;
  Points: number;
  ReferenceTypeID: number;
  ExpiryDate: string | null;
  CreatedDate: string;
  ID: string;
};

export type NotificationItemProps = {
  Title: string;
  IconURL: string | null;
  IsRead: boolean;
  ReadDate: string | null;
  CreatedDate: string;
  ID: string;
  Description: string;
  DeepLinkPath: string | null;
};

export type PageSectionResponseType = {
  UniqueName: string;
  InstanceUniqueName: string;
  ParentCategoryName: string | null;
  ParentCategoryUniqueName: string | null;
  Order: number;
  Status: boolean;
  Name: string;
  DescriptionShort: string | null;
  DescriptionLong: string;
  Featured: boolean;
  Source1: string | null;
  Source2: string | null;
  Link1: string | null;
  Link2: string | null;
  ImageUrl: string | null;
  MediumImage: string | null;
  ThumbnailImage: string | null;
  FeaturedImageUrl: string | null;
  FeaturedMediumImage: string | null;
  FeaturedThumbnailImage: string | null;
  BannerImageUrl: string | null;
  BannerMediumImage: string | null;
  BannerThumbnailImage: string | null;
  FeaturedBannerImageUrl: string | null;
  FeaturedBannerMediumImage: string | null;
  FeaturedBannerThumbnailImage: string | null;
  PageTitle: string;
  PageDescription: string | null;
  PageKeywords: string | null;
  OGtype: string | null;
  OGtitle: string | null;
  OGdescription: string | null;
  OGimage: string;
  Twittertitle: string | null;
  Twitterdescription: string | null;
  Twitterimage: string;
  AdvancedCategoryMedia: string | null;
  AdvancedCategoryDocument: string | null;
};

export type SingleCategoryMediaProps = {
  CategoryName: string;
  CategoryUniqueName: string;
  Name: string;
  ShortDescription: string | null;
  Alt: string | null;
  Type: MediaTypeEnum;
  TypeName: string;
  ActualImage: string | null;
  MediumImage: string | null;
  ThumbnailImage: string | null;
  URL: string;
  YoutubeLink: string;
  Video: string;
  Prima: boolean;
  Featured: boolean;
  DisplayOrder: number;
};

export type PageSectionMediaType = {
  ContentName: string;
  ContentUniqueName: string;
  Name: string;
  ShortDescription: string;
  Alt: string;
  Type: number;
  TypeName: string;
  ImageUrl: string | null;
  MediumImage: string | null;
  ThumbnailImage: string | null;
  URL: string;
  YoutubeLink: string;
  Video: string;
  Prima: boolean;
  Featured: boolean;
  Order: number;
};

export type PageSectionContentType = {
  UniqueName: string;
  InstanceUniqueName: string;
  InstanceName: string;
  AdvancedContentCategoryID: number;
  ImageUrl: string | null;
  MediumImage: string | null;
  ThumbnailImage: string | null;
  FeatureImageUrl: string | null;
  FeatureMediumImage: string | null;
  FeatureThumbnailImage: string | null;
  CategoryName: string;
  CategoryUniqueName: string;
  CategoryStatus: boolean;
  Name: string;
  DescriptionShort: string | null;
  DescriptionLong: string | null;
  Date: string | null;
  StartDate: string | null;
  EndDate: string | null;
  Order: number;
  Status: boolean;
  Featured: boolean;
  Link1: string | null;
  Link2: string | null;
  Link3: string | null;
  Source1: string | null;
  Source2: string | null;
  Source3: string | null;
  Auther1: string | null;
  Auther2: string | null;
  Auther3: string | null;
  Footer: string | null;
  Header: string | null;
  PageTitle: string;
  PageDescription: string | null;
  PageKeywords: string | null;
  OGtype: string | null;
  OGtitle: string | null;
  OGdescription: string | null;
  OGimage: string;
  Twittertitle: string | null;
  Twitterdescription: string | null;
  Twitterimage: string;
  AdvancedContentMedias: any | null;
  AdvancedContentDocuments: any | null;
};

export type SingleCategoryDocResponseProps = {
  URL: string;
  Status: boolean;
  Prima: boolean;
  Featured: boolean;
  DisplayOrder: number;
  Name: string;
  ImageAlt: null | string;
  ShortDescription: string;
};

export type PageMetadata = {
  ID: number;
  ControlName: string | null;
  FriendlyName: string;
  MenuName: string;
  PageTitle: string;
  PageDescription: string;
  PageKeywords: string;
  OGtype: string;
  OGtitle: string;
  OGdescription: string;
  OGimage: string;
  Twittertitle: string;
  Twitterdescription: string;
  Twitterimage: string;
  H1: string;
  H2: string;
  H3: string;
  Status: boolean;
};

export type FaqItemType = {
  Question: string;
  Answer: string;
};

export type CareersItemType = {
  UniqueCode: string;
  DisplayDate: string;
  DisplayOrder: number;
  Title: string;
  Description: string;
  DescriptionShort: string | null;
  ImageActual: string;
  ImageMedium: string;
  ImageThumbnail: string;
  Alt: string | null;
  PageTittle: string | null;
  PageDescription: string | null;
  PageKeywords: string | null;
  OGtype: string | null;
  OGtitle: string | null;
  OGdescription: string | null;
  OGimage: string | null;
  Twittertitle: string | null;
  Twitterdescription: string | null;
  Twitterimage: string | null;
  ShowOn: string | null;
  ShowDate: string | null;
  DisabledOn: string | null;
  DisabledDate: string | null;
};

export type PrivacyRequestResponseType = {
  FileData: string;
  FileName: string;
};
// export type NotificationItemProps = {
//   ID: string;
//   ApplicationUserID: string;
//   Title: string;
//   Message: string;
//   NotificationDate: string;
//   ReadFlag: boolean;
// };
// End of Application User
