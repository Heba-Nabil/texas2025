import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestDeliveryOrderTypeFormSchema } from "@/utils/formSchema";
import { useAppSelector } from "@/store/hooks";
import { elementsIds } from "@/utils/constants";
import { findById } from "@/utils";
import cn from "@/utils/cn";
import { toaster } from "@/components/global/Toaster";
import StoreMap from "@/components/modals/userAddresses/address-map/StoreMap";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
// Types
import {
  GuestDeliveryOrderTypeFormProps,
  GuestDeliveryOrderTypesFormResourcesProps,
  MapPositionProps,
} from "@/types";
import { CityProps, StoreProps } from "@/types/api";

type GuestDeliveryProps = {
  EnableAddressMapLocation: boolean;
  cities: CityProps[];
  zoom: number;
  countryCenter: MapPositionProps;
  handleGuestDeliveryWithSelect: (
    values: GuestDeliveryOrderTypeFormProps,
    selectedMapLocation?: MapPositionProps,
  ) => Promise<void>;
  setBusyStoreModal: React.Dispatch<React.SetStateAction<StoreProps | null>>;
  userLocation: MapPositionProps | undefined;
};

export default function GuestDelivery(props: GuestDeliveryProps) {
  const {
    EnableAddressMapLocation,
    cities,
    zoom,
    countryCenter,
    handleGuestDeliveryWithSelect,
    setBusyStoreModal,
    userLocation,
  } = props;

  const t = useTranslations();
  const locale = useLocale();

  const resources: GuestDeliveryOrderTypesFormResourcesProps = {
    pickPinOnMap: t("pickPinOnMap"),
    cityRequired: t("cityRequired"),
    areaRequired: t("areaRequired"),
    requiredBlockNumber: t("requiredBlockNumber"),
    maxLength: t("maxLength"),
    character: t("character"),
    block: t("block"),
    canOnlyContainLettersNumbersUnderscoes: t(
      "canOnlyContainLettersNumbersUnderscoes",
    ),
    requiredStreet: t("requiredStreet"),
    street: t("street"),
    requiredBuildingNumber: t("requiredBuildingNumber"),
    building: t("building"),
    requiredFloorNumber: t("requiredFloorNumber"),
    floor: t("floor"),
    requiredApartment: t("requiredApartment"),
    apartment: t("apartment"),
    requiredLandMark: t("requiredLandMark"),
    landmark: t("landmark"),
    // instructions: t("instructions"),
    selectCity: t("selectCity"),
    selectArea: t("selectArea"),
    fieldAcceptsAlphaNumericAndDash: t("fieldAcceptsAlphaNumericAndDash"),
    detectMyCurrentLocation: t("detectMyCurrentLocation"),
    pleaseAllowAccessToYourLocation: t("pleaseAllowAccessToYourLocation"),
  };

  const { orderLocation } = useAppSelector((state) => state.order);

  const mapCenter = useMemo<MapPositionProps>(() => {
    return orderLocation
      ? orderLocation?.lat && orderLocation?.lng
        ? { lat: orderLocation?.lat, lng: orderLocation?.lng }
        : countryCenter
      : countryCenter;
  }, [orderLocation, countryCenter]);

  const [selectedMapLocation, setSelectedMapLocation] =
    useState<MapPositionProps>();

  const [selectedStore, setSelectedStore] = useState<StoreProps>();

  useEffect(() => {
    if (selectedStore && setBusyStoreModal) {
      if (selectedStore?.IsItBusy) {
        setBusyStoreModal(selectedStore);
      }
    }
  }, [selectedStore, setBusyStoreModal]);

  const defaultValues = {
    CityID: orderLocation?.cityId ? orderLocation?.cityId : "",
    AreaID: orderLocation?.areaId ? orderLocation?.areaId : "",
    Block: orderLocation?.block ? orderLocation?.block : "",
    Street: orderLocation?.street ? orderLocation?.street : "",
    Building: orderLocation?.building ? orderLocation?.building : "",
    Floor: orderLocation?.floor ? orderLocation?.floor : "",
    Apartment: orderLocation?.apartment ? orderLocation?.apartment : "",
    Landmark: orderLocation?.landmark ? orderLocation?.landmark : "",
    // Instructions: orderLocation?.instructions
    //   ? orderLocation?.instructions
    //   : "",
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await guestDeliveryOrderTypeFormSchema(
        resources,
        EnableAddressMapLocation,
      );

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const [watchCity, watchArea] = form.watch(["CityID", "AreaID"]);

  const selectedCity = useMemo(() => {
    return watchCity ? findById(cities, watchCity) : null;
  }, [cities, watchCity]);
  const selectedArea = useMemo(() => {
    return selectedCity ? findById(selectedCity?.Areas, watchArea) : null;
  }, [watchArea, selectedCity]);

  // Update city & area values depending on selected store in case of map
  useEffect(() => {
    if (EnableAddressMapLocation) {
      if (selectedStore) {
        if (selectedStore?.IsItBusy && !selectedStore?.IfItBusyIsItAvailable)
          return;

        form.setValue("CityID", selectedStore?.CityID);
        form.setValue("AreaID", selectedStore?.AreaID);
      } else {
        form.setValue("CityID", "");
        form.setValue("AreaID", "");
      }
    }
  }, [selectedStore, form, EnableAddressMapLocation]);

  useEffect(() => {
    if (EnableAddressMapLocation) {
      if (orderLocation) {
        if (orderLocation?.lng && orderLocation?.lat) {
          setSelectedMapLocation({
            lat: orderLocation?.lat,
            lng: orderLocation?.lng,
          });

          orderLocation?.cityId &&
            form.setValue("CityID", orderLocation?.cityId);
          orderLocation?.areaId &&
            form.setValue("AreaID", orderLocation?.areaId);
        } else {
          setSelectedMapLocation(undefined);
          form.setValue("CityID", "");
          form.setValue("AreaID", "");
        }
      }
    }
  }, [orderLocation, form, EnableAddressMapLocation]);

  // useEffect(() => {
  //   if (EnableAddressMapLocation) {
  //     if (form?.formState?.errors?.CityID || form?.formState?.errors?.AreaID) {
  //       toaster.error({
  //         message:
  //           form?.formState?.errors?.CityID?.message ??
  //           form?.formState?.errors?.AreaID?.message,
  //       });
  //     }
  //   }
  // }, [EnableAddressMapLocation, form?.formState]);

  const MapFailCallBack = useCallback(() => {
    form.setValue("CityID", "");
    form.setValue("AreaID", "");
  }, [form]);

  return (
    <Form {...form}>
      <form
        className="w-full"
        id={elementsIds.deliveryForm}
        onSubmit={form.handleSubmit((data) =>
          handleGuestDeliveryWithSelect(data, selectedMapLocation),
        )}
        noValidate
      >
        {EnableAddressMapLocation && (
          <div className="w-full">
            <div className="relative">
              <StoreMap
                locale={locale}
                zoom={zoom}
                center={mapCenter}
                selectedMapLocation={selectedMapLocation}
                setSelectedMapLocation={setSelectedMapLocation}
                setSelectedStore={setSelectedStore}
                failCB={MapFailCallBack}
                userLocation={userLocation}
                resources={{
                  detectMyCurrentLocation: resources["detectMyCurrentLocation"],
                  pleaseAllowAccessToYourLocation:
                    resources["pleaseAllowAccessToYourLocation"],
                }}
              />
            </div>

            {(form?.formState?.errors?.CityID ||
              form?.formState?.errors?.AreaID) && (
              <p className="mt-1 text-sm text-alt">
                {form?.formState?.errors?.CityID?.message ??
                  form?.formState?.errors?.AreaID?.message}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          {EnableAddressMapLocation ? (
            <>
              <div
                className={cn(
                  "flex h-10 w-full select-none items-center rounded border border-gray-200 px-4 text-gray-500",
                  {
                    "cursor-not-allowed opacity-70": !!selectedCity?.Name,
                  },
                )}
              >
                {selectedCity?.Name
                  ? selectedCity?.Name
                  : resources["selectCity"]}
              </div>

              <div
                className={cn(
                  "flex h-10 w-full select-none items-center rounded border border-gray-200 px-4 text-gray-500",
                  {
                    "cursor-not-allowed opacity-70": !!selectedArea?.Name,
                  },
                )}
              >
                {selectedArea?.Name
                  ? selectedArea?.Name
                  : resources["selectArea"]}
              </div>
            </>
          ) : (
            <>
              <div>
                <FormField
                  control={form.control}
                  name="CityID"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        disabled={EnableAddressMapLocation}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={resources["selectCity"]}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {cities?.map((item: CityProps) => (
                            <SelectItem key={item.ID} value={item.ID}>
                              {item.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!EnableAddressMapLocation && <FormMessage />}
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="AreaID"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <Select
                        value={field.value}
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        disabled={EnableAddressMapLocation || !selectedCity}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={resources["selectArea"]}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {selectedCity?.Areas?.map((item) => (
                            <SelectItem key={item.ID} value={item.ID}>
                              {item.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <div>
            <FormField
              control={form.control}
              name="Block"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Block"
                      type="text"
                      label={resources["block"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="Street"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Street"
                      type="text"
                      label={resources["street"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="Building"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Building"
                      type="text"
                      label={resources["building"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="Floor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Floor"
                      type="text"
                      label={resources["floor"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="Apartment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Apartment"
                      type="text"
                      label={resources["apartment"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="Landmark"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Landmark"
                      type="text"
                      label={resources["landmark"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <div>
            <FormField
              control={form.control}
              name="Instructions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Instructions"
                      type="text"
                      label={resources["instructions"]}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </div>
      </form>
    </Form>
  );
}
