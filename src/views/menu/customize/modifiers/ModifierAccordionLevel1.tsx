import { useMemo } from "react";
import cn from "@/utils/cn";
import { displayInOrder } from "@/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MenuRadioItem from "./MenuRadioItem";
import MenuAddItemWrapper from "./menuAdd/MenuAddItemWrapper";
import MenuAddItem from "./menuAdd/MenuAddItem";
import MenuAddItemWithToggle from "./menuAdd/MenuAddItemWithToggle";
import MenuCheckBoxItem from "./MenuCheckBoxItem";
// Types
import { ModifierGroupProps, ModifierItemProps } from "@/types/api";
import { DisplayModeEnum } from "@/types/enums";
import { MenuItemPageResourcesProps } from "@/types/resources";
import { MenuItemActionProp } from "@/types";

type ModifierAccordionProps = {
  data: ModifierGroupProps;
  resources: MenuItemPageResourcesProps;
  currency: string;
  className?: string;
  parentModifierGroupId: string;
  parentItemId?: string;
  handleRadioButton: MenuItemActionProp;
  handleCheckBox: MenuItemActionProp;
  handleAddOption: MenuItemActionProp;
  handleAddWithToggle: MenuItemActionProp;
};

export default function ModifierAccordionLevel1(props: ModifierAccordionProps) {
  const {
    data,
    resources,
    currency,
    className,
    parentModifierGroupId,
    parentItemId,
    handleRadioButton,
    handleCheckBox,
    handleAddOption,
    handleAddWithToggle,
  } = props;

  const modifierItemsInOrder = useMemo(() => {
    return displayInOrder(data?.ModifierItems);
  }, [data]);

  const remain = useMemo(() => {
    return (
      data?.MaxQuantity -
      modifierItemsInOrder?.reduce(
        (acc, cur) => acc + (cur.SelectedQuantity ?? 0),
        0,
      )
    );
  }, [data, modifierItemsInOrder]);

  // Add +
  const handleAddIncrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) >= item?.MaxQuantity || remain <= 0)
      return;

    handleAddOption(
      item?.ID,
      parentModifierGroupId,
      (item?.SelectedQuantity ?? 0) + 1,
      parentItemId,
      data?.ID,
    );
  };
  // Add -
  const handleAddDecrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) <= item?.MinQuantity) return;

    handleAddOption(
      item?.ID,
      parentModifierGroupId,
      (item?.SelectedQuantity ?? 0) - 1,
      parentItemId,
      data?.ID,
    );
  };

  // Add with Toggle +
  const handleAddWithToggleIncrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) >= item?.MaxQuantity) return;

    handleAddWithToggle(
      item?.ID,
      parentModifierGroupId,
      (item?.SelectedQuantity ?? 0) + 1,
      parentItemId,
      data?.ID,
    );
  };
  // Add with Toggle -
  const handleAddWithToggleDecrease = (item: ModifierItemProps) => {
    if ((item?.SelectedQuantity ?? 0) <= item?.MinQuantity) return;

    handleAddWithToggle(
      item?.ID,
      parentModifierGroupId,
      (item?.SelectedQuantity ?? 0) - 1,
      parentItemId,
      data?.ID,
    );
  };

  return (
    <AccordionItem value={data?.ID} className={cn("bg-white", className)}>
      <AccordionTrigger className="border-b px-4">
        <span className="text-lg font-bold capitalize">
          {resources["select"]} {data?.Name}
        </span>
      </AccordionTrigger>

      <AccordionContent className="px-4 py-0">
        {/* Radio Button */}
        {data?.DisplayModeID === DisplayModeEnum.radio && (
          <MenuAddItemWrapper data={data} resources={resources} remain={remain}>
            <div className="w-full">
              {modifierItemsInOrder?.map((item, index) => (
                <MenuRadioItem
                  key={item.ID}
                  data={item}
                  isLast={index === modifierItemsInOrder?.length - 1}
                  currency={currency}
                  name={`${data?.NameUnique}_${data?.ID}`}
                  resources={{
                    off: resources["off"],
                  }}
                  handleChange={() =>
                    handleRadioButton(
                      item.ID,
                      parentModifierGroupId,
                      1,
                      parentItemId,
                      data?.ID,
                    )
                  }
                />
              ))}
            </div>
          </MenuAddItemWrapper>
        )}

        {/* Plus Minus Buttons */}
        {data?.DisplayModeID === DisplayModeEnum.add && (
          <MenuAddItemWrapper data={data} resources={resources} remain={remain}>
            <ul className="w-full">
              {modifierItemsInOrder?.map((item, index) => (
                <li key={index} className="w-full">
                  <MenuAddItem
                    data={item}
                    currency={currency}
                    resources={resources}
                    remain={remain}
                    handleAddIncrease={handleAddIncrease}
                    handleAddDecrease={handleAddDecrease}
                    parentMinQty={data?.MinQuantity}
                  />
                </li>
              ))}
            </ul>
          </MenuAddItemWrapper>
        )}

        {/* Plus Minus with Toggle */}
        {data?.DisplayModeID === DisplayModeEnum.addWithToggle && (
          <MenuAddItemWrapper data={data} resources={resources} remain={remain}>
            <ul className="w-full">
              {modifierItemsInOrder?.map((item, index) => (
                <li key={index} className="w-full">
                  <MenuAddItemWithToggle
                    data={item}
                    currency={currency}
                    resources={resources}
                    remain={remain}
                    handleAddIncrease={handleAddWithToggleIncrease}
                    handleAddDecrease={handleAddWithToggleDecrease}
                  />
                </li>
              ))}
            </ul>
          </MenuAddItemWrapper>
        )}

        {/* Checkbox */}
        {data?.DisplayModeID === DisplayModeEnum.checkbox && (
          <MenuAddItemWrapper data={data} resources={resources} remain={remain}>
            <div className="w-full">
              {modifierItemsInOrder?.map((item) => (
                <MenuCheckBoxItem
                  key={item.ID}
                  data={item}
                  currency={currency}
                  disabled={
                    (remain <= 0 && !item.SelectedQuantity) ||
                    item.MinQuantity === item.SelectedQuantity
                  }
                  resources={{ off: resources["off"] }}
                  handleChange={(checked: boolean) => {
                    if (
                      (remain <= 0 && !item.SelectedQuantity) ||
                      item.MinQuantity === item.SelectedQuantity
                    )
                      return;
                    handleCheckBox(
                      item.ID,
                      parentModifierGroupId,
                      Number(checked),
                      parentItemId,
                      data?.ID,
                    );
                  }}
                />
              ))}
            </div>
          </MenuAddItemWrapper>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
