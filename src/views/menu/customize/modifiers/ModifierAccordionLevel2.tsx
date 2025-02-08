import { PlusIcon } from "@heroicons/react/24/solid";
// import cn from "@/utils/cn";
import ModifierAccordionLevel1 from "./ModifierAccordionLevel1";
import PlusMinusItem from "@/components/items/PlusMinusItem";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// Types
import { ModifierItemProps } from "@/types/api";
import { MenuItemPageResourcesProps } from "@/types/resources";
import { DisplayModeEnum } from "@/types/enums";
import { MenuItemActionProp } from "@/types";

type ModifierAccordionProps = {
  data: ModifierItemProps;
  resources: MenuItemPageResourcesProps;
  currency: string;
  parentData: {
    ID: string;
    DisplayModeID: number;
    NameUnique: string;
    MinQuantity: number;
    MaxQuantity: number;
  };
  remain: number;
  handleRadioButton: MenuItemActionProp;
  handleCheckBox: MenuItemActionProp;
  handleAddOption: MenuItemActionProp;
  handleAddWithToggle: MenuItemActionProp;
};

export default function ModifierAccordionLevel2(props: ModifierAccordionProps) {
  const {
    data,
    resources,
    currency,
    parentData: { DisplayModeID, NameUnique, ID, MinQuantity, MaxQuantity },
    remain,
    handleRadioButton,
    handleCheckBox,
    handleAddOption,
    handleAddWithToggle,
  } = props;

  const hasDiscount = data?.PriceAfterDiscount !== data?.ExtraPrice;

  // Add +
  const handleAddIncrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) >= item?.MaxQuantity || remain <= 0)
      return;

    handleAddOption(item?.ID, ID, (item?.SelectedQuantity ?? 0) + 1);
  };
  // Add -
  const handleAddDecrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) <= item?.MinQuantity) return;

    handleAddOption(item?.ID, ID, (item?.SelectedQuantity ?? 0) - 1);
  };

  // Add with Toggle +
  const handleAddWithToggleIncrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) >= item?.MaxQuantity) return;

    handleAddWithToggle(item?.ID, ID, (item?.SelectedQuantity ?? 0) + 1);
  };
  // Add with Toggle -
  const handleAddWithToggleDecrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) <= item?.MinQuantity) return;

    handleAddWithToggle(item?.ID, ID, (item?.SelectedQuantity ?? 0) - 1);
  };

  return (
    <div className="w-full bg-gray-100 px-4">
      {DisplayModeID === DisplayModeEnum.radio ? (
        <label
          className="flex w-full cursor-pointer items-center gap-1"
          htmlFor={data?.ID}
        >
          <div className="flex-between flex-grow gap-1">
            <div className="flex items-center gap-1">
              <div className="relative">
                {hasDiscount && data?.IsDiscountViewPercentage && (
                  <div className="flex-center relative top-1 z-10 gap-1 rounded bg-alt px-2 text-xs text-white">
                    <img src="/images/icons/texas-star.svg" alt="off" />
                    <span className="uppercase">
                      {data?.DiscountPercentage}% {resources["off"]}
                    </span>
                  </div>
                )}

                <img
                  src={data?.IconURL}
                  alt={data?.Name}
                  width={50}
                  height={50}
                  loading="lazy"
                  className="aspect-square shrink-0 object-contain"
                />
              </div>

              <div className="flex-grow text-start">
                <h3 className="text-lg font-semibold capitalize leading-none text-[#6a6a6a]">
                  {data.Name?.toLowerCase()}{" "}
                  {/* <span className="ms-0.5 text-xs font-normal text-main-foreground">
              ({data?.DefaultQuantity})
            </span> */}
                </h3>

                {data?.Description?.trim() && (
                  <p className="text-sm leading-tight text-gray-500">
                    {data?.Description}
                  </p>
                )}
              </div>
            </div>

            {data?.PriceAfterDiscount > 0 &&
              (data?.SelectedQuantity ?? 0) > (data?.DefaultQuantity ?? 0) && (
                <span className="flex items-center gap-0.5 font-bold">
                  <PlusIcon className="size-4" /> {data?.PriceAfterDiscount}{" "}
                  <span className="text-sm font-normal">{currency}</span>
                </span>
              )}
          </div>

          <div className="flex-end w-[120px] shrink-0 px-2">
            {/* Radio Button */}
            <Radio
              name={NameUnique}
              id={data?.ID}
              checked={(data?.SelectedQuantity ?? 0) > 0}
              onChange={() => handleRadioButton(data?.ID, ID, 1)}
            />
          </div>
        </label>
      ) : (
        <div className="flex w-full items-center gap-1">
          <div className="flex-between flex-grow gap-1">
            <div className="flex items-center gap-1">
              <div className="relative">
                {hasDiscount && data?.IsDiscountViewPercentage && (
                  <div className="flex-center relative top-1 z-10 gap-1 rounded bg-alt px-2 text-xs text-white">
                    <img src="/images/icons/texas-star.svg" alt="off" />
                    <span className="uppercase">
                      {data?.DiscountPercentage}% {resources["off"]}
                    </span>
                  </div>
                )}
                <img
                  src={data?.IconURL}
                  alt={data?.Name}
                  width={50}
                  height={50}
                  loading="lazy"
                  className="aspect-square shrink-0 object-contain"
                />
              </div>

              <div className="flex-grow text-start">
                <h3 className="text-lg font-semibold capitalize leading-none text-[#6a6a6a]">
                  {data.Name?.toLowerCase()}{" "}
                  {/* <span className="ms-0.5 text-xs font-normal text-main-foreground">
              ({data?.DefaultQuantity})
            </span> */}
                </h3>

                {data?.Description?.trim() && (
                  <p className="text-sm leading-tight text-gray-500">
                    {data?.Description}
                  </p>
                )}
              </div>
            </div>

            {data?.PriceAfterDiscount > 0 &&
              (data?.SelectedQuantity ?? 0) > (data?.DefaultQuantity ?? 0) && (
                <span className="flex items-center gap-0.5 font-bold">
                  <PlusIcon className="size-4" />{" "}
                  {(
                    data?.PriceAfterDiscount *
                    ((data?.SelectedQuantity ?? 0) -
                      (data?.DefaultQuantity ?? 0))
                  ).toFixed(2)}{" "}
                  <span className="text-sm font-normal">{currency}</span>
                </span>
              )}
          </div>

          <div className="flex-end w-[120px] shrink-0 px-2">
            {/* Plus & Minus Button */}
            {DisplayModeID === DisplayModeEnum.add && (
              <>
                {(data?.SelectedQuantity ?? 0) > 0 ? (
                  <PlusMinusItem
                    quantity={data?.SelectedQuantity ?? 0}
                    minusProps={{
                      className: "size-9",
                      "aria-disabled":
                        (data?.SelectedQuantity ?? 0) <= data?.MinQuantity,
                      onClick: () => handleAddDecrease(data),
                    }}
                    plusProps={{
                      className: "size-9",
                      "aria-disabled":
                        (data?.SelectedQuantity ?? 0) >= data?.MaxQuantity,
                      onClick: () => handleAddIncrease(data),
                    }}
                  />
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => handleAddIncrease(data)}
                  >
                    <PlusIcon className="size-4 shrink-0" /> {resources["add"]}
                  </Button>
                )}
              </>
            )}

            {/* Plus & Minus with Toggle  */}
            {DisplayModeID === DisplayModeEnum.addWithToggle && (
              <>
                {(data?.SelectedQuantity ?? 0) > 0 ? (
                  <PlusMinusItem
                    quantity={data?.SelectedQuantity ?? 0}
                    minusProps={{
                      className: "size-9",
                      "aria-disabled":
                        (data?.SelectedQuantity ?? 0) <= data?.MinQuantity,
                      onClick: () => handleAddWithToggleDecrease(data),
                    }}
                    plusProps={{
                      className: "size-9",
                      "aria-disabled":
                        (data?.SelectedQuantity ?? 0) >= data?.MaxQuantity,
                      onClick: () => handleAddWithToggleIncrease(data),
                    }}
                  />
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => handleAddWithToggleIncrease(data)}
                  >
                    <PlusIcon className="size-4 shrink-0" /> {resources["add"]}
                  </Button>
                )}
              </>
            )}

            {/* Ckeckbox */}
            {DisplayModeID === DisplayModeEnum.checkbox && (
              <Checkbox
                id={data?.ID}
                checked={(data?.SelectedQuantity ?? 0) > 0}
                disabled={
                  (remain <= 0 && !(data?.SelectedQuantity ?? 0)) ||
                  data?.MinQuantity === (data?.SelectedQuantity ?? 0)
                }
                onCheckedChange={(checked) => {
                  if (
                    (remain <= 0 && !(data?.SelectedQuantity ?? 0)) ||
                    data?.MinQuantity === (data?.SelectedQuantity ?? 0)
                  )
                    return;

                  handleCheckBox(data?.ID, ID, Number(checked));
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="space-y-1 py-2">
        {data?.ModifierGroups?.map((item) => (
          <ModifierAccordionLevel1
            key={item.ID}
            resources={resources}
            data={item}
            currency={currency}
            className="rounded-lg"
            parentModifierGroupId={ID}
            parentItemId={data?.ID}
            handleRadioButton={handleRadioButton}
            handleCheckBox={handleCheckBox}
            handleAddOption={handleAddOption}
            handleAddWithToggle={handleAddWithToggle}
          />
        ))}
      </div>
    </div>
  );
}
