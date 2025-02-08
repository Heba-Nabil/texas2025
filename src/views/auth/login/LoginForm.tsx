"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowPathIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { userLoginThunk } from "@/store/features/auth/authThunk";
import { useRouter } from "@/navigation";
import { loginFormSchema } from "@/utils/formSchema";
import { sanitizeInputs } from "@/utils";
import { fixedKeywords, LOGIN_REDIRECT } from "@/utils/constants";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import usePageModal from "@/hooks/usePageModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import InputPassword from "@/components/input-password/InputPassword";
import { Button } from "@/components/ui/button";
// Types
import { LoginPageResourcesProps } from "@/types/resources";
import { CaptchaRefProps } from "@/types";

const DynamicContinueAsAGuest = dynamic(() => import("./ContinueAsAGuest"), {
  ssr: false,
});

type LoginFormInputsProps = {
  username: string;
  email: string;
  password: string;
};

const defaultValues: LoginFormInputsProps = {
  username: "",
  email: "",
  password: "",
};

type LoginFormProps = {
  resources: LoginPageResourcesProps;
  locale: string;
};

export default function LoginForm(props: LoginFormProps) {
  const { resources, locale } = props;
  const router = useRouter();

  const searchQuery = useSearchParams();
  const redirect = searchQuery?.get(fixedKeywords.redirectTo);

  const {
    loadingModal: { isOpen },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const { handleModalDismiss } = usePageModal();

  // Captcha
  const [captcha, setCaptcha] = useState<string | null>("");
  const [captchaError, setCaptchaError] = useState("");

  const handleCaptchaChange = (token: string | null) => {
    setCaptcha(token);
    setCaptchaError("");
  };

  const [captchaRef, setCaptchaRef] = useState<CaptchaRefProps>(null);
  const handleCaptchaRef = (e: any) => {
    setCaptchaRef(e);
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await loginFormSchema(resources);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const handleLoginSubmit = async (values: LoginFormInputsProps) => {
    const valuesWithoutHack = sanitizeInputs(values);

    if (!captcha) return setCaptchaError(resources["captchaRequired"]);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    const toaster = (await import("@/components/global/Toaster")).toaster;
    try {
      const response = await dispatch(
        userLoginThunk({
          locale,
          UserName: valuesWithoutHack?.email,
          Password: valuesWithoutHack?.password,
          ReCaptchaToken: captcha,
        }),
      ).unwrap();

      if (response?.hasError) {
        setCaptcha("");
        captchaRef?.reset();

        dispatch(toggleModal({ loadingModal: { isOpen: false } }));

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      // Facebook pixels
      !!window?.fbq &&
        fbq("track", "UserLogin", {
          content_name: "User Login",
          user_data: {
            email: valuesWithoutHack?.email,
          },
          login_type: "email",
          platform: "website"
        });

      // Tiktok pixels
      !!window?.ttq &&
        ttq?.track("UserLogin", {
          content_name: "User Login",
          // content_type: "product",
          email: valuesWithoutHack?.email,
          external_id: valuesWithoutHack?.email,
          platform: 'website',
          login_type: "email", 
        });

      // Google events
      !!window?.gtag &&
        window?.gtag("event", "login", {
          method: "email",
          items: [
            {
              item_id: valuesWithoutHack?.email,
              item_name: "User Login",
              item_category: "Account",
            },
          ],
          user_properties: {
            email: valuesWithoutHack?.email,
          },
          custom_data: {
            platform: 'website',
          }
        });

      // Snapchat pixels
      !!window?.snaptr &&
        snaptr("track", "LOGIN", {
          content_name: "User Login",
          login_type: 'email',
          platform:'website',
          user_email: valuesWithoutHack?.email,
          user_data: {
            email: valuesWithoutHack?.email,
          },
        });

      if (redirect) {
        location.replace(redirect);
      } else {
        location.replace(LOGIN_REDIRECT);
      }
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(handleLoginSubmit)}
        noValidate
      >
        <div className="mb-5">
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

        <div className="mb-3">
          <InputPassword
            form={form}
            label={resources["password"]}
            id="password"
          />
        </div>

        <div className="flex-between mb-3 flex-wrap gap-3">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-sm font-normal underline"
            onClick={() =>
              redirect
                ? router.push(
                    `/forgetpassword?${fixedKeywords.redirectTo}=${redirect}`,
                    { scroll: false },
                  )
                : router.push("/forgetpassword", { scroll: false })
            }
          >
            {resources["forgetPass"]}
          </Button>
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

        <div className="flex w-full flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isOpen}>
            {isOpen ? (
              <>
                <ArrowPathIcon className="me-1 size-5 animate-spin" />
                {resources["submitting"]}
              </>
            ) : (
              resources["logIn"]
            )}
          </Button>

          <Button
            type="button"
            variant="light"
            className="w-full"
            disabled={isOpen}
            onClick={() =>
              redirect
                ? router.replace(
                    `/signup?${fixedKeywords.redirectTo}=${redirect}`,
                    { scroll: false },
                  )
                : router.replace("/signup", { scroll: false })
            }
          >
            {resources["dontHaveAccount"]}
          </Button>

          <DynamicContinueAsAGuest
            resources={{
              captchaRequired: resources["captchaRequired"],
              continueAsGuest: resources["continueAsGuest"],
            }}
            captcha={captcha}
            locale={locale}
            captchaRef={captchaRef}
            setCaptcha={setCaptcha}
            setCaptchaError={setCaptchaError}
            handleModalDismiss={handleModalDismiss}
          />
        </div>
      </form>
    </Form>
  );
}
