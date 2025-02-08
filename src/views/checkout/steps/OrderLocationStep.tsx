import { Dispatch, memo, SetStateAction } from "react";
import { useData } from "@/providers/DataProvider";
import useAddresses from "@/hooks/useAddresses";
import { useAppDispatch } from "@/store/hooks";
import {
  setActiveOrderType,
  toggleModal,
} from "@/store/features/global/globalSlice";
import { findById, getDateInHours } from "@/utils";
import { Button } from "@/components/ui/button";
// Types
import { OrderLocationProps } from "@/types";
import { CheckoutResponseProps } from "@/types/api";

type OrderLocationTypeProps = {
  locale: string;
  resources: {
    change: string;
    from: string;
    to: string;
    workingHours: string;
    phone: string;
  };
  orderTypeID: string | undefined;
  orderLocation: OrderLocationProps;
  handleRollBack: () => Promise<void | CheckoutResponseProps | null>;
  checkoutResponse: CheckoutResponseProps | null;
  setCheckoutResponse: Dispatch<SetStateAction<CheckoutResponseProps | null>>;
};

function OrderLocationStep(props: OrderLocationTypeProps) {
  const {
    locale,
    resources,
    orderTypeID,
    orderLocation,
    handleRollBack,
    checkoutResponse,
    setCheckoutResponse,
  } = props;

  const addressId = orderLocation?.addressId;

  const { data: userAddresses } = useAddresses(locale, !!addressId);

  const userAddress = userAddresses
    ? userAddresses?.find((item) => item.ID === addressId)
    : undefined;

  const {
    OrderTypes,
    Data: { IsCartOrderTypeRequired },
  } = useData();

  const dispatch = useAppDispatch();

  const selectedOrderType = findById(OrderTypes, orderTypeID!),
    selectedCity = selectedOrderType
      ? findById(selectedOrderType?.Cities, orderLocation?.cityId!)
      : undefined,
    selectedStore = selectedCity
      ? findById(selectedCity?.Stores, orderLocation?.storeId!)
      : undefined;

  const isDelivery = !selectedOrderType?.IsStoreDependent;

  const address = isDelivery
    ? `${orderLocation?.apartment} - ${orderLocation?.floor} - ${orderLocation?.building} - ${orderLocation?.block} - ${orderLocation?.street} - ${orderLocation?.landmark}`
    : `${selectedStore?.Address}, ${selectedStore?.Name}`;

  const handleOrderLocation = async () => {
    dispatch(setActiveOrderType(orderTypeID!));
    if (checkoutResponse?.OrderNumber) {
      await handleRollBack();
      setCheckoutResponse(null);
    }
    dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));
  };

  return (
    <div className="flex-between my-4 gap-1">
      <div className="flex items-center gap-3">
        {selectedOrderType && (
          <img
            src={selectedOrderType?.IconURL}
            alt={selectedOrderType?.Name}
            width={50}
            height={50}
            className="w-15 aspect-square rounded-full border-2 border-main object-contain"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold capitalize">
            {selectedOrderType?.Name}
          </h2>

          <p className="flex flex-grow items-center gap-1 whitespace-normal capitalize text-gray-500">
            {address}
          </p>

          {userAddress?.Phone && (
            <p className="text-sm">
              <span className="font-semibold">{resources["phone"]}</span> :{" "}
              <span>{userAddress?.Phone}</span>
            </p>
          )}

          {selectedStore && (
            <p className="text-sm">
              <span className="font-semibold">{resources["workingHours"]}</span>
              : <span className="text-alt">{resources["from"]}</span>{" "}
              {getDateInHours(selectedStore?.WorkingHoursFrom, locale)}{" "}
              <span className="text-alt">{resources["to"]}</span>{" "}
              {getDateInHours(selectedStore?.WorkingHoursTo, locale)}
            </p>
          )}
        </div>
      </div>
      {!IsCartOrderTypeRequired && (
        <Button variant="dark" onClick={handleOrderLocation}>
          {resources["change"]}
        </Button>
      )}
    </div>
  );
}

export default memo(OrderLocationStep);
