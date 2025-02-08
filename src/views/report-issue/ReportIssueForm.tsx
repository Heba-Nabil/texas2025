"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { reportIssueFormSchema } from "@/utils/formSchema";
import { clientSideFetch, formatDateTo24HourISO } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelTextArea } from "@/components/ui/floating-label-textarea";
import { Button } from "@/components/ui/button";
// Types
import { ReportIssuePageResourcesProps } from "@/types/resources";
import { CaptchaRefProps, GenericResponse } from "@/types";

type ReportIssueFormProps = {
  resources: ReportIssuePageResourcesProps;
  locale: string;
};

type ReportIssueFormInputsProps = {
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  issueTitle: string;
  details: string;
};

export default function ReportIssueForm(props: ReportIssueFormProps) {
  const { locale, resources } = props;

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    FlagURL,
  } = useData();

  const defaultValues: ReportIssueFormInputsProps = {
    FirstName: "",
    LastName: "",
    email: "",
    phone: CountryPhoneCode,
    issueTitle: "",
    details: "",
  };

  const dispatch = useAppDispatch();

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

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await reportIssueFormSchema(resources, PhoneRegex);

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

  const handleFormSubmit = async (values: ReportIssueFormInputsProps) => {
    if (!captcha) {
      setCaptchaError(resources["captchaRequired"]);
      return;
    }

    const date = formatDateTo24HourISO(new Date());

    const editedFormValues = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Email: values.email,
      Phone: values.phone,
      RequestDateTime: date,
      Subject: `Report an issue - ${values.issueTitle} `,
      Message: values.details,
    };

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const formData = new FormData();

      formData.append("FormData", JSON.stringify(editedFormValues));

      const response = await clientSideFetch<GenericResponse<string>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}/${routeHandlersKeys.contactUs}`,
        {
          method: "POST",
          body: formData,
          headers: {
            RecaptchaToken: captcha,
          },
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

      toaster.success({ message: resources["submittedSuccess"] });

      form.reset();
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
        autoComplete="off"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="email"
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="phone"
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

        {/* {Number(selectedIssue) === issuesOptions.pop().id && ( */}
        <div className="mb-4">
          <FormField
            control={form.control}
            name="issueTitle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="issueTitle"
                    label={resources["issueTitle"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* )} */}

        <div className="mb-4">
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelTextArea
                    className="h-20"
                    id="details"
                    label={resources["details"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button type="submit" className="flex-grow">
            {resources["submit"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
