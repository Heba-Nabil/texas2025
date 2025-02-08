import { useAppSelector } from "@/store/hooks";
import { getClientSession } from "@/store/features/auth/authSlice";
import UserDeliveryWithAddresses from "./UserDeliveryWithAddresses";
import GuestDelivery from "./GuestDelivery";
// Types
import { CityProps, StoreProps, UserAddressProps } from "@/types/api";
import { GuestDeliveryOrderTypeFormProps, MapPositionProps } from "@/types";

type DeliveryWrapperProps = {
  EnableAddressMapLocation: boolean;
  cities: CityProps[];
  zoom: number;
  countryCenter: MapPositionProps;
  handleDeliveryWithUserAddresses: (
    data: UserAddressProps | undefined,
  ) => Promise<void>;
  handleGuestDeliveryWithSelect: (
    values: GuestDeliveryOrderTypeFormProps,
    selectedMapLocation?: MapPositionProps,
  ) => Promise<void>;
  setBusyStoreModal: React.Dispatch<React.SetStateAction<StoreProps | null>>;
  userLocation: MapPositionProps | undefined;
};

export default function DeliveryWrapper(props: DeliveryWrapperProps) {
  const {
    EnableAddressMapLocation,
    cities,
    zoom,
    countryCenter,
    handleDeliveryWithUserAddresses,
    handleGuestDeliveryWithSelect,
    setBusyStoreModal,
    userLocation,
  } = props;

  const { isUser } = useAppSelector(getClientSession);

  if (isUser)
    return (
      <UserDeliveryWithAddresses
        handleDeliveryWithUserAddresses={handleDeliveryWithUserAddresses}
      />
    );

  return (
    <GuestDelivery
      EnableAddressMapLocation={EnableAddressMapLocation}
      cities={cities}
      zoom={zoom}
      countryCenter={countryCenter}
      handleGuestDeliveryWithSelect={handleGuestDeliveryWithSelect}
      setBusyStoreModal={setBusyStoreModal}
      userLocation={userLocation}
    />
  );
}
