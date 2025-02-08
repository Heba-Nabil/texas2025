"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveAs } from "file-saver";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { privacyRequestFormSchema } from "@/utils/formSchema";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { clearServerCookie } from "@/server/actions/clearCookies";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// Types
import { PrivacyRequestPageeResourcesProps } from "@/types/resources";
import { PrivacyRequestType } from "@/types/enums";
import { CaptchaRefProps, GenericResponse } from "@/types";
import { PrivacyRequestResponseType } from "@/types/api";

type PrivacyRequestFormProps = {
  resources: PrivacyRequestPageeResourcesProps;
  locale: string;
};

type PrivacyRequestFormInputsProps = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Phone: string;
  ResidencyDetails: string;
  RequestTypeID: string;
};

export default function PrivacyRequestForm(props: PrivacyRequestFormProps) {
  const { locale, resources } = props;

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    FlagURL,
  } = useData();

  const defaultValues: PrivacyRequestFormInputsProps = {
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Phone: CountryPhoneCode,
    ResidencyDetails: "",
    RequestTypeID: "",
  };

  const requestOptions = [
    {
      id: PrivacyRequestType.DoNotSellMyData.toString(),
      title: resources["dontSellData"],
    },
    {
      id: PrivacyRequestType.ReceiveACopyOfMyData.toString(),
      title: resources["receiveCopy"],
    },
    {
      id: PrivacyRequestType.DeleteData.toString(),
      title: resources["deleteData"],
    },
    {
      id: PrivacyRequestType.CorrectMyData.toString(),
      title: resources["correctData"],
    },
    {
      id: PrivacyRequestType.AccessMyData.toString(),
      title: resources["accessData"],
    },
  ];

  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);

  const handleCaptchaRef = (e: any) => {
    setCaptchaRef(e);
  };
  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };

  const dispatch = useAppDispatch();

  const { isUser } = useAppSelector(getClientSession);

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await privacyRequestFormSchema(resources, PhoneRegex);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const [watchRequestOptions, phoneValue] = form.watch([
    "RequestTypeID",
    "Phone",
  ]);

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("Phone", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const handleFormSubmit = async (values: PrivacyRequestFormInputsProps) => {
    if (!captcha) return setCaptchaError(resources["captchaRequired"]);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await clientSideFetch<
        GenericResponse<string | PrivacyRequestResponseType>
      >(
        `${process.env.NEXT_PUBLIC_API}/${locale}/${routeHandlersKeys.privacyRequest}`,
        {
          method: "POST",
          body: JSON.stringify({ ...values, ReCaptchaToken: captcha }),
        },
      );

      if (response?.hasError) {
        return response?.errors?.forEach((item: any) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      if (response?.data === "OK") {
        toaster.success({ message: resources["submittedSuccess"] });
      } else {
        const { FileData, FileName } =
          response?.data as PrivacyRequestResponseType;

        const blob = new Blob([FileData], { type: "text/plain" });

        saveAs(blob, FileName);
      }

      form.reset();

      if (
        values.RequestTypeID === PrivacyRequestType.DeleteData.toString() &&
        isUser
      ) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);
      }
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);

      setCaptcha("");
      captchaRef?.reset();
    } finally {
      setCaptcha("");
      captchaRef?.reset();

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
        <div className="mb-4">
          <FormField
            control={form.control}
            name="FirstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="FirstName"
                    label={resources["firstName"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4">
          <FormField
            control={form.control}
            name="LastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="LastName"
                    label={resources["lastName"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
          <InputPassword
            form={form}
            name="Password"
            id="Password"
            label={resources["password"]}
          />
        </div>

        <div className="mb-4">
          <FormField
            control={form.control}
            name="Phone"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="Phone"
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

        <div className="mb-4">
          <FormField
            control={form.control}
            name="ResidencyDetails"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="ResidencyDetails"
                    label={resources["residencyDetails"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-7">
          <FormField
            control={form.control}
            name="RequestTypeID"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>{resources["selectdataOption"]}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue
                        placeholder={resources["selectdataOption"]}
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {requestOptions?.map((item) => (
                      <SelectItem
                        className="capitalize"
                        key={item.id}
                        value={item.id}
                      >
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {(watchRequestOptions ===
            PrivacyRequestType.AccessMyData.toString() ||
            watchRequestOptions ===
              PrivacyRequestType.ReceiveACopyOfMyData.toString()) && (
            <p className="mt-3 block text-sm text-destructive">
              {resources["aFileWillBeDownloaded"]}
            </p>
          )}
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

        <div className="flex">
          <Button type="submit" className="flex-grow">
            {resources["submit"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
