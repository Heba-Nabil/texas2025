import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { userAddressWithMapSchema } from "@/utils/formSchema";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
import { elementsIds } from "@/utils/constants";
import { findById } from "@/utils";
import cn from "@/utils/cn";
import { toaster } from "@/components/global/Toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import StoreMap from "./StoreMap";
// Types
import { CityProps, StoreProps, UserAddressProps } from "@/types/api";
import { AddressesModalResourcesProps } from "@/types/resources";
import { AddressWithSelectForm, MapPositionProps } from "@/types";

type AddressesWithMapFormProps = {
  currentAddress: UserAddressProps | undefined;
  userPhone: string;
  phoneRegex: string;
  resources: AddressesModalResourcesProps;
  locale: string;
  cities: CityProps[];
  zoom: number;
  mapCenter: MapPositionProps;
  selectedMapLocation: MapPositionProps | undefined;
  setSelectedMapLocation: React.Dispatch<
    React.SetStateAction<MapPositionProps | undefined>
  >;
  handleAddAddressFromMap: (
    values: AddressWithSelectForm,
    form: any,
  ) => Promise<void>;
  handleEditAddressFromMap: (
    values: AddressWithSelectForm,
    form: any,
    id: string,
  ) => Promise<void>;
};

export default function AddressesWithMapForm(props: AddressesWithMapFormProps) {
  const {
    currentAddress,
    userPhone,
    phoneRegex,
    resources,
    locale,
    cities,
    mapCenter,
    zoom,
    selectedMapLocation,
    setSelectedMapLocation,
    handleAddAddressFromMap,
    handleEditAddressFromMap,
  } = props;

  const [selectedStore, setSelectedStore] = useState<StoreProps>();

  const {
    FlagURL,
    Data: { CountryPhoneCode, EnableAddressMapLocation },
  } = useData();

  const defaultValues = {
    Phone: currentAddress?.Phone ? currentAddress?.Phone : userPhone,
    CityID: currentAddress?.CityID ? currentAddress?.CityID : "",
    AreaID: currentAddress?.AreaID ? currentAddress?.AreaID : "",
    Block: currentAddress?.Block ? currentAddress?.Block : "",
    Street: currentAddress?.Street ? currentAddress?.Street : "",
    Building: currentAddress?.Building ? currentAddress?.Building : "",
    Floor: currentAddress?.Floor ? currentAddress?.Floor : "",
    Apartment: currentAddress?.Apartment ? currentAddress?.Apartment : "",
    Landmark: currentAddress?.Landmark ? currentAddress?.Landmark : "",
    // Instructions: currentAddress?.Instructions
    //   ? currentAddress?.Instructions
    //   : "",
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await userAddressWithMapSchema(resources, phoneRegex);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const phoneValue = form.watch("Phone");

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("Phone", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const [selectedCity, setSelectedCity] = useState(
    currentAddress ? findById(cities, currentAddress?.CityID) : null,
  );
  const [selectedArea, setSelectedArea] = useState(
    currentAddress && selectedCity
      ? findById(selectedCity?.Areas, currentAddress?.AreaID)
      : null,
  );

  useEffect(() => {
    if (selectedStore) {
      setSelectedCity(findById(cities, selectedStore?.CityID));
    }
  }, [selectedStore, cities]);

  useEffect(() => {
    if (selectedStore && selectedCity) {
      setSelectedArea(findById(selectedCity?.Areas, selectedStore?.AreaID));
    }
  }, [selectedStore, cities, selectedCity]);

  useEffect(() => {
    if (selectedStore) {
      form.setValue("CityID", selectedStore?.CityID);
      form.setValue("AreaID", selectedStore?.AreaID);
    } else {
      form.setValue("CityID", "");
      form.setValue("AreaID", "");
    }
  }, [selectedStore, form]);

  useEffect(() => {
    if (currentAddress) {
      if (currentAddress?.Longitude && currentAddress?.Latitude) {
        setSelectedMapLocation({
          lat: currentAddress.Latitude,
          lng: currentAddress.Longitude,
        });

        form.setValue("CityID", currentAddress?.CityID);
        form.setValue("AreaID", currentAddress?.AreaID);
      } else {
        setSelectedMapLocation(undefined);
        form.setValue("CityID", "");
        form.setValue("AreaID", "");
      }
    }
  }, [currentAddress, setSelectedMapLocation, form]);

  const MapFailCallBack = () => {
    setSelectedCity(null);
    setSelectedArea(null);
    form.setValue("CityID", "");
    form.setValue("AreaID", "");
  };

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

    EnableAddressMapLocation && geoLocation();
  }, [EnableAddressMapLocation]);

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

  return (
    <Form {...form}>
      <form
        className="w-full"
        id={elementsIds.addressWithSelect}
        onSubmit={form.handleSubmit((data) =>
          currentAddress
            ? handleEditAddressFromMap(data, form, currentAddress?.ID)
            : handleAddAddressFromMap(data, form),
        )}
        noValidate
      >
        <div className="mb-6 w-full">
          <div className="relative">
            <StoreMap
              locale={locale}
              zoom={zoom}
              center={mapCenter}
              selectedMapLocation={selectedMapLocation}
              setSelectedMapLocation={setSelectedMapLocation}
              setSelectedStore={setSelectedStore}
              failCB={MapFailCallBack}
              resources={{
                detectMyCurrentLocation: resources["detectMyCurrentLocation"],
                pleaseAllowAccessToYourLocation:
                  resources["pleaseAllowAccessToYourLocation"],
              }}
              userLocation={userLocation}
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

        <div className="grid grid-cols-2 gap-4">
          <div
            className={cn(
              "flex h-10 w-full select-none items-center rounded border border-gray-200 px-4 text-gray-500",
              {
                "cursor-not-allowed opacity-70": !!selectedCity?.Name,
              },
            )}
          >
            {selectedCity?.Name ? selectedCity?.Name : resources["selectCity"]}
          </div>

          <div
            className={cn(
              "flex h-10 w-full select-none items-center rounded border border-gray-200 px-4 text-gray-500",
              {
                "cursor-not-allowed opacity-70": !!selectedArea?.Name,
              },
            )}
          >
            {selectedArea?.Name ? selectedArea?.Name : resources["selectArea"]}
          </div>

          {/* <div>
            <FormField
              control={form.control}
              name="CityID"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["selectCity"]} />
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

                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          {/* <div>
            <FormField
              control={form.control}
              name="AreaID"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                    disabled={true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={resources["selectArea"]} />
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
          </div> */}

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

          <div>
            <FormField
              control={form.control}
              name="Phone"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      id="Phone"
                      type="tel"
                      label={resources["phone"]}
                      startIcon={
                        <span className={defaultStartInputIconClassNames()}>
                          {FlagURL?.trim() && (
                            <img
                              src={FlagURL?.trim()}
                              alt="flag"
                              width={24}
                              height={24}
                              loading="lazy"
                              className="size-6 max-w-full shrink-0 object-contain"
                            />
                          )}
                        </span>
                      }
                      value={value}
                      onChange={(e) => {
                        onChange(
                          new AsYouType()
                            .input(e.target.value)
                            .replace(/\s+/g, ""),
                        );
                      }}
                      {...rest}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
