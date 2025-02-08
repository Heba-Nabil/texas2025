import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import { useData } from "@/providers/DataProvider";
import { userAddressWithSelectSchema } from "@/utils/formSchema";
import { elementsIds } from "@/utils/constants";
import { findById } from "@/utils";
import { defaultStartInputIconClassNames } from "@/utils/classNames";
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
import { CityProps, UserAddressProps } from "@/types/api";
import { AddressesModalResourcesProps } from "@/types/resources";
import { AddressWithSelectForm } from "@/types";

type AddressesWithSelectProps = {
  currentAddress: UserAddressProps | undefined;
  userPhone: string;
  phoneRegex: string;
  resources: AddressesModalResourcesProps;
  locale: string;
  cities: CityProps[];
  handleAddAddressFromSelect: (
    values: AddressWithSelectForm,
    form: any,
  ) => Promise<void>;
  handleEditAddressFromSelect: (
    values: AddressWithSelectForm,
    form: any,
    id: string,
  ) => Promise<void>;
};

export default function AddressesWithSelect(props: AddressesWithSelectProps) {
  const {
    currentAddress,
    userPhone,
    phoneRegex,
    resources,
    locale,
    cities,
    handleAddAddressFromSelect,
    handleEditAddressFromSelect,
  } = props;

  const {
    FlagURL,
    Data: { CountryPhoneCode },
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
      const formSchema = await userAddressWithSelectSchema(
        resources,
        phoneRegex,
      );

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const [watchCity, phoneValue] = form.watch(["CityID", "Phone"]);

  useEffect(() => {
    if (!phoneValue.startsWith(CountryPhoneCode)) {
      form.setValue("Phone", CountryPhoneCode);
    }
  }, [form, CountryPhoneCode, phoneValue]);

  const selectedCity = useMemo(() => {
    return watchCity ? findById(cities, watchCity) : null;
  }, [cities, watchCity]);

  return (
    <Form {...form}>
      <form
        className="w-full"
        id={elementsIds.addressWithSelect}
        onSubmit={form.handleSubmit((data) =>
          currentAddress
            ? handleEditAddressFromSelect(data, form, currentAddress?.ID)
            : handleAddAddressFromSelect(data, form),
        )}
        noValidate
      >
        <div className="grid grid-cols-2 gap-4">
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
                    disabled={!selectedCity}
                    onValueChange={field.onChange}
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
          </div>

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
