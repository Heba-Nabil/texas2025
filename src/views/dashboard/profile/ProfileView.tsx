"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import { AsYouType } from "libphonenumber-js";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { updateUserProfileThunk } from "@/store/features/auth/authThunk";
import { useData } from "@/providers/DataProvider";
import { updateProfileFormSchema } from "@/utils/formSchema";
import { sanitizeInputs } from "@/utils";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { mutatePath } from "@/server/actions";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
// Types
import { ProfilePageResourcesProps } from "@/types/resources";
import { ProfileDataProps } from "@/types/api";

type ProfileViewProps = {
  resources: ProfilePageResourcesProps;
  data?: ProfileDataProps | null;
  locale: string;
};

type UpdateProfileInputsProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  marketingConfirmation?: boolean | undefined;
  orderNotificationConfirmation?: boolean | undefined;
};

export default function ProfileView(props: ProfileViewProps) {
  const { resources, data, locale } = props;

  const dispatch = useAppDispatch();

  const {
    Data: {
      PhoneRegex,
      EnableMarketingConfirmation,
      EnableOrderNotificationConfirmation,
      CountryPhoneCode,
    },
    FlagURL,
  } = useData();

  const defaultValues: UpdateProfileInputsProps = {
    firstName: data?.FirstName ? data?.FirstName : "",
    lastName: data?.LastName ? data?.LastName : "",
    email: data?.Email ? data?.Email : "",
    phone: data?.Phone ? data?.Phone : CountryPhoneCode,
    marketingConfirmation: EnableMarketingConfirmation
      ? !!data?.IsSubscribedMarketing
      : false,
    orderNotificationConfirmation: EnableOrderNotificationConfirmation
      ? !!data?.IsSubscribedNotification
      : false,
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await updateProfileFormSchema(resources, PhoneRegex);

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

  const handleFormSubmit = async (values: UpdateProfileInputsProps) => {
    const valuesWithoutHack = sanitizeInputs(values, [
      "marketingConfirmation",
      "orderNotificationConfirmation",
    ]);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const formData = {
        locale,
        FirstName: valuesWithoutHack.firstName,
        LastName: valuesWithoutHack.lastName,
        Phone: valuesWithoutHack.phone,
        Email: valuesWithoutHack.email,
        IsSubscribedMarketing: EnableMarketingConfirmation
          ? valuesWithoutHack.marketingConfirmation
          : null,
        IsSubscribedNotification: EnableOrderNotificationConfirmation
          ? valuesWithoutHack.orderNotificationConfirmation
          : null,

        // ...(EnableMarketingConfirmation
        //   ? { IsSubscribedMarketing: valuesWithoutHack.marketingConfirmation }
        //   : {}),
        // ...(EnableOrderNotificationConfirmation
        //   ? {
        //       IsSubscribedNotification:
        //         valuesWithoutHack.orderNotificationConfirmation,
        //     }
        //   : {}),
      };

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
      // Reset the form with the last successful update
      form.reset({
        firstName: valuesWithoutHack.firstName,
        lastName: valuesWithoutHack.lastName,
        email: valuesWithoutHack.email,
        phone: valuesWithoutHack.phone,
        marketingConfirmation: valuesWithoutHack.marketingConfirmation,
        orderNotificationConfirmation:
          valuesWithoutHack.orderNotificationConfirmation,
      });

      toaster.success({
        message: resources["userDetailsUpdatedSuccess"],
      });

      mutatePath("/dashboard/profile");
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  if (!data) return null;

  return (
    <DashBoardPagesWrapper label={resources["updateYourDetails"]}>
      <Form {...form}>
        <form
          className="mt-5 w-full space-y-5 overflow-y-auto px-5 py-1"
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

          <div>
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
                      label={resources["email"]}
                      startIcon={
                        <EnvelopeIcon
                          className={defaultStartInputIconClassNames()}
                        />
                      }
                      disabled={true}
                      aria-disabled={true}
                      readOnly={true}
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
                      label={resources["phone"]}
                      dir="ltr"
                      className="ltr:ps-10 rtl:pe-10 rtl:text-right"
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

          {EnableMarketingConfirmation && (
            <div>
              <FormField
                control={form.control}
                name="marketingConfirmation"
                render={({ field }) => (
                  <FormItem className="flex-between gap-3 space-y-0">
                    <div className="flex flex-grow items-center gap-3">
                      <img
                        src="/images/icons/market-communication.svg"
                        alt="market communication"
                        width="24"
                        height="24"
                        className="h-6 w-6 shrink-0 object-contain"
                        loading="lazy"
                      />

                      <div className="flex-grow">
                        <FormLabel className="smooth font-bold capitalize hover:text-main">
                          {resources["markettingCommun"]}
                        </FormLabel>
                        <FormDescription>
                          {resources["markettingCommunDesc"]}
                        </FormDescription>
                      </div>
                    </div>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {EnableOrderNotificationConfirmation && (
            <div>
              <FormField
                control={form.control}
                name="orderNotificationConfirmation"
                render={({ field }) => (
                  <FormItem className="flex-between gap-3 space-y-0">
                    <div className="flex flex-grow items-center gap-3">
                      <img
                        src="/images/icons/mobile-app.svg"
                        alt="market communication"
                        width="24"
                        height="24"
                        className="h-6 w-6 shrink-0 object-contain"
                        loading="lazy"
                      />

                      <div className="flex-grow">
                        <FormLabel className="smooth font-bold capitalize hover:text-main">
                          {resources["appCommun"]}
                        </FormLabel>
                        <FormDescription>
                          {resources["appCommunDesc"]}
                        </FormDescription>
                      </div>
                    </div>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="light"
              className="min-w-[120px] max-sm:flex-1"
              disabled={!form.formState.isDirty}
              onClick={() => form.reset()}
            >
              {resources["cancel"]}
            </Button>

            <Button
              type="submit"
              className="min-w-[120px] max-sm:flex-1"
              disabled={!form.formState.isDirty}
            >
              {resources["saveUpdates"]}
            </Button>
          </div>
        </form>
      </Form>
    </DashBoardPagesWrapper>
  );
}
