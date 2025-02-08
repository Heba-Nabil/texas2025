import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/solid";
import useAddresses from "@/hooks/useAddresses";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { findById } from "@/utils";
import { useData } from "@/providers/DataProvider";
import { elementsIds } from "@/utils/constants";
import EditIcon from "@/components/icons/EditIcon";
// Types
import { UserAddressProps } from "@/types/api";

type UserDeliveryWithAddressesProps = {
  handleDeliveryWithUserAddresses: (
    data: UserAddressProps | undefined,
  ) => Promise<void>;
};

export default function UserDeliveryWithAddresses(
  props: UserDeliveryWithAddressesProps,
) {
  const { handleDeliveryWithUserAddresses } = props;

  const t = useTranslations();
  const locale = useLocale();

  const {
    Cities,
    Data: { EnableAddressMapLocation },
  } = useData();

  const { data: userAddresses, getAddressById } = useAddresses(locale, true);

  const {
    orderLocation: { addressId },
  } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    values: {
      addressId: addressId ? addressId : "",
    },
  });

  const handleAddNewAddress = () => {
    const addAddressCallBack = (addressId: string) => {
      addressId && setValue("addressId", addressId);
    };

    dispatch(
      toggleModal({
        addressModal: { isOpen: true, data: null, cb: addAddressCallBack },
      }),
    );
  };

  const toggleAddressModalWithEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleModal({ addressModal: { isOpen: true, data: { AddressID: id } } }),
    );
  };

  return (
    <form
      className="w-full"
      id={elementsIds.deliveryForm}
      onSubmit={handleSubmit((data) =>
        handleDeliveryWithUserAddresses(getAddressById(data?.addressId)),
      )}
      noValidate
    >
      <button
        type="button"
        className="flex-center my-5 w-full gap-1 rounded-lg bg-gray-100 py-5 text-lg text-alt"
        onClick={handleAddNewAddress}
      >
        <PlusIcon className="size-4" /> {t("addAddress")}
      </button>

      {errors?.addressId?.message && (
        <span className="my-1 block capitalize text-alt">
          {errors?.addressId?.message}
        </span>
      )}

      {userAddresses && userAddresses?.length > 0 && (
        <ul className="w-full">
          {userAddresses?.map((item) => (
            <li key={item.ID} className="border-b py-5">
              <div className="flex w-full items-start gap-3">
                <button
                  type="button"
                  className="shrink-0 text-main"
                  aria-label="edit address"
                  onClick={(e) => toggleAddressModalWithEdit(e, item?.ID)}
                >
                  <EditIcon className="size-7" />
                </button>

                <label
                  htmlFor={`user_address_${item.ID}`}
                  className="flex flex-grow cursor-pointer gap-3"
                >
                  <div className="flex flex-grow items-start gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {
                          findById(Cities, item.CityID)?.Areas?.find(
                            (area) => area.ID === item.AreaID,
                          )?.Name
                        }
                        , {findById(Cities, item.CityID)?.Name}
                      </h3>
                      <p className="text-sm leading-none text-gray-500">
                        {item.Apartment} - {item.Floor} - {item.Building} -
                        {item.Block} - {item.Street}, {item.Landmark}
                      </p>
                    </div>
                    {/* {item.Id === userDefaultAddress && (
                      <span className="shrink-0 rounded-full bg-main/50 px-4 py-1 text-center text-sm leading-none text-alt">
                        {t("default")}
                      </span>
                    )} */}
                  </div>

                  <div className="relative mx-3 shrink-0">
                    <input
                      className="peer sr-only"
                      type="radio"
                      id={`user_address_${item.ID}`}
                      value={item.ID}
                      {...register("addressId", {
                        required: {
                          value: true,
                          message: t("addressRequired"),
                        },
                      })}
                    />
                    <div className="flex-center smooth aspect-square w-6 shrink-0 rounded-full border border-gray-200 peer-checked:border-none peer-checked:bg-main">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-current text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>

              {EnableAddressMapLocation &&
                (!item.Latitude || !item.Longitude) && (
                  <p className="mt-1 text-sm text-alt">
                    {t("missingGeoLocation")}
                  </p>
                )}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
