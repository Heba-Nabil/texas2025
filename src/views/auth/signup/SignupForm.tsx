"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useRouter } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { fixedKeywords, LOGIN_REDIRECT } from "@/utils/constants";
import { userSignupThunk } from "@/store/features/auth/authThunk";
import { signupFormSchema } from "@/utils/formSchema";
import { sanitizeInputs } from "@/utils";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import InputPassword from "@/components/input-password/InputPassword";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// Types
import { SignupPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps } from "@/types";

type SignupFormProps = {
  resources: SignupPageResourcesProps;
  locale: string;
};

type SignupFormInputsProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  termsConfirmation?: boolean | undefined;
  ageConfirmation?: boolean | undefined;
  privacyConfirmation?: boolean | undefined;
  marketingConfirmation?: boolean | undefined;
  orderNotificationConfirmation?: boolean | undefined;
  // dateOfBirth: string;
  // gender: string;
};

export default function SignupForm(props: SignupFormProps) {
  const { resources, locale } = props;

  const router = useRouter();
  const searchQuery = useSearchParams();
  const redirect = searchQuery?.get(fixedKeywords.redirectTo);

  const {
    Data: {
      PhoneRegex,
      EnableTermsConfirmation,
      EnableAgeConfirmation,
      EnablePrivacyPolicyConfirmation,
      EnableMarketingConfirmation,
      EnableOrderNotificationConfirmation,
      CountryPhoneCode,
    },
    FlagURL,
  } = useData();

  const defaultValues: SignupFormInputsProps = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: CountryPhoneCode,
    termsConfirmation: EnableTermsConfirmation ? undefined : false,
    ageConfirmation: EnableAgeConfirmation ? undefined : false,
    privacyConfirmation: EnablePrivacyPolicyConfirmation ? undefined : false,
    marketingConfirmation: false,
    orderNotificationConfirmation: false,
    // dateOfBirth: "",
    // gender: "",
  };

  const dispatch = useAppDispatch();

  // Captcha
  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");

  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };

  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);
  const handleCaptchaRef = (e: any) => {
    setCaptchaRef(e);
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await signupFormSchema(resources, PhoneRegex, {
        EnableTermsConfirmation,
        EnableAgeConfirmation,
        EnablePrivacyPolicyConfirmation,
      });

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const phoneValue = form.watch("phone");

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("phone", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const handleSignupSubmit = async (values: SignupFormInputsProps) => {
    const valuesWithoutHack = sanitizeInputs(values, [
      "termsConfirmation",
      "ageConfirmation",
      "privacyConfirmation",
      "marketingConfirmation",
      "orderNotificationConfirmation",
    ]);

    if (!captcha) return setCaptchaError(resources["captchaRequired"]);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));
    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      const formData = {
        locale,
        ReCaptchaToken: captcha,
        FirstName: valuesWithoutHack.firstName,
        LastName: valuesWithoutHack.lastName,
        Phone: valuesWithoutHack.phone,
        Email: valuesWithoutHack.email,
        Password: valuesWithoutHack.password,
        ...(EnableMarketingConfirmation
          ? { IsSubscribedMarketing: valuesWithoutHack.marketingConfirmation }
          : {}),
        ...(EnableOrderNotificationConfirmation
          ? {
            IsSubscribedNotification:
              valuesWithoutHack.orderNotificationConfirmation,
          }
          : {}),
      };

      const response = await dispatch(userSignupThunk(formData)).unwrap();

      if (response?.hasError) {
        setCaptcha("");
        captchaRef?.reset();

        dispatch(toggleModal({ loadingModal: { isOpen: false } }));

        return response?.errors?.forEach((item: any) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      // Facebook pixels
      !!window?.fbq &&
        fbq("track", "CompleteRegistration", {
          content_name: "User Registration",
          user_data: {
            first_name: valuesWithoutHack?.firstName,
            last_name: valuesWithoutHack?.lastName,
            email: valuesWithoutHack?.email,
            phone: valuesWithoutHack?.phone,
          },
        });

      // Tiktok pixels
      !!window?.ttq &&
        ttq?.track("CompleteRegistration", {
          content_name: "User Registration",
          content_type: "product",
          email: valuesWithoutHack?.email,
          phone_number: valuesWithoutHack?.phone,
          external_id: valuesWithoutHack?.email || valuesWithoutHack?.phone,
        });

      // Google events
      !!window?.gtag &&
        window?.gtag("event", "sign_up", {
          method: "website",
          items: [
            {
              item_id: valuesWithoutHack?.email || valuesWithoutHack?.phone,
              item_name: "User Registration",
              item_category: "Account",
            },
          ],
          user_properties: {
            first_name: valuesWithoutHack?.firstName,
            last_name: valuesWithoutHack?.lastName,
            email: valuesWithoutHack?.email,
            phone_number: valuesWithoutHack?.phone,
          },
        });

      // Snapchat pixels
      !!window?.snaptr &&
        snaptr("track", "SIGN_UP", {
          content_name: "User Registration",
          user_data: {
            first_name: valuesWithoutHack?.firstName,
            last_name: valuesWithoutHack?.lastName,
            email: valuesWithoutHack?.email,
            phone: valuesWithoutHack?.phone,
          },
        });

      if (redirect) {
        location.replace(redirect);
      } else {
        location.replace(LOGIN_REDIRECT);
      }
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(handleSignupSubmit)}
        noValidate
        autoComplete="off"
      >
        <div className="max-h-[60vh] overflow-auto px-1 py-2">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="firstName"
                        label={resources["firstName"]}
                        startIcon={
                          <UserIcon
                            className={defaultStartInputIconClassNames()}
                          />
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="lastName"
                        label={resources["lastName"]}
                        startIcon={
                          <UserIcon
                            className={defaultStartInputIconClassNames()}
                          />
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="email"
                        type="email"
                        label={resources["email"]}
                        startIcon={
                          <EnvelopeIcon
                            className={defaultStartInputIconClassNames()}
                          />
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <FormField
                control={form.control}
                name="phone"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="phone"
                        type="tel"
                        label={resources["phone"]}
                        startIcon={
                          <span className={defaultStartInputIconClassNames()}>
                            {FlagURL?.trim() && (
                              <img
                                src={FlagURL?.trim()}
                                alt="flag"
                                width={24}
                                height={24}
                                loading="lazy"
                                className="size-6 max-w-full shrink-0 object-contain"
                              />
                            )}
                          </span>
                        }
                        value={value}
                        onChange={(e) => {
                          onChange(
                            new AsYouType()
                              .input(e.target.value)
                              .replace(/\s+/g, ""),
                          );
                        }}
                        {...rest}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="relative col-span-full">
              <InputPassword
                form={form}
                name="password"
                id="password"
                label={resources["password"]}
                showStrength={true}
                showValidationRules={true}
              />
            </div>

            {/* <div className="col-span-2 sm:col-span-1">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="dateOfBirth"
                        type="date"
                        label={resources["dateOfBirth"]}
                        startIcon={
                          <CalendarIcon
                            className={defaultStartInputIconClassNames()}
                          />
                        }
                        min={minBirthDate.toISOString().split("T")[0]}
                        max={today.toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            {/* <div className="col-span-1">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="relative w-full">
                          <UserIcon
                            className={defaultStartInputIconClassNames()}
                          />
                          <SelectValue
                            placeholder={resources["selectGender"]}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">
                              {resources["male"]}
                            </SelectItem>
                            <SelectItem value="female">
                              {resources["female"]}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>

          <div className="mb-4">
            {EnableTermsConfirmation && (
              <div className="mb-2 w-fit">
                <FormField
                  control={form.control}
                  name="termsConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {resources["termsConfirmation"]}{" "}
                          <a
                            href="/terms"
                            className="smooth text-alt hover:text-inherit"
                          >
                            {resources["termsConditions"]}
                          </a>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {EnableAgeConfirmation && (
              <div className="mb-2 w-fit">
                <FormField
                  control={form.control}
                  name="ageConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{resources["ageConfirmation"]}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {EnablePrivacyPolicyConfirmation && (
              <div className="mb-2 w-fit">
                <FormField
                  control={form.control}
                  name="privacyConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {resources["privacyConfirmation"]}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {EnableMarketingConfirmation && (
              <div className="mb-2 w-fit">
                <FormField
                  control={form.control}
                  name="marketingConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {resources["marketingConfirmation"]}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {EnableOrderNotificationConfirmation && (
              <div className="mb-2 w-fit">
                <FormField
                  control={form.control}
                  name="orderNotificationConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {resources["orderNotificationConfirmation"]}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <ReCAPTCHA
            ref={handleCaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_CLIENT_KEY!}
            onChange={handleCaptchaChange}
          />
          {captchaError && (
            <p className="block text-sm text-alt">{captchaError}</p>
          )}
        </div>

        <div className="flex-center mb-4 gap-3 text-center text-sm">
          <a href="/terms" className="smooth hover:text-main">
            {resources["termsConditions"]}
          </a>
          |
          <a href="/privacy" className="smooth hover:text-main">
            {resources["privacyPolicy"]}
          </a>
        </div>

        <div className="flex w-full flex-col gap-2 p-1">
          <Button type="submit" className="w-full">
            {resources["signUp"]}
          </Button>

          <Button
            type="button"
            variant="light"
            className="w-full"
            onClick={() =>
              redirect
                ? router.replace(
                  `/login?${fixedKeywords.redirectTo}=${redirect}`,
                  { scroll: false },
                )
                : router.replace("/login", { scroll: false })
            }
          >
            {resources["alreadyHaveAccount"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
