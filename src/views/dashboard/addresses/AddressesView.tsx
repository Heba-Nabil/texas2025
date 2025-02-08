"use client";

import useAddresses from "@/hooks/useAddresses";
import { useData } from "@/providers/DataProvider";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import EmptyAddresses from "@/components/emptyStates/EmptyAddresses";
import AddressItem from "@/components/items/AddressItem";
import { Button } from "@/components/ui/button";
// Types
import { UserAddressProps } from "@/types/api";
import { UserAddressesPageResourcesProps } from "@/types/resources";

type AddressesViewProps = {
  locale: string;
  data?: UserAddressProps[] | null;
  resources: UserAddressesPageResourcesProps;
};

export default function AddressesView(props: AddressesViewProps) {
  const { locale, data: initialData, resources } = props;

  const { data } = useAddresses(locale, true, initialData);

  const {
    Cities,
    Data: { EnableAddressMapLocation },
  } = useData();

  const dispatch = useAppDispatch();

  const toggleAddressModalWithAdd = () => {
    dispatch(
      toggleModal({ addressModal: { isOpen: true, data: null, cb: null } }),
    );
  };

  const toggleAddressModalWithEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleModal({
        addressModal: { isOpen: true, data: { AddressID: id }, cb: null },
      }),
    );
  };

  return (
    <DashBoardPagesWrapper label={resources["myAddresses"]}>
      <div className="overflow-y-auto">
        <div className="flex flex-grow px-5">
          {data && data?.length > 0 ? (
            <div className="mb-4 flex max-h-[70vh] w-full flex-col overflow-y-auto">
              {data?.map((item) => (
                <AddressItem
                  key={item.ID}
                  data={item}
                  cities={Cities}
                  resources={{
                    phone: resources["phone"],
                    missingGeoLocation: resources["missingGeoLocation"],
                  }}
                  EnableAddressMapLocation={EnableAddressMapLocation}
                  toggleAddressModalWithEdit={toggleAddressModalWithEdit}
                />
              ))}
            </div>
          ) : (
            <EmptyAddresses
              resources={{
                noAddresses: resources["noAddresses"],
                noAddressesDesc: resources["noAddressesDesc"],
              }}
            />
          )}
        </div>

        <div className="px-5">
          <Button
            type="button"
            className="w-full"
            onClick={toggleAddressModalWithAdd}
          >
            {resources["addAddress"]}
          </Button>
        </div>
      </div>
    </DashBoardPagesWrapper>
  );
}
