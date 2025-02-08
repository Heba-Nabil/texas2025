"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import useCart from "@/hooks/useCart";
import { promoCodeFormSchema } from "@/utils/formSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
// Types
import { PromoCodeFormResourcesProps } from "@/types/resources";
import { ErrorProps } from "@/types/api";

type PromoCodeProps = {
  resources: PromoCodeFormResourcesProps;
  locale: string;
  promoCode: string | null;
};

type PromoCodeFormProps = {
  Code: string;
};

export default function PromoCode(props: PromoCodeProps) {
  const { resources, locale, promoCode } = props;

  const defaultValues = {
    Code: promoCode ? promoCode : "",
  };

  const { handleApplyPromoCode, handleRemovePromoCode } = useCart();

  const [isSubmit, setIsSubmit] = useState(false);
  const [errors, setErrors] = useState<ErrorProps[]>([]);

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await promoCodeFormSchema(resources);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const handlePromoSubmit = async (values: PromoCodeFormProps) => {
    if (promoCode) return;

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      setIsSubmit(true);
      setErrors([]);

      const response = await handleApplyPromoCode(locale, values.Code);

      if (response?.hasError) {
        setErrors(response?.errors);

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      setIsSubmit(false);
    }
  };

  const handleRemovePromo = async () => {
    if (!promoCode) return;

    const toaster = (await import("@/components/global/Toaster")).toaster;

    try {
      setIsSubmit(true);
      setErrors([]);

      const response = await handleRemovePromoCode(locale, promoCode);

      if (response?.hasError) {
        setErrors(response?.errors);

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      form.setValue("Code", "");
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(handlePromoSubmit)}
        noValidate
      >
        <div>
          <FormField
            control={form.control}
            name="Code"
            disabled={isSubmit || Boolean(promoCode)}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    id="Code"
                    type="text"
                    label={resources["enterPromoCode"]}
                    className="pe-24 ps-3"
                    aria-invalid={errors?.length > 0}
                    aria-checked={Boolean(promoCode)}
                    endIcon={
                      promoCode ? (
                        <Button
                          type="button"
                          variant="link"
                          className="absolute end-0 top-0 z-10 w-20 text-alt"
                          disabled={isSubmit}
                          onClick={handleRemovePromo}
                        >
                          {isSubmit ? (
                            <ArrowPathIcon className="size-5 animate-spin" />
                          ) : (
                            resources["remove"]
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="dark"
                          className="absolute end-0 top-0 w-20"
                          disabled={isSubmit}
                        >
                          {isSubmit ? (
                            <ArrowPathIcon className="size-5 animate-spin" />
                          ) : (
                            resources["apply"]
                          )}
                        </Button>
                      )
                    }
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {Boolean(promoCode) && (
          <p className="mt-1 text-sm text-green-600">{resources["applied"]}</p>
        )}

        {errors?.length > 0 && (
          <ul className="mt-2 w-full text-sm text-alt">
            {errors?.map((item, index) => (
              <li key={index} className="leading-none">
                {item.Message}
              </li>
            ))}
          </ul>
        )}
      </form>
    </Form>
  );
}
