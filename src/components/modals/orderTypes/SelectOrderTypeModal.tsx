"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import useCart from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getActiveOrderType,
  getModals,
  setActiveOrderType,
  toggleModal,
} from "@/store/features/global/globalSlice";
import { initializeCartThunk } from "@/store/features/cart/cartThunk";
import { findById } from "@/utils";
import {
  apiErrorCodes,
  cookiesExpireTime,
  elementsIds,
  fixedKeywords,
  ORDER_LOCATION,
  ORDER_TYPE_ID,
} from "@/utils/constants";
import {
  setOrderTypeId,
  setOrderLocation,
} from "@/store/features/order/orderSlice";
import { setServerCookie } from "@/server/actions/serverCookie";
import { toaster } from "@/components/global/Toaster";
import { mutatePath } from "@/server/actions";
import { clearServerCookie } from "@/server/actions/clearCookies";
import { getStoreByAreaId, getStoreByGeoFencing } from "@/lib/getStore";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OrderTypesNav from "@/components/layout/header/OrderTypesNav";
import PickupForm from "./pickup/PickupForm";
import BusyStoreModal from "./BusyStoreModal";
import DeliveryWrapper from "./delivery/DeliveryWrapper";
// Types
import { OrderTypesModalResourcesProps } from "@/types/resources";
import {
  GuestDeliveryOrderTypeFormProps,
  MapPositionProps,
  SelectPickupOrderDataProps,
} from "@/types";
import { StoreProps, UserAddressProps } from "@/types/api";

export default function SelectOrderTypeModal() {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations();
  const locale = useLocale();

  const resources: OrderTypesModalResourcesProps = {
    selectCity: t("selectCity"),
    selectBranch: t("selectBranch"),
    cityRequired: t("cityRequired"),
    branchRequired: t("branchRequired"),
    captchaRequired: t("captchaRequired"),
    at: t("at"),
    workingHours: t("workingHours"),
    from: t("from"),
    to: t("to"),
    busy: t("busy"),
    notAvailable: t("notAvailable"),
  };

  // Modal Prevent Page Scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const { OrderTypes, Stores, Data, Cities } = useData();

  const { cartItemsQty } = useCart();

  const {
    orderTypeModal: { isOpen, redirect },
  } = useAppSelector(getModals);

  const activeOrderTypeId = useAppSelector(getActiveOrderType);
  const activeOrderType = findById(OrderTypes, activeOrderTypeId!);

  const { selectedOrderTypeId, orderLocation } = useAppSelector(
    (state) => state.order,
  );

  const selectedStore = orderLocation?.storeId
    ? findById(Stores, orderLocation?.storeId)
    : null;

  const dispatch = useAppDispatch();

  const [busyStoreModal, setBusyStoreModal] = useState<StoreProps | null>(null);
  const [acceptBusy, setAcceptBusy] = useState<boolean>(
    selectedStore
      ? !selectedStore?.IsItBusy ||
          (selectedStore?.IsItBusy && selectedStore?.IfItBusyIsItAvailable)
      : false,
  );

  const [userLocation, setUserLocation] = useState<MapPositionProps>();

  useEffect(() => {
    function geoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess);
      }
    }

    function handleLocationSuccess(position: GeolocationPosition) {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    Data?.EnableAddressMapLocation && geoLocation();
  }, [Data]);

  const handleCloseWithRemoveSearchParams = () => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams?.get(fixedKeywords.triggerApp)) {
      router.replace(pathname);
    }

    dispatch(toggleModal({ orderTypeModal: { isOpen: false, redirect: "" } }));
  };

  const handleClose = () => {
    dispatch(toggleModal({ orderTypeModal: { isOpen: false, redirect: "" } }));
  };

  // Change Order Type
  const handleChangeOrderType = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(setActiveOrderType(id));
  };

  // Trigger Start order action
  const handleStartOrder = async (data: {
    store?: string;
    city?: string;
    addressId?: string;
    areaId?: string;
    block?: string;
    street?: string;
    building?: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    // instructions?: string;
    lat?: number;
    lng?: number;
  }) => {
    const orderLocationObject = {
      storeId: data?.store ? data?.store : "",
      cityId: data?.city ? data?.city : "",
      addressId: data?.addressId ? data?.addressId : "",
      areaId: data?.areaId ? data?.areaId : "",
      block: data?.block ? data?.block : "",
      street: data?.street ? data?.street : "",
      building: data?.building ? data?.building : "",
      floor: data?.floor ? data?.floor : "",
      apartment: data?.apartment ? data?.apartment : "",
      landmark: data?.landmark ? data?.landmark : "",
      // instructions: data?.instructions ? data?.instructions : "",
      lat: data?.lat ? data?.lat : 0,
      lng: data?.lng ? data?.lng : 0,
    };

    const orderCookies = [
      {
        name: ORDER_TYPE_ID,
        value: activeOrderTypeId!,
        expiration: new Date(Date.now() + cookiesExpireTime),
      },
      {
        name: ORDER_LOCATION,
        value: JSON.stringify(orderLocationObject),
        expiration: new Date(Date.now() + cookiesExpireTime),
      },
    ];

    dispatch(setOrderTypeId(activeOrderTypeId!));
    dispatch(setOrderLocation(orderLocationObject));

    await setServerCookie(orderCookies);
    await mutatePath("/");

    redirect && router.replace(redirect, { scroll: false });
    handleClose();
  };

  // Submit Pickup Order Type
  const handlePickupSubmit = async (data: SelectPickupOrderDataProps) => {
    if (!activeOrderTypeId) {
      toaster.error({ message: t("selectOrderType") });

      return;
    }

    // Show Loading Screen
    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const store = findById(Stores, data.store);
      // Open Busy Store Modal if its busy
      if (store?.IsItBusy && !store?.IfItBusyIsItAvailable) {
        return setBusyStoreModal(store);
      }
      // Check if order type changed or its details changed
      const isOrderDetailsChanged =
        selectedOrderTypeId !== activeOrderTypeId ||
        orderLocation?.storeId !== data.store ||
        orderLocation?.cityId !== data.city;

      if (!isOrderDetailsChanged) return handleClose();
      // Open clear cart modal in case of country require clear cart while change order type
      if (
        isOrderDetailsChanged &&
        Data?.IsCartClearedOnOrderTypeChange &&
        cartItemsQty > 0
      ) {
        return dispatch(
          toggleModal({
            clearCartModal: {
              isOpen: true,
              data: {
                orderTypeId: activeOrderTypeId,
                storeId: data?.store,
                message: t("confirmChangeOrderType"),
              },
              cb: () =>
                handleStartOrder({
                  store: data.store,
                  city: data.city,
                }),
            },
          }),
        );
      }

      // Initialize Cart
      const initializeCartResponse = await dispatch(
        initializeCartThunk({
          OrderTypeID: activeOrderTypeId,
          StoreID: data.store,
          locale,
        }),
      ).unwrap();

      if (initializeCartResponse?.hasError) {
        const isTokenExpired = initializeCartResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return initializeCartResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await handleStartOrder({
        store: data.store,
        city: data.city,
      });
    } catch (error) {
      console.log("Error from select order type modal", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  // Submit User Delivery with Addresses
  const handleDeliveryWithUserAddresses = async (
    data: UserAddressProps | undefined,
  ) => {
    if (!data) {
      toaster.error({ message: t("addressRequired") });

      return;
    }

    if (!activeOrderTypeId) {
      toaster.error({ message: t("selectOrderType") });

      return;
    }

    if (
      Data?.EnableAddressMapLocation &&
      (!data?.Longitude || !data?.Latitude)
    ) {
      toaster.error({ message: t("missingGeoLocation") });

      return;
    }

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const request = Data?.EnableAddressMapLocation
        ? getStoreByGeoFencing(locale, {
            Latitude: data?.Latitude,
            Longitude: data?.Longitude,
          })
        : getStoreByAreaId(locale, data.AreaID);

      const storeResponse = await request;

      if (storeResponse?.hasError) {
        const isTokenExpired = storeResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return storeResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      const store = storeResponse?.data;

      // Open Busy Store Modal if its busy
      if (store?.IsItBusy && !store?.IfItBusyIsItAvailable) {
        return setBusyStoreModal(store);
      }

      // Check if order type changed or its details changed
      const isOrderDetailsChanged =
        selectedOrderTypeId !== activeOrderTypeId ||
        orderLocation?.storeId !== store?.ID ||
        orderLocation?.cityId !== data?.CityID ||
        orderLocation?.areaId !== data?.AreaID ||
        orderLocation?.lat !== data?.Latitude ||
        orderLocation?.lng !== data?.Longitude ||
        orderLocation?.addressId !== data?.ID ||
        orderLocation?.apartment !== data?.Apartment ||
        orderLocation?.block !== data?.Block ||
        orderLocation?.building !== data?.Building ||
        orderLocation?.floor !== data?.Floor ||
        // orderLocation?.instructions !== data?.Instructions ||
        orderLocation?.landmark !== data?.Landmark ||
        orderLocation?.street !== data?.Street;

      if (!isOrderDetailsChanged) return handleClose();
      // Open clear cart modal in case of country require clear cart while change order type
      if (
        isOrderDetailsChanged &&
        Data?.IsCartClearedOnOrderTypeChange &&
        cartItemsQty > 0
      ) {
        dispatch(
          toggleModal({
            clearCartModal: {
              isOpen: true,
              data: {
                message: t("confirmChangeOrderType"),
                orderTypeId: activeOrderTypeId,
                storeId: store?.ID,
                cityId: data?.CityID,
                areaId: data?.AreaID,
                addressId: data?.ID,
                lng: data?.Longitude,
                lat: data?.Latitude,
              },
              cb: () =>
                handleStartOrder({
                  store: store?.ID,
                  city: data?.CityID,
                  addressId: data?.ID,
                  areaId: data?.AreaID,
                  lat: data?.Latitude,
                  lng: data?.Longitude,
                  apartment: data?.Apartment,
                  block: data?.Block,
                  building: data?.Building,
                  floor: data?.Floor,
                  landmark: data?.Landmark,
                  street: data?.Street,
                }),
            },
          }),
        );
        return;
      }

      // Initialize Cart
      const initializeCartResponse = await dispatch(
        initializeCartThunk({
          locale,
          OrderTypeID: activeOrderTypeId,
          StoreID: store?.ID,
          AddressID: data?.ID,
          AreaID: data?.AreaID,
          CityID: data?.CityID,
          Latitude: data?.Latitude,
          Longitude: data?.Longitude,
        }),
      ).unwrap();

      if (initializeCartResponse?.hasError) {
        const isTokenExpired = initializeCartResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return initializeCartResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await handleStartOrder({
        store: store?.ID,
        city: data?.CityID,
        addressId: data?.ID,
        areaId: data?.AreaID,
        lat: data?.Latitude,
        lng: data?.Longitude,
        apartment: data?.Apartment,
        block: data?.Block,
        building: data?.Building,
        floor: data?.Floor,
        landmark: data?.Landmark,
        street: data?.Street,
      });
    } catch (error) {
      console.log("Error from select order type modal", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  // Submit Guest Delivery with Select
  const handleGuestDeliveryWithSelect = async (
    data: GuestDeliveryOrderTypeFormProps,
    selectedMapLocation?: MapPositionProps,
  ) => {
    if (!data?.CityID || !data?.AreaID) {
      toaster.error({ message: t("mapLocationRequired") });
      return;
    }

    if (
      Data?.EnableAddressMapLocation &&
      (!selectedMapLocation?.lng || !selectedMapLocation?.lat)
    ) {
      toaster.error({ message: t("missingGeoLocation") });

      return;
    }

    if (!activeOrderTypeId) {
      toaster.error({ message: t("selectOrderType") });

      return;
    }

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const storeRequest = Data?.EnableAddressMapLocation
        ? getStoreByGeoFencing(locale, {
            Latitude: selectedMapLocation?.lat!,
            Longitude: selectedMapLocation?.lng!,
          })
        : getStoreByAreaId(locale, data?.AreaID);

      const storeResponse = await storeRequest;

      if (storeResponse?.hasError) {
        const isTokenExpired = storeResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        storeResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );

        return;
      }

      const store = storeResponse?.data;
      // Open Busy Store Modal if its busy
      if (store?.IsItBusy && !store?.IfItBusyIsItAvailable) {
        setBusyStoreModal(store);
        return;
      }
      // Check if order type changed or its details changed
      const isOrderDetailsChangedWithoutLngAndLat =
        selectedOrderTypeId !== activeOrderTypeId ||
        orderLocation?.storeId !== store?.ID ||
        orderLocation?.cityId !== data?.CityID ||
        orderLocation?.areaId !== data?.AreaID ||
        orderLocation?.apartment !== data?.Apartment ||
        orderLocation?.block !== data?.Block ||
        orderLocation?.building !== data?.Building ||
        orderLocation?.floor !== data?.Floor ||
        // orderLocation?.instructions !== data?.Instructions ||
        orderLocation?.landmark !== data?.Landmark ||
        orderLocation?.street !== data?.Street;

      const isOrderDetailsChanged = Data?.EnableAddressMapLocation
        ? isOrderDetailsChangedWithoutLngAndLat ||
          orderLocation?.lat !== selectedMapLocation?.lat ||
          orderLocation?.lng !== selectedMapLocation?.lng
        : isOrderDetailsChangedWithoutLngAndLat;

      if (!isOrderDetailsChanged) return handleClose();

      // Open clear cart modal in case of country require clear cart while change order type
      if (
        isOrderDetailsChanged &&
        Data?.IsCartClearedOnOrderTypeChange &&
        cartItemsQty > 0
      ) {
        dispatch(
          toggleModal({
            clearCartModal: {
              isOpen: true,
              data: {
                message: t("confirmChangeOrderType"),
                orderTypeId: activeOrderTypeId,
                storeId: store?.ID,
                cityId: data?.CityID,
                areaId: data?.AreaID,
                apartment: data?.Apartment,
                block: data?.Block,
                building: data?.Building,
                floor: data?.Floor,
                // instructions: data?.Instructions,
                landmark: data?.Landmark,
                street: data?.Street,
                ...(Data?.EnableAddressMapLocation ? selectedMapLocation : {}),
              },
              cb: () =>
                handleStartOrder({
                  store: store?.ID,
                  city: data?.CityID,
                  areaId: data?.AreaID,
                  apartment: data?.Apartment,
                  block: data?.Block,
                  building: data?.Building,
                  floor: data?.Floor,
                  // instructions: data?.Instructions,
                  landmark: data?.Landmark,
                  street: data?.Street,
                  ...(Data?.EnableAddressMapLocation
                    ? selectedMapLocation
                    : {}),
                }),
            },
          }),
        );
        return;
      }

      // Initialize Cart
      const initializeCartResponse = await dispatch(
        initializeCartThunk({
          locale,
          OrderTypeID: activeOrderTypeId,
          StoreID: store?.ID,
          CityID: data?.CityID,
          AreaID: data?.AreaID,
          Apartment: data?.Apartment,
          Block: data?.Block,
          Building: data?.Building,
          Floor: data?.Floor,
          // Instructions: data?.Instructions,
          Landmark: data?.Landmark,
          Street: data?.Street,
          ...(Data?.EnableAddressMapLocation
            ? {
                Latitude: selectedMapLocation?.lat,
                Longitude: selectedMapLocation?.lng,
              }
            : {}),
        }),
      ).unwrap();

      if (initializeCartResponse?.hasError) {
        const isTokenExpired = initializeCartResponse?.errors?.find(
          (item) => item.Code === apiErrorCodes.tokenExpired,
        );

        if (isTokenExpired) {
          await clearServerCookie();

          window.location.replace(`/${locale}`);
        }

        return initializeCartResponse?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await handleStartOrder({
        store: store?.ID,
        city: data?.CityID,
        areaId: data?.AreaID,
        apartment: data?.Apartment,
        block: data?.Block,
        building: data?.Building,
        floor: data?.Floor,
        // instructions: data?.Instructions,
        landmark: data?.Landmark,
        street: data?.Street,
        ...(Data?.EnableAddressMapLocation ? selectedMapLocation : {}),
      });
    } catch (error) {
      console.log("Error from select order type modal", error);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm">
      <Dialog
        open={isOpen}
        onOpenChange={handleCloseWithRemoveSearchParams}
        modal={false}
      >
        <DialogContent>
          <DialogHeader
            title={
              selectedOrderTypeId
                ? t("updateOrderLocation")
                : t("selectOrderType")
            }
            // showCloseBtn={false}
          />

          <DialogContentWrapper>
            {/* For Screen Readers Only */}
            <DialogDescription className="sr-only">
              {selectedOrderTypeId
                ? t("updateOrderLocation")
                : t("selectOrderType")}
            </DialogDescription>

            <OrderTypesNav
              data={OrderTypes}
              selectedOrderTypeId={activeOrderTypeId}
              handleClick={handleChangeOrderType}
            />

            <div className="mt-3">
              {activeOrderType?.IsStoreDependent ? (
                <PickupForm
                  resources={resources}
                  locale={locale}
                  orderTypeData={activeOrderType!}
                  defaultCityId={orderLocation?.cityId!}
                  defaultStoreId={orderLocation?.storeId!}
                  zoom={Data?.Zoom}
                  handlePickupSubmit={handlePickupSubmit}
                  setAcceptBusy={(status: boolean) => setAcceptBusy(status)}
                  setBusyStoreModal={(data: StoreProps | null) =>
                    setBusyStoreModal(data)
                  }
                />
              ) : (
                <DeliveryWrapper
                  EnableAddressMapLocation={Data?.EnableAddressMapLocation}
                  cities={Cities}
                  zoom={Data?.Zoom}
                  countryCenter={{ lat: Data?.Latitude, lng: Data?.Longitude }}
                  handleDeliveryWithUserAddresses={
                    handleDeliveryWithUserAddresses
                  }
                  handleGuestDeliveryWithSelect={handleGuestDeliveryWithSelect}
                  setBusyStoreModal={setBusyStoreModal}
                  userLocation={userLocation}
                />
              )}
            </div>
          </DialogContentWrapper>

          <DialogFooter className="mt-1">
            {activeOrderType?.IsStoreDependent ? (
              <Button
                type="submit"
                className="w-full"
                form={elementsIds.pickupFormSelect}
                disabled={!acceptBusy}
              >
                {t("startYourOrder")}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                form={elementsIds.deliveryForm}
              >
                {t("startYourOrder")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BusyStoreModal
        open={Boolean(busyStoreModal)}
        toggleBusyStore={(data: StoreProps | null) => setBusyStoreModal(data)}
        data={busyStoreModal}
        cb={(value: boolean) => setAcceptBusy(value)}
      />
    </div>
  );
}
