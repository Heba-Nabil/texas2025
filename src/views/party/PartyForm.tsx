"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import {
  InquiryType,
  MeatPreference,
  routeHandlersKeys,
} from "@/utils/constants";
import { partyFormSchema } from "@/utils/formSchema";
import { clientSideFetch, findById } from "@/utils";
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
import { PartyPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps, GenericResponse } from "@/types";

type PartyFormProps = {
  resources: PartyPageResourcesProps;
  locale: string;
};

type PartyFormInputsProps = {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  InquiryDate: string;
  InquiryTime: string;
  Notes: string;
  CityID: string;
  BranchID: string;
  kindofparty: string;
  MeatPreference: string;
  Numberofchickenpieces: number;
};

export default function PartyForm(props: PartyFormProps) {
  const { locale, resources } = props;

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    Cities,
    Stores,
    FlagURL,
  } = useData();

  const defaultValues: PartyFormInputsProps = {
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: CountryPhoneCode,
    InquiryDate: "",
    InquiryTime: "",
    Notes: "",
    CityID: "",
    BranchID: "",
    kindofparty: "",
    MeatPreference: "",
    Numberofchickenpieces: 0,
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

  const InquiryTypeOptions = Object.entries(InquiryType).map(
    ([key, value]) => ({
      id: key,
      title: value,
    }),
  );

  const MeatPreferenceOptions = Object.entries(MeatPreference).map(
    ([key, value]) => ({
      id: key,
      title: value,
    }),
  );

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await partyFormSchema(resources, PhoneRegex);

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

  const availableBranches = selectedCity
    ? Stores?.filter((item) => item?.CityID === selectedCity?.ID)
    : [];

  const handleFormSubmit = async (values: PartyFormInputsProps) => {
    if (!captcha) {
      setCaptchaError(resources["captchaRequired"]);
      return;
    }

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
        `${process.env.NEXT_PUBLIC_API}/${locale}/${routeHandlersKeys.submitParty}`,
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
        className="mb-3 w-full"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        noValidate
      >
        <div className="mb-6 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="w-full">
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

          <div className="w-full">
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

          <div className="w-full">
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

          <div className="w-full">
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

          <div className="w-full">
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

          <div className="w-full">
            <FormField
              control={form.control}
              name="BranchID"
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
                        <SelectValue placeholder={resources["selectBranch"]} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {availableBranches?.map((item) => (
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
              name="InquiryDate"
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
              name="InquiryTime"
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

          <div className="w-full">
            <FormField
              control={form.control}
              name="kindofparty"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["Inquiry"]} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {InquiryTypeOptions?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {resources[item?.title as keyof typeof resources]}
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
              name="MeatPreference"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <SelectTrigger className="relative w-full">
                        <SelectValue
                          placeholder={resources["meatPreference"]}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {MeatPreferenceOptions?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {resources[item?.title as keyof typeof resources]}
                          </SelectItem>
                        ))}
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
              name="Numberofchickenpieces"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Numberofchickenpieces"
                      type="number"
                      label={resources["Numberofchickenpieces"]}
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
              name="Notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Notes"
                      label={resources["subject"]}
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
            {resources["send"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
