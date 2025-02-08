"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { guestTokenizeThunk } from "@/store/features/auth/authThunk";
import cn from "@/utils/cn";
import { Button } from "@/components/ui/button";
// Types
import { CaptchaRefProps } from "@/types";

type ContinueAsAGuestProps = {
  resources: {
    continueAsGuest: string;
    captchaRequired: string;
  };
  className?: string;
  captcha: string | null;
  locale: string;
  captchaRef: CaptchaRefProps;
  setCaptcha: React.Dispatch<React.SetStateAction<string | null>>;
  setCaptchaError: React.Dispatch<React.SetStateAction<string>>;
  handleModalDismiss: () => void;
};

export default function ContinueAsAGuest(props: ContinueAsAGuestProps) {
  const {
    resources,
    className,
    captcha,
    locale,
    captchaRef,
    setCaptcha,
    setCaptchaError,
    handleModalDismiss,
  } = props;

  const { isLoggedIn } = useAppSelector(getClientSession);

  const dispatch = useAppDispatch();

  const handleContinueAsGuest = async () => {
    setCaptchaError("");

    if (isLoggedIn && handleModalDismiss) return handleModalDismiss();

    if (!captcha) return setCaptchaError(resources["captchaRequired"]);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await dispatch(
        guestTokenizeThunk({
          RecaptchaToken: captcha,
          AllowTracking: "false",
          locale,
        }),
      ).unwrap();

      if (response?.hasError) {
        setCaptcha("");
        captchaRef?.reset();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      handleModalDismiss();
    } catch (error) {
      console.log(
        "Error from create guest at allow tracking",
        (error as Error)?.message,
      );
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <Button
      type="button"
      variant="link"
      className={cn(
        "smooth mx-auto h-auto py-0 text-alt underline hover:text-dark",
        className,
      )}
      onClick={handleContinueAsGuest}
    >
      {resources["continueAsGuest"]}
    </Button>
  );
}
