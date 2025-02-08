"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useRouter } from "@/navigation";
import { completeInfoFormSchema } from "@/utils/formSchema";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import {
  elementsIds,
  fixedKeywords,
  LOGIN_REDIRECT,
  routeHandlersKeys,
  THIRD_PARTY_INFO,
} from "@/utils/constants";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { clientSideFetch, sanitizeInputs } from "@/utils";
import { AuthenticationTypeIdEnum } from "@/types/enums";
import { deleteServerCookie } from "@/server/actions/serverCookie";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
// Types
import { CaptchaRefProps, GenericResponse } from "@/types";
import { ApplicationUserResponseProps } from "@/types/api";

type CompleteFormInputsProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  termsConfirmation?: boolean | undefined;
  ageConfirmation?: boolean | undefined;
  privacyConfirmation?: boolean | undefined;
  marketingConfirmation?: boolean | undefined;
  orderNotificationConfirmation?: boolean | undefined;
};

type CompleteInfoModalProps = {
  isOpen: boolean;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    typeId: AuthenticationTypeIdEnum;
    id: string;
  };
  image?: string;
};

export default function CompleteInfoModal(props: CompleteInfoModalProps) {
  const { isOpen, data, image } = props;

  const t = useTranslations();
  const locale = useLocale();

  const router = useRouter();

  const searchQuery = useSearchParams();
  const redirect = searchQuery?.get(fixedKeywords.redirectTo);

  const resources = {
    requiredFirstName: t("requiredFirstName"),
    firstNameNotValid: t("firstNameNotValid"),
    requiredLastName: t("requiredLastName"),
    lastNameNotValid: t("lastNameNotValid"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    character: t("character"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
    maxLength: t("maxLength"),
    termsConfirmation: t("termsConfirmation"),
    termsConditions: t("termsConditions"),
    ageConfirmation: t("ageConfirmation"),
    privacyConfirmation: t("privacyConfirmation"),
  };

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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const dispatch = useAppDispatch();

  const defaultValues: CompleteFormInputsProps = {
    firstName: data?.firstName ? data?.firstName : "",
    lastName: data?.lastName ? data?.lastName : "",
    email: data?.email ? data?.email : "",
    phone: data?.phone ? data?.phone : CountryPhoneCode,
    termsConfirmation: EnableTermsConfirmation ? undefined : false,
    ageConfirmation: EnableAgeConfirmation ? undefined : false,
    privacyConfirmation: EnablePrivacyPolicyConfirmation ? undefined : false,
    marketingConfirmation: false,
    orderNotificationConfirmation: false,
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await completeInfoFormSchema({
        resources,
        PhoneRegex,
        confirmationFields: {
          EnableTermsConfirmation,
          EnableAgeConfirmation,
          EnablePrivacyPolicyConfirmation,
        },
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

  const handleClose = () => {
    router.replace("/login", { scroll: false });
  };

  const handleCancel = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      await deleteServerCookie([THIRD_PARTY_INFO]);

      handleClose();
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleFormSubmit = async (values: any) => {
    const valuesWithoutHack = sanitizeInputs(values, [
      "termsConfirmation",
      "ageConfirmation",
      "privacyConfirmation",
      "marketingConfirmation",
      "orderNotificationConfirmation",
    ]);

    if (!data?.id || !data?.typeId) {
      console.log("Missing third party info");

      return;
    }

    if (!captcha) return setCaptchaError(t("captchaRequired"));

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const result = await clientSideFetch<
        Promise<GenericResponse<ApplicationUserResponseProps>>
      >(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.completeUserInfo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: valuesWithoutHack?.firstName,
            lastName: valuesWithoutHack?.lastName,
            email: valuesWithoutHack?.email,
            phone: valuesWithoutHack?.phone,
            ...(EnableMarketingConfirmation
              ? {
                  IsSubscribedMarketing:
                    valuesWithoutHack.marketingConfirmation,
                }
              : {}),
            ...(EnableOrderNotificationConfirmation
              ? {
                  IsSubscribedNotification:
                    valuesWithoutHack.orderNotificationConfirmation,
                }
              : {}),
            id: data?.id,
            type: data?.typeId,
            captcha,
            picture: image,
          }),
        },
      );

      if (result?.hasError) {
        setCaptcha("");
        captchaRef?.reset();

        dispatch(toggleModal({ loadingModal: { isOpen: false } }));

        return result?.errors?.forEach((item: any) =>
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
    <div className="fixed inset-0 z-[60] bg-black/60">
      <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
        <DialogContent className="z-[70]">
          <DialogHeader title={t("completeYourInfo")} />

          <DialogContentWrapper>
            <DialogDescription className="sr-only">
              {t("completeYourInfo")}
            </DialogDescription>

            <Form {...form}>
              <form
                className="w-full space-y-5"
                id={elementsIds.completeInfoFrom}
                onSubmit={form.handleSubmit(handleFormSubmit)}
                noValidate
              >
                <div>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="firstName"
                            type="text"
                            label={t("firstName")}
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

                <div>
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="lastName"
                            type="text"
                            label={t("lastName")}
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

                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="email"
                            type="email"
                            label={t("email")}
                            startIcon={
                              <EnvelopeIcon
                                className={defaultStartInputIconClassNames()}
                              />
                            }
                            disabled={!!data?.email}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field: { value, onChange, ...rest } }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingLabelInput
                            id="phone"
                            type="tel"
                            label={t("phone")}
                            startIcon={
                              <span
                                className={defaultStartInputIconClassNames()}
                              >
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
                              <FormLabel>
                                {resources["ageConfirmation"]}
                              </FormLabel>
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
                                {t("marketingConfirmation")}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {EnableOrderNotificationConfirmation && (
                    <div className="w-fit">
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
                                {t("orderNotificationConfirmation")}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-5 block">
                  <ReCAPTCHA
                    className="flex"
                    ref={handleCaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_CLIENT_KEY!}
                    onChange={handleCaptchaChange}
                  />
                  {captchaError && (
                    <p className="block text-sm text-alt">{captchaError}</p>
                  )}
                </div>
              </form>
            </Form>
          </DialogContentWrapper>

          <DialogFooter>
            <Button
              type="button"
              className="flex-1"
              variant="light"
              onClick={handleCancel}
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              className="flex-1"
              form={elementsIds.completeInfoFrom}
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
