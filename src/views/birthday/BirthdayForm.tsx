"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { birthdayPackageFormSchema } from "@/utils/formSchema";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Types
import { BirthdayPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps, GenericResponse } from "@/types";
import { Gender } from "@/types/enums";

type BirthdayFormProps = {
  locale: string;
  resources: BirthdayPageResourcesProps;
};

type BirthdayFormInputsProps = {
  Name: string;
  Email: string;
  ContactNumber: string;
  Age: number | undefined;
  City: string;
  BirthdayDate: string;
  NumberofInvitees: number | undefined;
  Gender: string;
};

export default function BirthdayForm(props: BirthdayFormProps) {
  const { resources, locale } = props;

  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");

  const handleCaptchaRef = (e: any) => {
    setCaptchaRef(e);
  };
  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };
  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    Cities,
    FlagURL,
  } = useData();

  const defaultValues: BirthdayFormInputsProps = {
    Name: "",
    Email: "",
    ContactNumber: CountryPhoneCode,
    Age: 0,
    City: "",
    BirthdayDate: "",
    NumberofInvitees: 0,
    Gender: "",
  };

  const dispatch = useAppDispatch();

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await birthdayPackageFormSchema(resources, PhoneRegex);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const phoneValue = form.watch("ContactNumber");

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("ContactNumber", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const handleFormSubmit = async (values: BirthdayFormInputsProps) => {
    if (!captcha) return setCaptchaError(resources["captchaRequired"]);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await clientSideFetch<GenericResponse<string>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}/${routeHandlersKeys.submitBirthdayPackage}`,
        {
          method: "POST",
          body: formData,
          headers: {
            RecaptchaToken: captcha,
          },
        },
      );

      setCaptcha("");
      captchaRef?.reset();

      if (response?.hasError) {
        return response?.errors?.forEach((item: any) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      toaster.success({ message: resources["submittedSuccess"] });

      form.reset();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);

      setCaptcha("");
      captchaRef?.reset();
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        noValidate
      >
        <div className="mb-5 grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="w-full">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Name"
                      label={resources["fullName"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Email"
                      type="email"
                      label={resources["email"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="ContactNumber"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="ContactNumber"
                      type="tel"
                      label={resources["phonePlaceholder"]}
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

          <div className="w-full">
            <FormField
              control={form.control}
              name="Age"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Age"
                      type="number"
                      label={resources["age"]}
                      min={1}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="Gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <SelectTrigger className="relative w-full">
                        <SelectValue placeholder={resources["selectGender"]} />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value={`${Gender.Male}`}>
                          {resources["male"]}
                        </SelectItem>
                        <SelectItem value={`${Gender.Female}`}>
                          {resources["female"]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="BirthdayDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label={resources["date"]}
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="City"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["selectCity"]} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Cities?.map((item) => (
                        <SelectItem key={item.ID} value={item.ID}>
                          {item.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="NumberofInvitees"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="NumberofInvitees"
                      type="number"
                      label={resources["invitees"]}
                      min={0}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="submit" className="w-full md:w-1/4">
            {resources["sendMessage"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
