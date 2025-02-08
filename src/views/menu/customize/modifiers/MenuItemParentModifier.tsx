import { memo, useMemo } from "react";
import cn from "@/utils/cn";
import { displayInOrder } from "@/utils";
import ModifierAccordionLevel1 from "./ModifierAccordionLevel1";
import ModifierAccordionLevel2 from "./ModifierAccordionLevel2";
// Types
import { ModifierGroupProps } from "@/types/api";
import { MenuItemPageResourcesProps } from "@/types/resources";
import { MenuItemActionProp } from "@/types";

type MenuItemParentModifierProps = {
  data: ModifierGroupProps;
  resources: MenuItemPageResourcesProps;
  currency: string;
  handleRadioButton: MenuItemActionProp;
  handleCheckBox: MenuItemActionProp;
  handleAddOption: MenuItemActionProp;
  handleAddWithToggle: MenuItemActionProp;
};

function getModifierItemsLevel(data: ModifierGroupProps) {
  let level = 0;

  if (data?.ModifierItems?.length > 0) {
    level = 1;
  }

  if (level > 0) {
    if (data?.ModifierItems[0]?.ModifierGroups?.length > 0) {
      level = 2;
    }
  }

  return level;
}

const MenuItemParentModifier = (props: MenuItemParentModifierProps) => {
  const {
    data,
    resources,
    currency,
    handleRadioButton,
    handleCheckBox,
    handleAddOption,
    handleAddWithToggle,
  } = props;

  const remain = useMemo(() => {
    return (
      data?.MaxQuantity -
      data?.ModifierItems?.reduce(
        (acc, cur) => acc + (cur.SelectedQuantity ?? 0),
        0,
      )
    );
  }, [data]);

  return (
    <div id={data?.ID}>
      {getModifierItemsLevel(data) === 1 && (
        <ModifierAccordionLevel1
          data={data}
          resources={resources}
          currency={currency}
          parentModifierGroupId={data?.ID}
          handleRadioButton={handleRadioButton}
          handleCheckBox={handleCheckBox}
          handleAddOption={handleAddOption}
          handleAddWithToggle={handleAddWithToggle}
        />
      )}

      {getModifierItemsLevel(data) === 2 && (
        <div className="bg-white">
          <div className="flex items-center gap-3 px-4 py-2">
            <h2 className="text-lg font-bold capitalize">
              {resources["customize"]} {data?.Name}
            </h2>

            {data?.MinQuantity !== data?.MaxQuantity && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold capitalize text-gray-500",
                  {
                    "text-alt": remain <= 0 || remain <= data?.MinQuantity,
                  },
                )}
              >
                (
                <span>
                  {resources["min"]} {data?.MinQuantity}
                </span>
                ,
                <span>
                  {resources["max"]} {data?.MaxQuantity}
                </span>
                )
              </span>
            )}
          </div>

          {displayInOrder(data?.ModifierItems)?.map((item) => (
            <div key={item.ID} className="space-y-2">
              <ModifierAccordionLevel2
                data={item}
                resources={resources}
                currency={currency}
                parentData={{
                  ID: data?.ID,
                  DisplayModeID: data?.DisplayModeID,
                  NameUnique: data?.NameUnique,
                  MinQuantity: data?.MinQuantity,
                  MaxQuantity: data?.MaxQuantity,
                }}
                remain={remain}
                handleRadioButton={handleRadioButton}
                handleCheckBox={handleCheckBox}
                handleAddOption={handleAddOption}
                handleAddWithToggle={handleAddWithToggle}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(MenuItemParentModifier);
