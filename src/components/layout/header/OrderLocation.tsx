import { ChevronDownIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import cn from "@/utils/cn";
// Types
import { CityProps, OrderTypeProps, StoreProps } from "@/types/api";

type OrderLocationProps = {
  selectedOrderType: OrderTypeProps | undefined;
  selectedStore: StoreProps | undefined;
  selectedCity: CityProps | undefined;
  areaId?: string;
  resources: {
    change: string;
    findStore: string;
  };
  handleClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => void;
};

export default function OrderLocation(props: OrderLocationProps) {
  const {
    selectedOrderType,
    selectedStore,
    selectedCity,
    areaId,
    resources,
    handleClick,
  } = props;

  const selectedArea = selectedCity?.Areas?.find((item) => item.ID === areaId);

  return (
    <Button
      variant="link"
      className={cn("p-0 text-dark", {
        "h-auto w-fit flex-wrap text-start text-sm": selectedStore,
        "w-fit": !selectedStore,
      })}
      onClick={(e) => handleClick(e, selectedOrderType?.ID!)}
    >
      {selectedStore ? (
        <span className="flex flex-grow flex-wrap items-center gap-1">
          <span className="flex items-center">
            <MapPinIcon className="size-5 shrink-0" />
            <span className="shrink-0 text-alt">
              {selectedOrderType?.Name}:
            </span>{" "}
          </span>

          <span className="flex flex-grow items-center gap-1 whitespace-normal capitalize text-gray-500">
            {selectedOrderType?.IsStoreDependent && selectedStore?.Name
              ? selectedStore?.Name + " - "
              : ""}
            {!selectedOrderType?.IsStoreDependent && selectedArea
              ? selectedArea?.Name + " - "
              : ""}
            {selectedCity?.Name ? selectedCity?.Name : ""}
            <span className="flex-center ms-1 shrink-0 gap-1 rounded-md bg-main px-2 text-center text-dark">
              {resources["change"]} <ChevronDownIcon className="size-4" />
            </span>
          </span>
        </span>
      ) : (
        <>
          <MapPinIcon className="size-5 shrink-0" /> {resources["findStore"]}
        </>
      )}
    </Button>
  );
}
