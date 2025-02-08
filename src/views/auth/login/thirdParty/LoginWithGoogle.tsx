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
import GoogleIcon from "@/components/icons/GoogleIcon";

type LoginWithGoogleProps = {
  label: string;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function LoginWithGoogle(props: LoginWithGoogleProps) {
  const { label, ...rest } = props;

  const dispatch = useAppDispatch();

  const searchQuery = useSearchParams();
  const redirect = searchQuery?.get(fixedKeywords.redirectTo);

  const handleGoogleLogin = async () => {
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    await setServerCookie([
      {
        name: LOGIN_REDIRECT_COOKIE,
        value: redirect ? redirect : LOGIN_REDIRECT,
      },
    ]);

    location.href = "/api/google";
  };

  return (
    <button
      type="button"
      className="smooth flex-center flex-grow gap-3 rounded-lg bg-white p-2 text-center shadow hover:bg-dark hover:text-white"
      {...rest}
      onClick={handleGoogleLogin}
    >
      <GoogleIcon className="size-6 shrink-0" />{" "}
      <span className="min-w-40 text-start">{label}</span>
    </button>
  );
}
