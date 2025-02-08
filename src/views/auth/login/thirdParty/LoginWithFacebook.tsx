"use client";

import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { setServerCookie } from "@/server/actions/serverCookie";
import {
  fixedKeywords,
  LOGIN_REDIRECT,
  LOGIN_REDIRECT_COOKIE,
} from "@/utils/constants";
import FacebookIcon from "@/components/icons/FacebookIcon";

type LoginWithFacebookProps = {
  label: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function LoginWithFacebook(props: LoginWithFacebookProps) {
  const { label, ...rest } = props;

  const dispatch = useAppDispatch();

  const searchQuery = useSearchParams();
  const redirect = searchQuery?.get(fixedKeywords.redirectTo);

  const handleFacebookLogin = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    await setServerCookie([
      {
        name: LOGIN_REDIRECT_COOKIE,
        value: redirect ? redirect : LOGIN_REDIRECT,
      },
    ]);

    location.href = "/api/facebook";
  };

  return (
    <button
      type="button"
      className="smooth flex-center flex-grow gap-3 rounded-lg bg-[#1877F2] p-2 text-center text-white shadow hover:bg-dark"
      {...rest}
      onClick={handleFacebookLogin}
    >
      <FacebookIcon className="size-6 shrink-0" />{" "}
      <span className="min-w-40 text-start">{label}</span>
    </button>
  );
}
