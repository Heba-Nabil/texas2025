"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useData } from "@/providers/DataProvider";
import cn from "@/utils/cn";
import { fixedKeywords } from "@/utils/constants";
import PageModal from "@/components/global/PageModal";
import LoginWithGoogle from "./thirdParty/LoginWithGoogle";
import LoginWithFacebook from "./thirdParty/LoginWithFacebook";
import LoginWithApple from "./thirdParty/LoginWithApple";
import CompleteInfoModal from "@/components/modals/CompleteInfoModal";
import LoginForm from "./LoginForm";
// Types
import { LoginPageResourcesProps } from "@/types/resources";
import { AuthenticationTypeIdEnum } from "@/types/enums";

type LoginViewProps = {
  resources: LoginPageResourcesProps;
  locale: string;
  thirdPartySession?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    typeId: AuthenticationTypeIdEnum;
    id: string;
  };
};

export default function LoginView(props: LoginViewProps) {
  const { resources, locale, thirdPartySession } = props;

  const { AuthenticationPlatforms } = useData();

  const googlePlatform = AuthenticationPlatforms?.find(
      (item) => item.AuthenticationTypeID === AuthenticationTypeIdEnum.Google,
    ),
    facebookPlatform = AuthenticationPlatforms?.find(
      (item) => item.AuthenticationTypeID === AuthenticationTypeIdEnum.Facebook,
    ),
    applePlatform = AuthenticationPlatforms?.find(
      (item) => item.AuthenticationTypeID === AuthenticationTypeIdEnum.Apple,
    );

  const searchParams = useSearchParams();
  const completeInfo = searchParams.get(fixedKeywords.completeInfo);
  const image = searchParams.get("image")
    ? atob(searchParams.get("image") || "")
    : undefined;

  const [openCompleteInfo, setOpenCompleteInfo] = useState(
    Boolean(completeInfo && thirdPartySession),
  );

  useEffect(() => {
    setOpenCompleteInfo(Boolean(completeInfo && thirdPartySession));
  }, [completeInfo, thirdPartySession]);

  if (openCompleteInfo && thirdPartySession)
    return (
      <CompleteInfoModal
        data={thirdPartySession}
        isOpen={openCompleteInfo}
        image={image}
      />
    );

  return (
    <PageModal
      modalTitle={resources["login"]}
      closeIcon={<XMarkIcon className="size-4 shrink-0" />}
      wrapperClasses="bg-white z-0"
      // wrapperClasses="bg-white z-0 flex flex-col max-h-[85vh]"
    >
      <div className="flex-grow overflow-y-auto p-4">
        {AuthenticationPlatforms?.length > 0 && (
          <div
            className={cn("flex justify-center gap-2", {
              "flex-col": AuthenticationPlatforms?.length > 2,
            })}
          >
            {googlePlatform && (
              <LoginWithGoogle
                label={resources["continueWithGoogle"]}
                style={{ order: googlePlatform?.DisplayOrder }}
              />
            )}

            {facebookPlatform && (
              <LoginWithFacebook
                label={resources["continueWithFacebook"]}
                style={{ order: facebookPlatform?.DisplayOrder }}
              />
            )}

            {applePlatform && (
              <LoginWithApple
                label={resources["continueWithApple"]}
                style={{ order: 3 }}
              />
            )}
          </div>
        )}

        <div className="my-7 h-px bg-gray-200 text-center">
          <span className="relative top-1/2 inline-block -translate-y-1/2 bg-white px-3">
            {resources["or"]}
          </span>
        </div>

        <LoginForm resources={resources} locale={locale} />
      </div>
    </PageModal>
  );
}
