"use client";

import { useAppDispatch } from "@/store/hooks";
import { userDeleteAccountThunk } from "@/store/features/auth/authThunk";
import { clearServerCookie } from "@/server/actions/clearCookies";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
// Types
import { DeleteAccountPageResources } from "@/types/resources";
import { toggleModal } from "@/store/features/global/globalSlice";

type DeleteAccountViewProps = {
  locale: string;
  resources: DeleteAccountPageResources;
};

export default function DeleteAccountView(props: DeleteAccountViewProps) {
  const { locale, resources } = props;

  const dispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const toaster = (await import("@/components/global/Toaster")).toaster;

      const response = await dispatch(
        userDeleteAccountThunk({
          locale,
        }),
      ).unwrap();

      await clearServerCookie();

      window.location.replace(`/${locale}`);

      if (response?.hasError) {
        dispatch(toggleModal({ loadingModal: { isOpen: false } }));

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);

      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <DashBoardPagesWrapper label={resources["deleteMyAccount"]}>
      <div className="overflow-y-auto">
        <div className="flex flex-grow px-5">
          <div className="w-full">
            <h3 className="text-xl font-bold capitalize">
              {resources["areYouSureYouWantDeleteAccount"]}
            </h3>

            <p className="mt-2 max-w-sm font-semibold text-dark-gray">
              {resources["deleteAccountDescription"]}
            </p>

            <button
              type="button"
              className="mt-5 text-lg font-semibold capitalize text-alt underline"
              onClick={handleDeleteAccount}
            >
              {resources["deleteMyAccount"]}
            </button>
          </div>
        </div>
      </div>
    </DashBoardPagesWrapper>
  );
}
