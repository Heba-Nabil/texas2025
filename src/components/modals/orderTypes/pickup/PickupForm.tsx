"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { elementsIds } from "@/utils/constants";
import {
  findById,
  getCityStores,
  getDateInHours,
  refineDataById,
} from "@/utils";
import cn from "@/utils/cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PickupMap from "./PickupMap";
// Types
import { OrderTypeProps, StoreProps } from "@/types/api";
import { OrderTypesModalResourcesProps } from "@/types/resources";
import { SelectPickupOrderDataProps } from "@/types";

type StoreDependentProps = {
  resources: OrderTypesModalResourcesProps;
  locale: string;
  orderTypeData: OrderTypeProps;
  defaultCityId: string | undefined;
  defaultStoreId: string | undefined;
  zoom: number;
  handlePickupSubmit: (data: SelectPickupOrderDataProps) => void;
  setAcceptBusy: (status: boolean) => void;
  setBusyStoreModal: (data: StoreProps | null) => void;
};

export default function PickupForm(props: StoreDependentProps) {
  const {
    resources,
    locale,
    orderTypeData,
    defaultCityId,
    defaultStoreId,
    zoom,
    handlePickupSubmit,
    setAcceptBusy,
    setBusyStoreModal,
  } = props;

  const formSchema = z.object({
    city: z
      .string({ required_error: resources["cityRequired"] })
      .min(1, resources["cityRequired"]),
    store: z
      .string({ required_error: resources["branchRequired"] })
      .min(1, resources["branchRequired"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      city: defaultCityId ? defaultCityId : "",
      store: defaultStoreId ? defaultStoreId : "",
    },
  });

  const [watchCity, watchStore] = form.watch(["city", "store"]);

  const cityStores = useMemo(() => {
    return refineDataById(getCityStores(orderTypeData?.Cities, watchCity));
  }, [orderTypeData?.Cities, watchCity]);

  const selectedCity = useMemo(() => {
    return watchCity ? findById(orderTypeData?.Cities, watchCity) : null;
  }, [orderTypeData?.Cities, watchCity]);

  const selectedStore = useMemo(() => {
    return watchStore ? findById(cityStores, watchStore) : null;
  }, [cityStores, watchStore]);

  const handleBranchChange = (value: string) => {
    const store = findById(cityStores, value);

    if (store?.IsItBusy) {
      setBusyStoreModal(store);
    } else {
      setAcceptBusy(true);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
        id={elementsIds.pickupFormSelect}
        method="POST"
        onSubmit={form.handleSubmit(handlePickupSubmit)}
      >
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>{resources["selectCity"]}</FormLabel>
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
                      {orderTypeData?.Cities?.map((item) => (
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

          <div className="flex-1">
            <div>
              <FormField
                control={form.control}
                name="store"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel>{resources["selectBranch"]}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: string) => {
                        field.onChange(value);

                        handleBranchChange(value);
                      }}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      disabled={!watchCity}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {selectedStore
                            ? selectedStore?.Name
                            : resources["selectBranch"]}
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {cityStores?.map((item) => (
                          <SelectItem
                            key={item.ID}
                            value={item.ID}
                            className={cn({
                              "cursor-default bg-gray-100": item.IsItBusy,
                            })}
                          >
                            <span>
                              {/* <span className="w-full"></span> */}
                              <span className="block font-semibold">
                                {item.Name}
                                {item.IsItBusy && (
                                  <span className="ms-2 rounded bg-alt px-1 py-0.5 text-[10px] font-normal capitalize text-alt-foreground">
                                    {item.IfItBusyIsItAvailable
                                      ? resources["busy"]
                                      : resources["notAvailable"]}
                                  </span>
                                )}
                              </span>

                              <span className="text-xs">
                                <span className="text-alt">
                                  {resources["from"]}
                                </span>{" "}
                                {getDateInHours(item?.WorkingHoursFrom, locale)}{" "}
                                <span className="text-alt">
                                  {resources["to"]}
                                </span>{" "}
                                {getDateInHours(item?.WorkingHoursTo, locale)}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {selectedStore && (
          <div className="mt-3">
            <PickupMap store={selectedStore} zoom={zoom} />
          </div>
        )}

        {selectedStore && (
          <div className="mt-2 text-sm">
            <p className="flex gap-1">
              <span className="shrink-0 font-bold text-alt">
                {orderTypeData?.Name} {resources["at"]}:
              </span>
              <span>
                {selectedStore?.Address} -{selectedStore?.Name} -{" "}
                {selectedCity?.Name}
              </span>
            </p>

            <p className="flex gap-1">
              <span className="shrink-0 font-bold text-alt">
                {resources["workingHours"]}:
              </span>
              <span>
                {resources["from"]}{" "}
                <span className="font-semibold">
                  {getDateInHours(selectedStore?.WorkingHoursFrom, locale)}
                </span>{" "}
                {resources["to"]}{" "}
                <span className="font-semibold">
                  {getDateInHours(selectedStore?.WorkingHoursTo, locale)}
                </span>
              </span>
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
