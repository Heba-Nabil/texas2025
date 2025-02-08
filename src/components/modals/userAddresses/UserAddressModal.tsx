"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getModals, toggleModal } from "@/store/features/global/globalSlice";
import { getClientSession } from "@/store/features/auth/authSlice";
import { useData } from "@/providers/DataProvider";
import useAddresses from "@/hooks/useAddresses";
import { sanitizeInputs } from "@/utils";
import { apiErrorCodes, elementsIds } from "@/utils/constants";
import { getStoreByAreaId } from "@/lib/getStore";
import { clearServerCookie } from "@/server/actions/clearCookies";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import AddressesWithMapForm from "./address-map/AddressesWithMapForm";
import AddressesWithSelect from "./AddressesWithSelect";
import { Button } from "@/components/ui/button";
// Types
import { AddressesModalResourcesProps } from "@/types/resources";
import { AddressWithSelectForm, MapPositionProps } from "@/types";

export default function UserAddressModal() {
  const t = useTranslations();
  const locale = useLocale();

  const resources: AddressesModalResourcesProps = {
    continue: t("continue"),
    cityRequired: t("cityRequired"),
    areaRequired: t("areaRequired"),
    requiredBlockNumber: t("requiredBlockNumber"),
    requiredBuildingNumber: t("requiredBuildingNumber"),
    requiredFloorNumber: t("requiredFloorNumber"),
    requiredLandMark: t("requiredLandMark"),
    requiredStreet: t("requiredStreet"),
    requiredApartment: t("requiredApartment"),
    block: t("block"),
    street: t("street"),
    building: t("building"),
    floor: t("floor"),
    apartment: t("apartment"),
    landmark: t("landmark"),
    instructions: t("instructions"),
    makeDefaultAddress: t("makeDefaultAddress"),
    selectCity: t("selectCity"),
    selectArea: t("selectArea"),
    addNewAddress: t("addNewAddress"),
    requiredPhone: t("requiredPhone"),
    phone: t("phone"),
    phoneValidate: t("phoneValidate"),
    maxLength: t("maxLength"),
    character: t("character"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    pickPinOnMap: t("pickPinOnMap"),
    fieldAcceptsAlphaNumericAndDash: t("fieldAcceptsAlphaNumericAndDash"),
    detectMyCurrentLocation: t("detectMyCurrentLocation"),
    pleaseAllowAccessToYourLocation: t("pleaseAllowAccessToYourLocation"),
  };

  const {
    addressModal: { isOpen, data, cb },
  } = useAppSelector(getModals);

  const { info } = useAppSelector(getClientSession);
  const userPhone = info ? info.phone : "";

  const {
    data: addressesData,
    createAddress,
    editAddress,
    mutate,
  } = useAddresses(locale, true);

  const {
    Data: { EnableAddressMapLocation, PhoneRegex, Longitude, Latitude, Zoom },
    Cities,
  } = useData();

  const currentAddress = addressesData
    ? addressesData?.find((item) => item.ID === data?.AddressID)
    : undefined;

  const mapCenter = useMemo<MapPositionProps>(() => {
    return currentAddress
      ? currentAddress?.Latitude && currentAddress?.Longitude
        ? { lat: currentAddress?.Latitude, lng: currentAddress?.Longitude }
        : { lat: Latitude, lng: Longitude }
      : { lat: Latitude, lng: Longitude };
  }, [currentAddress, Latitude, Longitude]);

  const [selectedMapLocation, setSelectedMapLocation] =
    useState<MapPositionProps>();

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(
      toggleModal({ addressModal: { isOpen: false, data: null, cb: null } }),
    );
  };

  // useEffect(() => {
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);

  const handleAddAddressFromSelect = async (
    values: AddressWithSelectForm,
    form: any,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);
    console.log(valuesWithoutHack);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    let response;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      response = await getStoreByAreaId(locale, valuesWithoutHack?.AreaID);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      response = await createAddress(
        locale,
        valuesWithoutHack as AddressWithSelectForm,
      );

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        form.reset();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutate();
      cb && cb(response?.data);
      handleClose();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleEditAddressFromSelect = async (
    values: AddressWithSelectForm,
    form: any,
    id: string,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    let response;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      response = await getStoreByAreaId(locale, valuesWithoutHack?.AreaID);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      response = await editAddress(locale, {
        ...valuesWithoutHack,
        AddressID: id,
      } as AddressWithSelectForm);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        form.reset();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutate();
      handleClose();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleAddAddressFromMap = async (
    values: AddressWithSelectForm,
    form: any,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    if (
      !values.CityID ||
      !values.AreaID ||
      !selectedMapLocation?.lat ||
      !selectedMapLocation?.lng
    ) {
      toaster.error({ message: t("mapLocationRequired") });
      return;
    }

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const response = await createAddress(locale, {
        ...valuesWithoutHack,
        Latitude: selectedMapLocation?.lat,
        Longitude: selectedMapLocation?.lng,
      } as AddressWithSelectForm);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        form.reset();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutate();

      cb && cb(response?.data);
      handleClose();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  const handleEditAddressFromMap = async (
    values: AddressWithSelectForm,
    form: any,
    id: string,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);

    const toaster = (await import("@/components/global/Toaster")).toaster;

    if (
      !values.CityID ||
      !values.AreaID ||
      !selectedMapLocation?.lat ||
      !selectedMapLocation?.lng
    ) {
      toaster.error({ message: t("mapLocationRequired") });
      return;
    }

    try {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await editAddress(locale, {
        ...valuesWithoutHack,
        AddressID: id,
        Latitude: selectedMapLocation?.lat,
        Longitude: selectedMapLocation?.lng,
      } as AddressWithSelectForm);

      if (response?.hasError) {
        const isTokenExpired = response?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        form.reset();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutate();
      handleClose();
    } catch (error) {
      console.error("Error in creating address", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    // <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      // modal={false}
    >
      <DialogContent
      // className="z-[60] rounded-3xl"
      >
        <DialogHeader
          title={currentAddress ? t("editAddress") : t("addNewAddress")}
        />

        <DialogContentWrapper>
          <DialogDescription className="sr-only hidden">
            {currentAddress ? t("editAddress") : t("addNewAddress")}
          </DialogDescription>

          {EnableAddressMapLocation ? (
            <AddressesWithMapForm
              currentAddress={currentAddress}
              userPhone={userPhone}
              phoneRegex={PhoneRegex}
              resources={resources}
              locale={locale}
              cities={Cities}
              zoom={Zoom}
              mapCenter={mapCenter}
              selectedMapLocation={selectedMapLocation}
              setSelectedMapLocation={setSelectedMapLocation}
              handleAddAddressFromMap={handleAddAddressFromMap}
              handleEditAddressFromMap={handleEditAddressFromMap}
            />
          ) : (
            <AddressesWithSelect
              currentAddress={currentAddress}
              userPhone={userPhone}
              phoneRegex={PhoneRegex}
              resources={resources}
              locale={locale}
              cities={Cities}
              handleAddAddressFromSelect={handleAddAddressFromSelect}
              handleEditAddressFromSelect={handleEditAddressFromSelect}
            />
          )}
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="submit"
            form={elementsIds.addressWithSelect}
            className="w-full"
          >
            {resources["continue"]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // </div>
  );
}
