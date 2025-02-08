"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { clientSideFetch, findById, findModuleItem } from "@/utils";
import { contactUsFormSchema } from "@/utils/formSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingLabelTextArea } from "@/components/ui/floating-label-textarea";
import { Button } from "@/components/ui/button";
import Dropzone from "@/components/global/DropZone";
// Types
import { ContactPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps, GenericResponse } from "@/types";

type ContactFormProps = {
  resources: ContactPageResourcesProps;
  locale: string;
};

export type ContactUsFormInputsProps = {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Date: string;
  Time: string;
  Subject: string;
  Message: string;
  CityID: string;
  StoreID: string;
  files?: File[];
};

export default function ContactForm(props: ContactFormProps) {
  const { locale, resources } = props;

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    Module,
    Cities,
    Stores,
    FlagURL,
  } = useData();

  const defaultValues: ContactUsFormInputsProps = {
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: CountryPhoneCode,
    Date: "",
    Time: "",
    Subject: "",
    Message: "",
    CityID: "",
    StoreID: "",
    files: [],
  };

  const dispatch = useAppDispatch();

  const contactArea = findModuleItem(
    Module,
    "ContactUS_FilterlocationByState",
  )?.Status;

  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [fileRejections, setFileRejections] = useState<string[]>([]);

  const handleCaptchaRef = (e: any) => {
    setCaptchaRef(e);
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await contactUsFormSchema(resources, PhoneRegex, {
        contactArea,
      });

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const [watchCity, phoneValue] = form.watch(["CityID", "Phone"]);

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("Phone", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const selectedCity = useMemo(() => {
    return watchCity ? findById(Cities, watchCity) : null;
  }, [Cities, watchCity]);

  const availableStores = selectedCity
    ? Stores?.filter((item) => item?.CityID === selectedCity?.ID)
    : [];

  const handleFormSubmit = async (values: ContactUsFormInputsProps) => {
    if (!captcha) {
      setCaptchaError(resources["captchaRequired"]);
      return;
    }

    // if the dropzone selected file and have errors do not submit the rest the form until the file is valid
    if (fileRejections.length > 0) {
      return;
    }

    const toaster = (await import("@/components/global/Toaster")).toaster;

    const editedFormValues = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Email: values.Email,
      Phone: values.Phone,
      RequestDateTime: `${values.Date}T${values.Time}`,
      Subject: values.Subject,
      Message: values.Message,
      CityID: values.CityID,
      StoreID: values.StoreID,
    };

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const formData = new FormData();
      formData.append("FormData", JSON.stringify(editedFormValues));

      if (acceptedFiles && acceptedFiles.length > 0) {
        acceptedFiles.forEach((file) => {
          formData.append("Codes", file);
        });
      }

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

      // Facebook pixels
      !!window.fbq &&
        fbq("track", "Contact", {
          content_name: "User Contact",
          user_data: {
            name: editedFormValues?.FirstName,
            email: editedFormValues?.Email,
            phone: editedFormValues?.Phone,
            subject: editedFormValues?.Subject,
            message: editedFormValues?.Message,
          },
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("Contact", {
          content_name: "User Contact",
          content_type: "product",
          name: editedFormValues?.FirstName,
          email: editedFormValues?.Email,
          phone: editedFormValues?.Phone,
          subject: editedFormValues?.Subject,
          message: editedFormValues?.Message,
          external_id: editedFormValues?.Email || editedFormValues?.Phone,
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "working_lead", {
          items: [
            {
              item_id: editedFormValues?.Email || editedFormValues?.Phone,
              item_name: "User contact",
              item_category: "Account",
            },
          ],
          user_properties: {
            name: editedFormValues?.FirstName,
            email: editedFormValues?.Email,
            phone: editedFormValues?.Phone,
            subject: editedFormValues?.Subject,
            message: editedFormValues?.Message,
          },
        });

      // Snapchat pixels
      !!window.snaptr &&
        snaptr("track", "CUSTOM_EVENT_1", {
          user_name: editedFormValues?.FirstName,
          user_email: editedFormValues?.Email,
          user_phone: editedFormValues?.Phone,
          subject: editedFormValues?.Subject,
          message: editedFormValues?.Message,
        });

      toaster.success({ message: resources["submittedSuccess"] });

      form.reset();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);
    } finally {
      setCaptcha("");
      captchaRef?.reset();

      setAcceptedFiles([]);
      setFileRejections([]);

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
            name="Phone"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="userPhone"
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

        {contactArea && (
          <>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="CityID"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
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

            <div className="mb-4">
              <FormField
                control={form.control}
                name="StoreID"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <Select
                      value={field.value}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      disabled={!selectedCity}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={resources["selectBranch"]}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {availableStores?.map((item) => (
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
          </>
        )}

        <div className="mb-4">
          <FormField
            control={form.control}
            name="Date"
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

        <div className="mb-4">
          <FormField
            control={form.control}
            name="Time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label={resources["theTime"]}
                    type="time"
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
            name="Subject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="subject"
                    label={resources["subject"]}
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
            name="Message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelTextArea
                    id="Message"
                    label={resources["message"]}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-6 pt-4">
          <Dropzone
            fileRejections={fileRejections}
            setFileRejections={setFileRejections}
            setAcceptedFiles={setAcceptedFiles}
            acceptedFiles={acceptedFiles}
            resources={resources}
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
