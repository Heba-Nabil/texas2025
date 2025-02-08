"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import { AsYouType } from "libphonenumber-js";
import { checkoutGuestInfoFormSchema } from "@/utils/formSchema";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { setServerCookie } from "@/server/actions/serverCookie";
import { mutatePath } from "@/server/actions";
import { elementsIds, GUEST_DATA } from "@/utils/constants";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { sanitizeInputs } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { updateUserProfileThunk } from "@/store/features/auth/authThunk";
import { toggleModal } from "@/store/features/global/globalSlice";
// Types
import { UserSessionDataProps } from "@/types";
import { ProfileDataProps } from "@/types/api";

type CheckoutGuestInfoModalProps = {
  open: boolean;
  // personalInfo?: UserSessionDataProps;
  guestData?: UserSessionDataProps;
  userData?: ProfileDataProps | null;
  handleClose: () => void;
  setGuestInfo: React.Dispatch<
    React.SetStateAction<UserSessionDataProps | undefined>
  >;
};

export default function CheckoutGuestInfoModal(
  props: CheckoutGuestInfoModalProps,
) {
  const { open, guestData, userData, setGuestInfo, handleClose } = props;

  const t = useTranslations();
  const locale = useLocale();

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    FlagURL,
  } = useData();

  const dispatch = useAppDispatch();

  const schemaRresources = {
    requiredFirstName: t("requiredFirstName"),
    maxLength: t("maxLength"),
    character: t("character"),
    requiredLastName: t("requiredLastName"),
    specialCharactersNotAllowed: t("specialCharactersNotAllowed"),
    requiredEmail: t("requiredEmail"),
    emailNotValid: t("emailNotValid"),
    requiredPhone: t("requiredPhone"),
    phoneValidate: t("phoneValidate"),
    alreadyHaveAccount: t("alreadyHaveAccount"),
    canOnlyContainLettersOrComma: t("canOnlyContainLettersOrComma"),
  };

  const defaultValues: UserSessionDataProps = {
    firstName: (userData ? userData?.FirstName : guestData?.firstName) || "",
    lastName: (userData ? userData?.LastName : guestData?.lastName) || "",
    email: (userData ? userData?.Email : guestData?.email) || "",
    phone: (userData ? userData?.Phone : guestData?.phone) || CountryPhoneCode,
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await checkoutGuestInfoFormSchema({
        resources: schemaRresources,
        PhoneRegex,
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

  const handleFormSubmit = async (values: UserSessionDataProps) => {
    const valuesWithoutHack = sanitizeInputs(values);

    const userInfoBody = {
      firstName: valuesWithoutHack?.firstName,
      lastName: valuesWithoutHack?.lastName,
      email: userData ? userData?.Email : valuesWithoutHack?.email,
      phone: valuesWithoutHack?.phone,
    };

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      if (userData) {
        const formData = {
          locale,
          FirstName: userInfoBody.firstName,
          LastName: userInfoBody.lastName,
          Phone: userInfoBody.phone,
          Email: userInfoBody.email,
          IsSubscribedMarketing: userData?.IsSubscribedMarketing,
          IsSubscribedNotification: userData?.IsSubscribedNotification,
        };

        const toaster = (await import("@/components/global/Toaster")).toaster;

        const response = await dispatch(
          updateUserProfileThunk(formData),
        ).unwrap();

        if (response?.hasError) {
          form.reset();

          return response?.errors?.forEach((item: any) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }

        toaster.success({
          message: t("userDetailsUpdatedSuccess"),
        });

        await mutatePath("/checkout");
      } else {
        await setServerCookie([
          {
            name: GUEST_DATA,
            value: JSON.stringify(userInfoBody),
            expiration: new Date(Date.now() + 1 * 60 * 60 * 1000),
          },
        ]);

        setGuestInfo(userInfoBody);
      }

      handleClose();
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader
          showCloseBtn={Boolean(userData || guestData)}
          title={
            Boolean(userData || guestData)
              ? t("updateYourInfo")
              : t("completeYourInfo")
          }
        />

        <DialogContentWrapper>
          <DialogDescription className="sr-only">
            {Boolean(userData || guestData)
              ? t("updateYourInfo")
              : t("completeYourInfo")}
          </DialogDescription>
          {/* 
          <LoginReminder
            resources={{
              alreadyHaveAccount: t("alreadyHaveAccount"),
              logIn: t("logIn"),
            }}
            cb={handleClose}
          /> */}

          <Form {...form}>
            <form
              className="mt-5 w-full space-y-5"
              id={elementsIds.checkoutGuestInfoForm}
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
                          disabled={!!userData}
                          readOnly={!!userData}
                          aria-disabled={!!userData}
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
            </form>
          </Form>
        </DialogContentWrapper>

        <DialogFooter>
          {Boolean(userData || guestData) ? (
            <>
              <Button
                type="button"
                variant="light"
                className="flex-1"
                onClick={handleClose}
              >
                {t("cancel")}
              </Button>

              <Button
                type="submit"
                className="flex-1"
                form={elementsIds.checkoutGuestInfoForm}
                disabled={!form.formState.isDirty}
              >
                {t("update")}
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              className="flex-1"
              form={elementsIds.checkoutGuestInfoForm}
            >
              {t("continue")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
