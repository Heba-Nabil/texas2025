"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { AsYouType } from "libphonenumber-js";
import usePageModal from "@/hooks/usePageModal";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { userForgetPasswordThunk } from "@/store/features/auth/authThunk";
import { useData } from "@/providers/DataProvider";
import { forgetPasswordFormSchema } from "@/utils/formSchema";
import { sanitizeInputs } from "@/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { Button } from "@/components/ui/button";
// Types
import { ForgetPasswordPageResourcesProps } from "@/types/resources";

type ForgetPasswordFormProps = {
  locale: string;
  resources: ForgetPasswordPageResourcesProps;
};

type ForgetPasswordnFormInputsProps = {
  email: string;
  phone: string;
};

export default function ForgetPasswordForm(props: ForgetPasswordFormProps) {
  const { locale, resources } = props;

  const dispatch = useAppDispatch();

  const { handleModalDismiss } = usePageModal();

  const {
    Data: { PhoneRegex, CountryPhoneCode },
    FlagURL,
  } = useData();

  const defaultValues: ForgetPasswordnFormInputsProps = {
    email: "",
    phone: CountryPhoneCode,
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await forgetPasswordFormSchema(resources, PhoneRegex);

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

  const handleForgetPasswordSubmit = async (
    values: ForgetPasswordnFormInputsProps,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await dispatch(
        userForgetPasswordThunk({
          locale,
          Email: valuesWithoutHack?.email,
          Phone: valuesWithoutHack?.phone,
        }),
      ).unwrap();

      if (response?.hasError) {
        return response?.errors?.forEach((item: any) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      toaster.success({ message: resources["forgotPassPageDesc"] });

      handleModalDismiss();
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(handleForgetPasswordSubmit)}
        noValidate
      >
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

        <div className="mb-5">
          <p className="text-sm">{resources["forgotPassPageDesc"]}</p>
        </div>

        <div>
          <Button type="submit" className="w-full">
            {resources["resetPass"]}
          </Button>
        </div>
      </form>
    </Form>
  );
}
