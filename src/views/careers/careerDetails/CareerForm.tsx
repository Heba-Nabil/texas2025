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
  EducationLevel,
  jobType,
  preferedWorkLocation,
  routeHandlersKeys,
} from "@/utils/constants";
import { clientSideFetch, findById, findModuleItem } from "@/utils";
import { careersFormSchema } from "@/utils/formSchema";
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
import Dropzone from "@/components/global/DropZone";
import { Button } from "@/components/ui/button";
// Types
import { CareersItemType } from "@/types/api";
import { CareersDetailsPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps, GenericResponse } from "@/types";

type CareerFormProps = {
  locale: string;
  resources: CareersDetailsPageResourcesProps;
  data: CareersItemType;
};

type CareersFormInputsProps = {
  Name: string;
  LName: string;
  Email: string;
  PhoneNumber: string;
  CitizenshipID: string;
  DateOfBirth: string;
  ResidentialAddress: string;
  JobType: string;
  EducationLevel: string;
  WorkLocation: string;
  CityID: string;
  AreaID: string;
};

export default function CareerForm(props: CareerFormProps) {
  const { data, locale, resources } = props;

  const EducationLevelOptions = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      id: key,
      title: value,
    }),
  );

  const preferedWorkLocationOptions = Object.entries(preferedWorkLocation).map(
    ([key, value]) => ({
      id: key,
      title: value,
    }),
  );

  const jobTypeOptions = Object.entries(jobType).map(([key, value]) => ({
    id: key,
    title: value,
  }));

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    Citizenship,
    Cities,
    Module,
    FlagURL,
  } = useData();

  const defaultValues: CareersFormInputsProps = {
    Name: "",
    LName: "",
    Email: "",
    PhoneNumber: CountryPhoneCode,
    CitizenshipID: "",
    DateOfBirth: "",
    ResidentialAddress: "",
    JobType: "",
    EducationLevel: "",
    WorkLocation: "",
    CityID: "",
    AreaID: "",
  };

  // Module inputs for each country
  const careerArea = findModuleItem(Module, "careerAreaList")?.Status;
  const careerCitizenID = findModuleItem(Module, "careerCitizenList")?.Status;
  const careerDate = findModuleItem(Module, "career_birthday")?.Status;
  const careerResidential = findModuleItem(
    Module,
    "career_Residential",
  )?.Status;
  const careerEducational = findModuleItem(
    Module,
    "career_EducationLevel",
  )?.Status;

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

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [fileRejections, setFileRejections] = useState<string[]>([]);

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await careersFormSchema(resources, PhoneRegex, {
        careerArea,
        careerCitizenID,
        careerDate,
        careerResidential,
        careerEducational,
      });

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const [watchCity, phoneValue] = form.watch(["CityID", "PhoneNumber"]);

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("PhoneNumber", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const selectedCity = useMemo(() => {
    return watchCity ? findById(Cities, watchCity) : null;
  }, [Cities, watchCity]);

  const handleFormSubmit = async (values: CareersFormInputsProps) => {
    if (!captcha) {
      setCaptchaError(resources["captchaRequired"]);
      return;
    }

    const editedFormValues = {
      UniqueName: data.UniqueCode,
      Name: values.Name,
      LName: values.LName,
      Email: values.Email,
      PhoneNumber: values.PhoneNumber,
      CitizenshipID: values.CitizenshipID,
      DateOfBirth: values.DateOfBirth ? `${values.DateOfBirth}T00:00:00` : "",
      ResidentialAddress: values.ResidentialAddress,
      JobType: values.JobType,
      EducationLevel: values.EducationLevel,
      WorkLocation: values.WorkLocation,
      CityID: values.CityID,
      AreaID: values.AreaID,
    };

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const formData = new FormData();
      formData.append("FormData", JSON.stringify(editedFormValues));

      if (acceptedFiles && acceptedFiles.length > 0) {
        acceptedFiles.forEach((file, i) => {
          formData.append(`File${i + 1}`, file);
        });
      }

      const response = await clientSideFetch<GenericResponse<string>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}/${routeHandlersKeys.submitCareer}`,
        {
          method: "POST",
          body: formData,
          headers: {
            RecaptchaToken: captcha,
          },
        },
      );

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
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

      setAcceptedFiles([]);
      setFileRejections([]);

      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="mb-3 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Name"
                      label={resources["firstName"]}
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
              name="LName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="lName"
                      label={resources["lastName"]}
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

          <div>
            <FormField
              control={form.control}
              name="PhoneNumber"
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

          {careerCitizenID && (
            <div>
              <FormField
                control={form.control}
                name="CitizenshipID"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={resources["citizenshipId"]}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Citizenship?.map((item) => (
                          <SelectItem
                            key={item?.ID}
                            value={item?.ID?.toString()}
                          >
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
          )}

          {careerDate && (
            <div>
              <FormField
                control={form.control}
                name="DateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        label={resources["date"]}
                        type="date"
                        style={{ width: "100%"}}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {careerResidential && (
            <div>
              <FormField
                control={form.control}
                name="ResidentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput
                        id="ResidentialAddress"
                        label={resources["ResidentialAddress"]}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            <FormField
              control={form.control}
              name="JobType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["JobType"]} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobTypeOptions.map((item) => (
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

          {careerEducational && (
            <div>
              <FormField
                control={form.control}
                name="EducationLevel"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={resources["EducationLevel"]}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EducationLevelOptions?.map((item) => (
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
          )}

          <div>
            <FormField
              control={form.control}
              name="WorkLocation"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["WorkLoction"]} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {preferedWorkLocationOptions.map((item) => (
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

          {careerArea && (
            <>
              <div>
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
                            <SelectValue
                              placeholder={resources["selectCity"]}
                            />
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

              <div>
                <FormField
                  control={form.control}
                  name="AreaID"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <Select
                        value={field.value}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        disabled={
                          !selectedCity || selectedCity?.Areas?.length === 0
                        }
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={resources["selectArea"]}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {selectedCity?.Areas?.map((item) => (
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
        </div>

        <div className="mb-6">
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

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="submit" className="w-full md:w-1/4">
            {resources["submit"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
