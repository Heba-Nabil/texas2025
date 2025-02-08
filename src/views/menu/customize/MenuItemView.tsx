"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import _isEqual from "lodash/isEqual";
import { elementsIds } from "@/utils/constants";
import { useData } from "@/providers/DataProvider";
import { displayInOrder } from "@/utils";
import {
  calcMenuItemPrice,
  quantityBehavior,
  handleCustomizeChange,
  radioBehavior,
  quantityWithToggleBehavior,
} from "@/utils/menuCustomizeActions";
import cn from "@/utils/cn";
import PageModal from "@/components/global/PageModal";
import MenuItemHeader from "./MenuItemHeader";
import MenuItemInfo from "./MenuItemInfo";
import { Accordion } from "@/components/ui/accordion";
// Types
import { MealItemProps } from "@/types/api";
import { MenuItemPageResourcesProps } from "@/types/resources";

const DynamicMenuItemModifiersNav = dynamic(
  () => import("./MenuItemModifiersNav"),
);

const DynamicMenuItemParentModifier = dynamic(
  () => import("./modifiers/MenuItemParentModifier"),
);

const DynamicMenuItemControll = dynamic(() => import("./MenuItemControll"));

type MenuItemViewProps = {
  data: MealItemProps;
  locale: string;
  resources: MenuItemPageResourcesProps;
  cid: string | undefined;
  did: string | undefined;
};

export default function MenuItemView(props: MenuItemViewProps) {
  const { data, locale, resources, cid, did } = props;

  const [cloneData, setCloneData] = useState(data);

  const {
    Data: { CurrencyISOCode, CurrencyName, IsCartOrderTypeRequired },
  } = useData();

  useEffect(() => {
    // Facebook pixels
    !!window.fbq &&
      fbq("track", "ViewContent", {
        content_type: "product",
        content_ids: [data?.NameUnique],
        contents: [
          {
            index: 1,
            id: data?.NameUnique,
            item_name: data?.Name,
            discount: data?.DiscountAmount || 0,
            item_category: data?.CategoryNameUnique,
            price: data?.PriceAfterDiscount,
            quantity: data?.SelectedQuantity || 1,
            currency: CurrencyISOCode,
          },
        ],
      });

    // Tiktok pixels
    !!window.ttq &&
      ttq.track("ViewContent", {
        contents: [
          {
            index: 1,
            content_id: data?.NameUnique,
            content_name: data?.Name,
            discount: data?.DiscountAmount || 0,
            content_category: data?.CategoryNameUnique,
            quantity: data?.SelectedQuantity || 1,
            currency: CurrencyISOCode,
            value: data?.PriceAfterDiscount,
            content_type: "product",
            description: "Product",
          },
        ],
      });

    // Google events
    !!window.gtag &&
      window.gtag("event", "view_item", {
        currency: CurrencyISOCode,
        value: data?.PriceAfterDiscount,
        items: [
          {
            index: 1,
            item_id: data?.NameUnique,
            item_name: data?.Name,
            discount: data?.DiscountAmount || 0,
            item_category: data?.CategoryNameUnique,
            price: data?.PriceAfterDiscount,
            quantity: data?.SelectedQuantity || 1,
          },
        ],
      });

    // Snapchat events
    !!window.snaptr &&
      window.snaptr("track", "VIEW_CONTENT", {
        currency: CurrencyISOCode,
        value: data?.PriceAfterDiscount,
        items: [
          {
            index: 1,
            item_id: data?.NameUnique,
            item_name: data?.Name,
            discount: data?.DiscountAmount || 0,
            item_category: data?.CategoryNameUnique,
            price: data?.PriceAfterDiscount,
            quantity: data?.SelectedQuantity || 1,
          },
        ],
      });
  }, [CurrencyISOCode, data]);

  // Calculated Price After Customize
  const customizedPrice = useMemo(() => {
    return calcMenuItemPrice(cloneData);
  }, [cloneData]);

  const [isNavFixed, setIsNavFixed] = useState<boolean>(false);

  const itemModifiers = useMemo(() => {
    return displayInOrder(cloneData?.ModifierGroups);
  }, [cloneData]);

  // Navigation Modifiers
  const navIngredients = itemModifiers?.map((item) => ({
    id: item.ID,
    title: item.Name,
  }));

  const [activeIngredient, setActiveIngredient] = useState<string>(
    navIngredients[0].id,
  );

  const [accordionState, setAccordionState] = useState(
    navIngredients.slice(0, 2).map((item) => item.id),
  );

  const handleAccordionChange = (value: string[] | string) => {
    setAccordionState(typeof value === "string" ? value.split(",") : value);
  };

  // Handle Scroll Open Next Modifier
  const handleScroll = () => {
    const scrollableDiv = document.getElementById(
        elementsIds?.customizeWrapper,
      ),
      scrollableDivOffset = scrollableDiv ? scrollableDiv.offsetTop : 0,
      scrollPosition = scrollableDiv ? scrollableDiv.scrollTop : 0;
    let sections = [];

    if (sections?.length < 1) {
      for (let i in navIngredients) {
        const el = document.getElementById(navIngredients[i].id);

        el && sections.push(el);
      }
    }

    if (sections?.length === 0) return;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      if (
        section &&
        scrollPosition >= section.offsetTop - scrollableDivOffset &&
        scrollPosition <
          section.offsetTop + section.offsetHeight - scrollableDivOffset
      ) {
        setActiveIngredient(section.id);

        // const newNavState = [...accordionState, section.id];
        // handleAccordionChange(newNavState);
        break;
      }
    }
  };

  // Handle Radio Button
  const handleRadioButton = (
    objectId: string,
    parentGroupId: string,
    quantity: number,
    parentItemId?: string,
    subGroupId?: string,
  ) => {
    setCloneData((prev) =>
      handleCustomizeChange(
        prev,
        parentGroupId,
        objectId,
        quantity,
        radioBehavior,
        parentItemId,
        subGroupId,
      ),
    );
  };

  // Works for Checkbox and Add
  const handleQuantity = (
    objectId: string,
    parentGroupId: string,
    quantity: number,
    parentItemId?: string,
    subGroupId?: string,
  ) => {
    setCloneData((prev) =>
      handleCustomizeChange(
        prev,
        parentGroupId,
        objectId,
        quantity,
        quantityBehavior,
        parentItemId,
        subGroupId,
      ),
    );
  };

  // Hnadle Add with Toggle
  const handleAddWithToggle = (
    objectId: string,
    parentGroupId: string,
    quantity: number,
    parentItemId?: string,
    subGroupId?: string,
  ) => {
    setCloneData((prev) =>
      handleCustomizeChange(
        prev,
        parentGroupId,
        objectId,
        quantity,
        quantityWithToggleBehavior,
        parentItemId,
        subGroupId,
      ),
    );
  };

  return (
    <PageModal>
      <div className="flex w-full">
        <div className="w-full">
          <div
            className={cn(
              "mt-24 flex max-h-[calc(95vh-112px)] flex-col justify-between",
              {
                "mt-10 max-lg:max-h-[calc(95vh-80px)]": isNavFixed,
              },
            )}
          >
            {/* Image & Back & Reset */}
            <MenuItemHeader
              isItemInDefault={_isEqual(data, {
                ...cloneData,
                SelectedQuantity: 1,
              })}
              handleReset={() => setCloneData(data)}
              resources={{ reset: resources["reset"] }}
              isNavFixed={isNavFixed}
              data={{ Name: cloneData?.Name, IconURL: cloneData?.IconURL }}
            />

            {/* Info & Nav & Modifiers */}
            <div
              className="flex-grow overflow-y-auto"
              onScroll={handleScroll}
              id={elementsIds?.customizeWrapper}
            >
              <div className="relative bg-white px-4 pb-3">
                <MenuItemInfo
                  data={{
                    Name: data?.Name,
                    Description: data?.Description,
                    Calories: data?.Calories,
                    currency: CurrencyName,
                    PriceAfterDiscount: cloneData?.PriceAfterDiscount,
                    Price: cloneData?.Price,
                    DiscountAmount: cloneData?.DiscountAmount,
                    DiscountPercentage: cloneData?.DiscountPercentage,
                    IsDiscountViewPercentage:
                      cloneData?.IsDiscountViewPercentage,
                  }}
                  resources={{ kcal: resources["kcal"], off: resources["off"] }}
                />

                {navIngredients && navIngredients?.length > 0 && (
                  <div>
                    <DynamicMenuItemModifiersNav
                      locale={locale}
                      data={navIngredients}
                      activeIngredient={activeIngredient}
                      setIsNavFixed={setIsNavFixed}
                      setActiveIngredient={setActiveIngredient}
                      setAccordionState={setAccordionState}
                    />
                  </div>
                )}
              </div>

              <div className="border-t bg-white pb-20">
                <Accordion
                  type="multiple"
                  value={accordionState}
                  onValueChange={handleAccordionChange}
                  className="w-full space-y-2 bg-gray-100"
                >
                  {itemModifiers?.map((item) => (
                    <DynamicMenuItemParentModifier
                      key={item.ID}
                      data={item}
                      resources={resources}
                      currency={CurrencyName}
                      handleRadioButton={handleRadioButton}
                      handleCheckBox={handleQuantity}
                      handleAddOption={handleQuantity}
                      handleAddWithToggle={handleAddWithToggle}
                    />
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Qty & Total Price & Add or Update */}
            <DynamicMenuItemControll
              price={customizedPrice}
              cid={cid}
              did={did}
              currency={CurrencyName}
              CurrencyISOCode={CurrencyISOCode}
              resources={resources}
              data={cloneData}
              IsCartOrderTypeRequired={IsCartOrderTypeRequired}
              setCloneData={setCloneData}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </PageModal>
  );
}
