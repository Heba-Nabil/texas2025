"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "@/navigation";
import {
  getModals,
  setActiveOrderType,
  toggleModal,
} from "@/store/features/global/globalSlice";
import { fixedKeywords } from "@/utils/constants";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { displayInOrder } from "@/utils";
import ChangeCountryModal from "@/components/modals/ChangeCountryModal";
import SelectOrderTypeModal from "@/components/modals/orderTypes/SelectOrderTypeModal";
import LoadingModal from "@/components/modals/LoadingModal";
import ClearCartModal from "@/components/modals/ClearCartModal";
import DeleteCartItemModal from "@/components/modals/DeleteCartItemModal";
import MenuItemCustomizationsModal from "@/components/modals/MenuItemCustomizationsModal";
import ConfirmLogoutModal from "@/components/modals/ConfirmLogoutModal";
import ConfirmDeleteAddressModal from "@/components/modals/ConfirmDeleteAddressModal";
import UserAddressModal from "@/components/modals/userAddresses/UserAddressModal";
import ConfirmToggleDealModal from "@/components/modals/ConfirmToggleDealModal";
import SingleDealWithListModal from "@/components/modals/SingleDealWithListModal";
// Types
import { OrderTypeProps } from "@/types/api";
import { ClientSessionProps } from "@/types";

type SharedProps = {
  children: React.ReactNode;
  locale: string;
  orderTypes: OrderTypeProps[];
  session: ClientSessionProps;
};

const DynamicAllowTrackingPopup = dynamic(
  () => import("@/components/modals/AllowTrackingPopup"),
);

export default function Shared(props: SharedProps) {
  const { children, locale, orderTypes, session } = props;

  const searchParams = useSearchParams();
  const isMobileView = searchParams.get(fixedKeywords.AppView);

  const pathname = usePathname()?.toLowerCase();

  const router = useRouter();

  const {
    changeCountryModal,
    orderTypeModal,
    loadingModal,
    allowTrackingModal,
    clearCartModal,
    deleteCartItemModal,
    menuItemCustomizationsModal,
    logOutModal,
    addressModal,
    deleteAddressModal,
    confirmToggleDealModal,
    singleDealWithListModal,
  } = useAppSelector(getModals);

  const {
    selectedOrderTypeId,
    orderLocation: { storeId, addressId },
  } = useAppSelector((state) => state.order);

  const dispatch = useAppDispatch();

  // Handle Open Order-Types Modal in case of Query Params 'triggerApp' exist
  useEffect(() => {
    if (
      searchParams.get(fixedKeywords.triggerApp) &&
      (!selectedOrderTypeId || !storeId)
    ) {
      dispatch(setActiveOrderType(displayInOrder(orderTypes)[0]?.ID));

      dispatch(
        toggleModal({
          orderTypeModal: {
            isOpen: true,
            redirect: searchParams?.get(fixedKeywords.redirectTo) ?? "",
          },
        }),
      );
    }
  }, [dispatch, searchParams, selectedOrderTypeId, orderTypes, storeId]);

  // Handle Open Order-Types Modal in case of delivery & user & no address
  useEffect(() => {
    const isOrderTypeDependOnStore = orderTypes?.find(
      (item) => item.ID === selectedOrderTypeId,
    )?.IsStoreDependent;

    if (
      pathname.startsWith("/menu") &&
      session?.isUser &&
      !Boolean(isOrderTypeDependOnStore) &&
      !addressId
    ) {
      location.href = `/?${fixedKeywords.triggerApp}=true&${fixedKeywords.redirectTo}=${pathname}`;
    }
  }, [
    orderTypes,
    selectedOrderTypeId,
    pathname,
    session,
    addressId,
    router,
    dispatch,
  ]);

  useEffect(() => {
    const isOrderTypeDependOnStore = orderTypes?.find(
      (item) => item.ID === selectedOrderTypeId,
    )?.IsStoreDependent;

    if (
      searchParams.get(fixedKeywords.triggerApp) &&
      session?.isUser &&
      !Boolean(isOrderTypeDependOnStore) &&
      !addressId
    ) {
      dispatch(setActiveOrderType(displayInOrder(orderTypes)[0]?.ID));

      dispatch(
        toggleModal({
          orderTypeModal: {
            isOpen: true,
            redirect: searchParams?.get(fixedKeywords.redirectTo) ?? "",
          },
        }),
      );
    }
  }, [
    addressId,
    orderTypes,
    searchParams,
    selectedOrderTypeId,
    session,
    dispatch,
  ]);

  return (
    <>
      {children}

      {/* Modals */}
      {changeCountryModal?.isOpen && <ChangeCountryModal />}
      {orderTypeModal?.isOpen && <SelectOrderTypeModal />}
      {clearCartModal?.isOpen && <ClearCartModal />}
      {deleteCartItemModal?.isOpen && <DeleteCartItemModal />}
      {menuItemCustomizationsModal?.isOpen && <MenuItemCustomizationsModal />}
      {logOutModal?.isOpen && <ConfirmLogoutModal />}
      {deleteAddressModal?.isOpen && <ConfirmDeleteAddressModal />}
      {addressModal?.isOpen && <UserAddressModal />}
      {confirmToggleDealModal?.isOpen && <ConfirmToggleDealModal />}
      {singleDealWithListModal?.isOpen && <SingleDealWithListModal />}
      <LoadingModal open={loadingModal?.isOpen} locale={locale} />

      {allowTrackingModal?.isOpen && !isMobileView && (
        <DynamicAllowTrackingPopup />
      )}

      <ToastContainer
        rtl={locale === "ar"}
        position={locale === "ar" ? "top-left" : "top-right"}
        limit={3}
        className="text-sm"
        autoClose={8000}
      />
    </>
  );
}
