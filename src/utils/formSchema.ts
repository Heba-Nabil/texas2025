import {
  STRING_REGEX,
  PASSWORD_REGEX,
  PROMOCODE_REGEX,
  NAMES_REGEX,
  FLOOR_REGEX,
  TIME_REGEX,
  ADDRESS_REGEX,
} from "./constants";
import { GuestDeliveryOrderTypesFormResourcesProps } from "@/types";
// Types
import {
  AddressesModalResourcesProps,
  BirthdayPageResourcesProps,
  CareersDetailsPageResourcesProps,
  CompleteInfoResourcesProps,
  ContactPageResourcesProps,
  ForgetPasswordPageResourcesProps,
  LoginPageResourcesProps,
  PartyPageResourcesProps,
  PrivacyRequestPageeResourcesProps,
  ProfilePageResourcesProps,
  PromoCodeFormResourcesProps,
  ReportIssuePageResourcesProps,
  SignupPageResourcesProps,
  SuggestFeaturePageResourcesProps,
} from "@/types/resources";

// Login Inputs Schema
export async function loginFormSchema(resources: LoginPageResourcesProps) {
  const z = await import("zod");

  return z.object({
    email: z
      .string()
      .trim()
      .min(5, resources["requiredEmailWithMinLengthOfFive"])
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    password: z
      .string()
      .trim()
      .min(1, resources["requiredPass"])
      .max(50, resources["maxLengthFiftyCharacter"]),
  });
}

// Forget password form schema
export async function forgetPasswordFormSchema(
  resources: ForgetPasswordPageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    email: z
      .string()
      .trim()
      .min(5, resources["requiredEmailWithMinLengthOfFive"])
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
  });
}

// Signup Inputs Schema
export async function signupFormSchema(
  resources: SignupPageResourcesProps,
  PhoneRegex: string,
  confirmationFields: {
    EnableTermsConfirmation: boolean;
    EnableAgeConfirmation: boolean;
    EnablePrivacyPolicyConfirmation: boolean;
  },
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    lastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    password: z
      .string()
      // .trim()
      .min(1, resources["requiredPass"])
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .regex(PASSWORD_REGEX, resources["passwordNotValid"]),
    termsConfirmation: confirmationFields?.EnableTermsConfirmation
      ? z.literal(true)
      : z.boolean(),
    ageConfirmation: confirmationFields?.EnableAgeConfirmation
      ? z.literal(true)
      : z.boolean(),
    privacyConfirmation: confirmationFields?.EnablePrivacyPolicyConfirmation
      ? z.literal(true)
      : z.boolean(),
    marketingConfirmation: z.boolean(),
    orderNotificationConfirmation: z.boolean(),
  });
}

// Checkout Guest Info Form Schema
type CheckoutGuestFormSchemaProps = {
  resources: {
    requiredFirstName: string;
    maxLength: string;
    character: string;
    requiredLastName: string;
    specialCharactersNotAllowed: string;
    requiredEmail: string;
    emailNotValid: string;
    requiredPhone: string;
    phoneValidate: string;
    canOnlyContainLettersOrComma: string;
  };
  PhoneRegex: string;
};

export async function checkoutGuestInfoFormSchema(
  props: CheckoutGuestFormSchemaProps,
) {
  const { resources, PhoneRegex } = props;

  const phoneRegexValidation = new RegExp(PhoneRegex);

  const z = await import("zod");

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: resources["requiredFirstName"] })
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(NAMES_REGEX, `${resources["canOnlyContainLettersOrComma"]}`),
    lastName: z
      .string()
      .trim()
      .min(1, { message: resources["requiredLastName"] })
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(NAMES_REGEX, `${resources["canOnlyContainLettersOrComma"]}`),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
  });
}

// Update profile form Schema
export async function updateProfileFormSchema(
  resources: ProfilePageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    lastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    marketingConfirmation: z.boolean(),
    orderNotificationConfirmation: z.boolean(),
  });
}

// Change password form schema
export async function changePasswordFormSchema(resources: {
  requiredPass: string;
  maxLength: string;
  character: string;
  passwordNotValid: string;
  passNotMatch: string;
}) {
  const z = await import("zod");

  return z
    .object({
      currentPassword: z
        .string()
        .trim()
        .min(1, resources["requiredPass"])
        .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
        .regex(PASSWORD_REGEX, resources["passwordNotValid"]),
      newPassword: z
        .string()
        // .trim()
        .min(1, resources["requiredPass"])
        .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
        .regex(PASSWORD_REGEX, resources["passwordNotValid"]),
      confirmPassword: z.string().trim().min(1, resources["requiredPass"]),
    })
    .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: "custom",
          message: resources["passNotMatch"],
          path: ["confirmPassword"],
        });
      }
    });
}

// User address with select
export async function userAddressWithSelectSchema(
  resources: AddressesModalResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    Phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    CityID: z.string().trim().min(1, resources["cityRequired"]),
    AreaID: z.string().trim().min(1, resources["areaRequired"]),
    Block: z
      .string()
      .trim()
      .min(1, resources["requiredBlockNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["block"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Street: z
      .string()
      .trim()
      .min(1, resources["requiredStreet"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["street"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Building: z
      .string()
      .trim()
      .min(1, resources["requiredBuildingNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["building"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Floor: z
      .string()
      .trim()
      .min(1, resources["requiredFloorNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["floor"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Apartment: z
      .string()
      .trim()
      .min(1, resources["requiredApartment"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["apartment"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Landmark: z
      .string()
      .trim()
      .min(1, resources["requiredLandMark"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["landmark"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
  });
}

type CompleteInfoFormSchemaProps = {
  resources: CompleteInfoResourcesProps;
  PhoneRegex: string;
  confirmationFields: {
    EnableTermsConfirmation: boolean;
    EnableAgeConfirmation: boolean;
    EnablePrivacyPolicyConfirmation: boolean;
  };
};

// Complete Info Form Schema
export async function completeInfoFormSchema(
  props: CompleteInfoFormSchemaProps,
) {
  const { resources, PhoneRegex, confirmationFields } = props;

  const phoneRegexValidation = new RegExp(PhoneRegex);

  const z = await import("zod");

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: resources["requiredFirstName"] })
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(NAMES_REGEX, `${resources["canOnlyContainLettersOrComma"]}`),
    lastName: z
      .string()
      .trim()
      .min(1, { message: resources["requiredLastName"] })
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(NAMES_REGEX, `${resources["canOnlyContainLettersOrComma"]}`),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    termsConfirmation: confirmationFields?.EnableTermsConfirmation
      ? z.literal(true)
      : z.boolean(),
    ageConfirmation: confirmationFields?.EnableAgeConfirmation
      ? z.literal(true)
      : z.boolean(),
    privacyConfirmation: confirmationFields?.EnablePrivacyPolicyConfirmation
      ? z.literal(true)
      : z.boolean(),
    marketingConfirmation: z.boolean(),
    orderNotificationConfirmation: z.boolean(),
  });
}

// User address with Map
export async function userAddressWithMapSchema(
  resources: AddressesModalResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    Phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    CityID: z.string().trim().min(1, resources["pickPinOnMap"]),
    AreaID: z.string().trim().min(1, resources["pickPinOnMap"]),
    Block: z
      .string()
      .trim()
      .min(1, resources["requiredBlockNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["block"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Street: z
      .string()
      .trim()
      .min(1, resources["requiredStreet"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["street"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Building: z
      .string()
      .trim()
      .min(1, resources["requiredBuildingNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["building"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Floor: z
      .string()
      .trim()
      .min(1, resources["requiredFloorNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["floor"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Apartment: z
      .string()
      .trim()
      .min(1, resources["requiredApartment"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["apartment"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Landmark: z
      .string()
      .trim()
      .min(1, resources["requiredLandMark"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["landmark"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
  });
}

// Guest Delivery Form
export async function guestDeliveryOrderTypeFormSchema(
  resources: GuestDeliveryOrderTypesFormResourcesProps,
  enableMap: boolean,
) {
  const z = await import("zod");

  return z.object({
    CityID: z
      .string()
      .trim()
      .min(
        1,
        enableMap ? resources["pickPinOnMap"] : resources["cityRequired"],
      ),
    AreaID: z
      .string()
      .trim()
      .min(
        1,
        enableMap ? resources["pickPinOnMap"] : resources["areaRequired"],
      ),
    Block: z
      .string()
      .trim()
      .min(1, resources["requiredBlockNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["block"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Street: z
      .string()
      .trim()
      .min(1, resources["requiredStreet"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["street"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Building: z
      .string()
      .trim()
      .min(1, resources["requiredBuildingNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["building"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Floor: z
      .string()
      .trim()
      .min(1, resources["requiredFloorNumber"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["floor"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Apartment: z
      .string()
      .trim()
      .min(1, resources["requiredApartment"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["apartment"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
    Landmark: z
      .string()
      .trim()
      .min(1, resources["requiredLandMark"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        FLOOR_REGEX,
        `${resources["landmark"]} ${resources["fieldAcceptsAlphaNumericAndDash"]}`,
      ),
  });
}

// PromoCode Input Schema
export async function promoCodeFormSchema(
  resources: PromoCodeFormResourcesProps,
) {
  const z = await import("zod");

  return z.object({
    Code: z
      .string()
      .trim()
      .min(3, `${resources["minLength"]} 3 ${resources["character"]}`)
      .max(12, `${resources["maxLength"]} 12 ${resources["character"]}`)
      .regex(
        PROMOCODE_REGEX,
        `${resources["promocode"]} ${resources["promoCodeRegexErrorMessage"]}`,
      ),
  });
}

// Birthday Package Schema
export async function birthdayPackageFormSchema(
  resources: BirthdayPageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    Name: z
      .string()
      .trim()
      .min(1, resources["requiredName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["fullName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    Email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    ContactNumber: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    BirthdayDate: z
      .string()
      .trim()
      .min(1, resources["requiredDate"])
      .refine((date) => !isNaN(Date.parse(date)), {
        message: resources["invalidDate"],
      }),
    Age: z.coerce
      .number({ message: resources["requiredAge"] })
      .min(1, { message: resources["invalidAge"] })
      .max(99, { message: resources["invalidAge"] }),
    NumberofInvitees: z.coerce
      .number({ message: resources["requiredInvitees"] })
      .min(1, { message: resources["requiredInvitees"] })
      .max(99, { message: resources["requiredInvitees"] }),
    Gender: z.string().min(1, resources["requiredGender"]),
    City: z
      .string({ required_error: resources["cityRequired"] })
      .min(1, resources["cityRequired"]),
  });
}

// Contact Form Schema
export async function contactUsFormSchema(
  resources: ContactPageResourcesProps,
  PhoneRegex: string,
  moduleInput: {
    contactArea: boolean | undefined;
  },
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  const { contactArea } = moduleInput;

  return z.object({
    FirstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    Email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    Phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    Subject: z
      .string()
      .trim()
      .min(1, resources["subjectRequired"])
      .min(5, resources["subjectMinLength"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["subject"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    Message: z
      .string()
      .trim()
      .min(2, resources["requiredMessage"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["message"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    Date: z
      .string()
      .trim()
      .min(1, resources["requiredDate"])
      .refine((date) => !isNaN(Date.parse(date)), {
        message: resources["invalidDate"],
      }),
    Time: z
      .string()
      .trim()
      .min(1, resources["requiredTime"])
      .regex(TIME_REGEX, resources["invalidTime"]),
    files: z.array(z.instanceof(File)).optional(),
    CityID: contactArea
      ? z.string().trim().min(1, resources["cityRequired"])
      : z.string().trim().optional(),
    StoreID: contactArea
      ? z.string().trim().min(1, resources["branchRequired"])
      : z.string().trim().optional(),
  });
}

// Career Form Schema
export async function careersFormSchema(
  resources: CareersDetailsPageResourcesProps,
  PhoneRegex: string,
  moduleInput: {
    careerArea: boolean | undefined;
    careerCitizenID: boolean | undefined;
    careerDate: boolean | undefined;
    careerResidential: boolean | undefined;
    careerEducational: boolean | undefined;
  },
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  const {
    careerArea,
    careerCitizenID,
    careerDate,
    careerResidential,
    careerEducational,
  } = moduleInput;

  return z.object({
    Name: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    Email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    PhoneNumber: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    DateOfBirth: careerDate
      ? z
          .string()
          .trim()
          .min(1, resources["requiredDate"])
          .refine((date) => !isNaN(Date.parse(date)), {
            message: resources["invalidDate"],
          })
      : z.string().trim().optional(),
    CitizenshipID: careerCitizenID
      ? z.string().trim().min(1, resources["requiredCitizenshipID"])
      : z.string().trim().optional(),
    ResidentialAddress: careerResidential
      ? z
          .string()
          .trim()
          .min(1, resources["requiredResidentialAddress"])
          .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
          .regex(
            ADDRESS_REGEX,
            `${resources["ResidentialAddress"]} ${resources["canOnlyContainNumbersAndlettersAndCommas"]}`,
          )
      : z.string().trim().optional(),
    JobType: z
      .string()
      .trim()
      .min(1, resources["requiredJobType"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["JobType"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    EducationLevel: careerEducational
      ? z.string().trim().min(1, resources["requiredEducationLevel"])
      : z.string().trim().optional(),
    WorkLocation: z.string().trim().min(1, resources["requiredWorkLoction"]),
    CityID: careerArea
      ? z.string().trim().min(1, resources["cityRequired"])
      : z.string().trim().optional(),
    AreaID: careerArea
      ? z.string().trim().min(1, resources["requiredAreaID"])
      : z.string().trim().optional(),
  });
}

// Party Form Schema
export async function partyFormSchema(
  resources: PartyPageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    FirstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    Email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    Phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    Notes: z.string().trim(),
    InquiryDate: z
      .string()
      .trim()
      .min(1, resources["requiredDate"])
      .refine((date) => !isNaN(Date.parse(date)), {
        message: resources["invalidDate"],
      }),
    InquiryTime: z
      .string()
      .trim()
      .min(1, resources["requiredTime"])
      .regex(TIME_REGEX, resources["invalidTime"]),
    CityID: z.string().trim().min(1, resources["cityRequired"]),
    BranchID: z.string().trim().min(1, resources["storeRequired"]),
    kindofparty: z.string().trim().min(1, resources["requiredInquiry"]),
    Numberofchickenpieces: z.coerce
      .number()
      .min(1, { message: resources["invalidNumberofchickenpieces"] })
      .max(99, { message: resources["invalidNumberofchickenpieces"] })
      .optional(),
  });
}

// Privacy Request Schema
export async function privacyRequestFormSchema(
  resources: PrivacyRequestPageeResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    FirstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    Email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    Password: z
      .string()
      .trim()
      .min(1, resources["requiredPass"])
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`),
    Phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    ResidencyDetails: z
      .string()
      .trim()
      .min(1, resources["residencyDetailsRequired"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["residencyDetails"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    RequestTypeID: z
      .string()
      .trim()
      .min(1, resources["dataOptionRequired"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["dataOption"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
  });
}

// Report Issue Schema
export async function reportIssueFormSchema(
  resources: ReportIssuePageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    FirstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    issueTitle: z
      .string()
      .trim()
      .min(1, resources["requiredIssueTitle"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["issueTitle"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    details: z
      .string()
      .trim()
      .min(1, resources["requiredDetails"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["details"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
  });
}

// Suggest Feature Schema
export async function suggestFeatureFormSchema(
  resources: SuggestFeaturePageResourcesProps,
  PhoneRegex: string,
) {
  const z = await import("zod");
  const phoneRegexValidation = new RegExp(PhoneRegex);

  return z.object({
    FirstName: z
      .string()
      .trim()
      .min(1, resources["requiredFirstName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["firstName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    LastName: z
      .string()
      .trim()
      .min(1, resources["requiredLastName"])
      .max(80, `${resources["maxLength"]} 80 ${resources["character"]}`)
      .regex(
        NAMES_REGEX,
        `${resources["lastName"]} ${resources["canOnlyContainLettersOrComma"]}`,
      ),
    email: z
      .string()
      .trim()
      .min(1, { message: resources["requiredEmail"] })
      .max(50, `${resources["maxLength"]} 50 ${resources["character"]}`)
      .email(resources["emailNotValid"]),
    phone: z
      .string()
      .trim()
      .min(1, { message: resources["requiredPhone"] })
      .regex(phoneRegexValidation, resources["phoneValidate"]),
    featureTitle: z
      .string()
      .trim()
      .min(1, resources["requiredFeatureTitle"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["featureTitle"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
    details: z
      .string()
      .trim()
      .min(1, resources["requiredDetails"])
      .max(100, `${resources["maxLength"]} 100 ${resources["character"]}`)
      .regex(
        STRING_REGEX,
        `${resources["details"]} ${resources["canOnlyContainLettersNumbersUnderscoes"]}`,
      ),
  });
}
