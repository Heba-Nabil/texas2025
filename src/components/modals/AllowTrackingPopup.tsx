"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import { guestTokenizeThunk } from "@/store/features/auth/authThunk";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { toaster } from "@/components/global/Toaster";
import { setServerCookie } from "@/server/actions/serverCookie";
import { ALLOW_TRACKING, allowTrackingExpireTime } from "@/utils/constants";
import {
  Sheet,
  SheetContent,
  SheetContentWrapper,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// Types
import { CaptchaRefProps } from "@/types";

export default function AllowTrackingPopup() {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const session = useAppSelector(getClientSession);

  const {
    allowTrackingModal: { isOpen },
  } = useAppSelector(getModals);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ allowTrackingModal: { isOpen: false } }));
  };

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

  const handleAction = async (value: string) => {
    setCaptchaError("");

    if (!captcha) return setCaptchaError(t("captchaRequired"));

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      // Create Guest in case of not already logged in
      if (!session?.isLoggedIn) {
        const guestResponse = await dispatch(
          guestTokenizeThunk({
            RecaptchaToken: captcha,
            AllowTracking: value,
            locale,
          }),
        ).unwrap();

        if (guestResponse?.hasError) {
          setCaptcha("");
          captchaRef?.reset();
          dispatch(toggleModal({ loadingModal: { isOpen: false } }));

          return guestResponse?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );
        }
      }

      // Save User action
      await setServerCookie([
        {
          name: ALLOW_TRACKING,
          value,
          expiration: new Date(Date.now() + allowTrackingExpireTime),
        },
      ]);
    } catch (error) {
      console.log(
        "Error from create guest at allow tracking",
        (error as Error)?.message,
      );
    }
    dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
      <Sheet open={isOpen} onOpenChange={handleClose} modal={false}>
        <SheetContent
          side="bottom"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          className="left-auto right-0 z-[70] m-5 rounded-3xl text-center sm:w-[350px]"
        >
          <SheetHeader className="h-14 justify-center !border-0">
            <img
              src="/images/icons/cookies.svg"
              alt="Tracking"
              width={35}
              height={35}
              className="object-contain"
            />
            <SheetTitle>{t("allowTrackingPopupTitle")}</SheetTitle>
            <SheetDescription className="sr-only">
              {t("allowTrackingPopupTitle")}
            </SheetDescription>
          </SheetHeader>

          <SheetContentWrapper className="pt-0">
            <p className="max-w-lg">{t("allowTrackingPopupDescription")}</p>
            {!session?.isLoggedIn && (
              <div className="mt-4 block justify-center">
                <ReCAPTCHA
                  className="flex items-center justify-center"
                  ref={handleCaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_CAPTCHA_CLIENT_KEY!}
                  onChange={handleCaptchaChange}
                />
                {captchaError && (
                  <p className="block text-sm text-alt">{captchaError}</p>
                )}
              </div>
            )}

            <SheetFooter className="mt-4 !justify-between gap-4">
              <Button
                variant="light"
                className="w-full"
                onClick={() => handleAction("false")}
              >
                {t("reject")}
              </Button>

              <Button className="w-full" onClick={() => handleAction("true")}>
                {t("accept")}
              </Button>
            </SheetFooter>
          </SheetContentWrapper>
        </SheetContent>
      </Sheet>
    </div>
  );
}
