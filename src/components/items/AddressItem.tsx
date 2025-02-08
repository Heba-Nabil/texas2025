import { TrashIcon } from "@heroicons/react/24/solid";
import EditIcon from "@/components/icons/EditIcon";
// Types
import { CityProps, UserAddressProps } from "@/types/api";
import { findById } from "@/utils";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";

type AddressItemProps = {
  data: UserAddressProps;
  cities: CityProps[];
  resources: {
    phone: string;
    missingGeoLocation: string;
  };
  EnableAddressMapLocation: boolean;
  toggleAddressModalWithEdit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => void;
};

export default function AddressItem(props: AddressItemProps) {
  const {
    data,
    cities,
    resources,
    EnableAddressMapLocation,
    toggleAddressModalWithEdit,
  } = props;

  const selectedCity = findById(cities, data?.CityID);
  const selectedArea = selectedCity
    ? findById(selectedCity?.Areas, data?.AreaID)
    : null;

  const dispatch = useAppDispatch();

  const triggerDeleteAddress = () => {
    dispatch(
      toggleModal({
        deleteAddressModal: { isOpen: true, data: { AddressID: data?.ID } },
      }),
    );
  };

  return (
    <div className="border-b py-3">
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="delete address"
          title="delete address"
          className="flex-center smooth size-10 shrink-0 rounded-full bg-gray-100 text-slate-600 hover:text-alt"
          onClick={triggerDeleteAddress}
        >
          <TrashIcon className="size-5" />
        </button>

        <div className="flex flex-grow items-start gap-3">
          <div>
            <h3 className="text-lg font-semibold">
              {selectedArea?.Name}, {selectedCity?.Name}
            </h3>

            <p className="text-sm leading-none text-gray-500">
              {data?.Apartment} - {data?.Floor} - {data?.Building} -{" "}
              {data?.Block} - {data?.Street} - {data?.Landmark}
            </p>

            {/* <p className="text-sm leading-none text-gray-500">
              {data?.Instructions}
            </p> */}

            <p className="mt-1 text-sm leading-none text-gray-500">
              <span className="text-alt">{resources["phone"]}:</span>{" "}
              {data?.Phone}
            </p>
          </div>

          {/* {data.Id === userDefaultAddress && (
          <span className="rounded-full bg-main/50 px-4 py-1 text-center text-sm leading-none text-alt">
            {t("default")}
          </span>
        )} */}
        </div>

        <button
          type="button"
          className="mx-1 shrink-0 text-main"
          aria-label="edit address"
          title="edit address"
          onClick={(e) => toggleAddressModalWithEdit(e, data?.ID)}
        >
          <EditIcon className="size-7" />
        </button>
      </div>

      {EnableAddressMapLocation && (!data?.Longitude || !data?.Latitude) && (
        <p className="mt-1 text-sm text-alt">
          {resources["missingGeoLocation"]}
        </p>
      )}
    </div>
  );
}
