"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import {
  setOrderLocation,
  setOrderTypeId,
} from "@/store/features/order/orderSlice";
import { useData } from "@/providers/DataProvider";
import { reorderService } from "@/lib/reorder";
import {
  ORDER_LOCATION,
  ORDER_TYPE_ID,
  REORDER_REDIRECT,
} from "@/utils/constants";
import { setServerCookie } from "@/server/actions/serverCookie";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmReorderModalProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<string>>;
  orderNumber: string;
};

export default function ConfirmReorderModal(props: ConfirmReorderModalProps) {
  const { isOpen, setOpen, orderNumber } = props;

  const t = useTranslations();
  const locale = useLocale();

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen("");
  };

  const {
    Data: { CurrencyName },
  } = useData();

  const handleReorder = async () => {
    if (orderNumber) {
      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      try {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        const response = await reorderService(locale, orderNumber);

        if (response?.hasError) {
          dispatch(toggleModal({ loadingModal: { isOpen: false } }));

          response?.errors?.forEach((item) =>
            toaster.error({
              title: item.Title,
              message: item.Message,
            }),
          );

          return handleClose();
        }

        const reorderData = response?.data;
        console.log("reorderData", reorderData);

        const orderLocationObject = {
          storeId: reorderData?.StoreID,
          cityId: reorderData?.CityID,
          addressId: reorderData?.ApplicationUserInformation?.AddressID
            ? reorderData?.ApplicationUserInformation?.AddressID
            : "",
          apartment: reorderData?.ApplicationUserInformation?.Apartment
            ? reorderData?.ApplicationUserInformation?.Apartment
            : "",
          areaId: reorderData?.ApplicationUserInformation?.AreaID
            ? reorderData?.ApplicationUserInformation?.AreaID
            : "",
          block: reorderData?.ApplicationUserInformation?.Block
            ? reorderData?.ApplicationUserInformation?.Block
            : "",
          building: reorderData?.ApplicationUserInformation?.Building
            ? reorderData?.ApplicationUserInformation?.Building
            : "",
          floor: reorderData?.ApplicationUserInformation?.Floor
            ? reorderData?.ApplicationUserInformation?.Floor
            : "",
          landmark: reorderData?.ApplicationUserInformation?.Landmark
            ? reorderData?.ApplicationUserInformation?.Landmark
            : "",
          street: reorderData?.ApplicationUserInformation?.Street
            ? reorderData?.ApplicationUserInformation?.Street
            : "",
          lat: reorderData?.ApplicationUserInformation?.Latitude
            ? reorderData?.ApplicationUserInformation?.Latitude
            : 0,
          lng: reorderData?.ApplicationUserInformation?.Longitude
            ? reorderData?.ApplicationUserInformation?.Longitude
            : 0,
        };

        if (reorderData) {
          const orderCookies = [
            {
              name: ORDER_TYPE_ID,
              value: reorderData?.OrderTypeID!,
            },
            {
              name: ORDER_LOCATION,
              value: JSON.stringify(orderLocationObject),
            },
          ];

          dispatch(setOrderTypeId(reorderData?.OrderTypeID!));
          dispatch(setOrderLocation(orderLocationObject));

          await setServerCookie(orderCookies);

          location.href = REORDER_REDIRECT;

          handleClose();
        }
      } catch (error) {
        console.error("Error in signing the user", (error as Error)?.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader title={t("confirmReorder")} />

        <DialogContentWrapper>
          <div className="flex-center mt-3 w-full flex-col gap-5 text-center">
            <img
              src="/images/icons/reorder-img.svg"
              alt="Reorder icon"
              width={128}
              height={128}
              loading="lazy"
              className="size-32 max-w-full object-contain"
            />

            <DialogDescription className="max-w-xs text-lg font-semibold leading-tight">
              {t("confirmReorderDesc")}
            </DialogDescription>
          </div>
        </DialogContentWrapper>

        <DialogFooter>
          <Button
            type="button"
            className="flex-1"
            variant="light"
            onClick={handleClose}
          >
            {t("cancel")}
          </Button>

          <Button type="button" className="flex-1" onClick={handleReorder}>
            {t("reorderAnyway")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// {
//     "CityID": "cb64bcc1-0f87-4113-aa06-75787a033789",
//     "ApplicationUserInformation": {
//         "AreaID": "b50b98fe-ee52-4bfc-8d99-8a9bd573d50f",
//         "CityID": "cb64bcc1-0f87-4113-aa06-75787a033789",
//         "Block": "145",
//         "Street": "test",
//         "Building": "test",
//         "Floor": "test",
//         "Apartment": "test",
//         "Landmark": "test",
//         "Email": "new_account@test.com",
//         "Phone": "+97331456789",
//         "Name": "Mohamed Saber"
//     },
//     "TotalQuantity": 2,
//     "Lines": [
//         {
//             "MenuItem": {
//                 "CategoryID": "83180f9e-a901-4bfa-8d82-6ae9de3a6c76",
//                 "CategoryName": "Starbox Meals",
//                 "CategoryNameUnique": "BH95starboxmeals",
//                 "IsCustomizable": true,
//                 "SelectedQuantity": 1,
//                 "CustomizationDescription": "1xMexicana Sandwich, 1xOriginal, 1xTomato, 1xLettuce, 1xOnion, 1xCheese, 1xTriangular Nachos, 1xMayonnaise, 1xBone-in Chicken Piece, 1xOriginal, 1xFrench Fries, 1xPepsi",
//                 "ModifierGroups": [
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0,
//                                                 "DisplayModeID": 3,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 1,
//                                                 "ExtraPrice": 0,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/f35b4b1e-e14a-4110-93b2-9c5c224ffc17_.png",
//                                                 "ID": "8acb8257-8c4d-489e-a7c1-1da817179e38",
//                                                 "Name": "Original",
//                                                 "NameUnique": "original",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 3,
//                                         "MinQuantity": 1,
//                                         "MaxQuantity": 1,
//                                         "ID": "82d21350-d8f3-474b-bcfd-cbd62067e132",
//                                         "Name": "Flavor",
//                                         "NameUnique": "flavor",
//                                         "Description": "",
//                                         "DisplayOrder": 2
//                                     },
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/tomato3.png",
//                                                 "ID": "028cf075-c468-453c-be72-c38c04ae9000",
//                                                 "Name": "Tomato  ",
//                                                 "NameUnique": "tomato",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/lettuce.png",
//                                                 "ID": "d92b8b5a-9362-4ab9-91d0-5d87d65ae5d6",
//                                                 "Name": "Lettuce  ",
//                                                 "NameUnique": "lettuce",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/onionslices2.png",
//                                                 "ID": "8e0fc69a-c478-4c11-b204-fc81b7fa686b",
//                                                 "Name": "Onion  ",
//                                                 "NameUnique": "onion",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/Cheese.png",
//                                                 "ID": "57d45e53-175b-4787-878a-d7245052a835",
//                                                 "Name": "Cheese  ",
//                                                 "NameUnique": "cheese",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/TriangularNachos3.png",
//                                                 "ID": "5be3487c-6405-4ca3-a868-482026380e39",
//                                                 "Name": "Triangular Nachos",
//                                                 "NameUnique": "triangular_nachos",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/mayonnaise.png",
//                                                 "ID": "157eb7b4-5e36-4e0a-9c6f-4e2ecb4be4dd",
//                                                 "Name": "Mayonnaise",
//                                                 "NameUnique": "mayonnaise",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 2,
//                                         "MinQuantity": 0,
//                                         "MaxQuantity": 18,
//                                         "ID": "50d67383-a521-4e02-8ba5-e33c5706b40a",
//                                         "Name": "Ingredient",
//                                         "NameUnique": "ingredient",
//                                         "Description": "",
//                                         "DisplayOrder": 3
//                                     }
//                                 ],
//                                 "DisplayModeID": 4,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 1,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/f35b4b1e-e14a-4110-93b2-9c5c224ffc17_.png",
//                                 "ID": "84f1dd66-47e9-4e87-8247-5064d4efcc29",
//                                 "Name": "Mexicana Sandwich",
//                                 "NameUnique": "mexicana_sandwich",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 4,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "6e888b9c-5aa0-4a90-a6ba-8fec525cf8ca",
//                         "Name": "Sandwich",
//                         "NameUnique": "sandwich",
//                         "Description": "",
//                         "DisplayOrder": 2
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0,
//                                                 "DisplayModeID": 3,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 1,
//                                                 "ExtraPrice": 0,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/original-ch.png",
//                                                 "ID": "66a8a098-c11f-44b7-ab98-41589c4a77d3",
//                                                 "Name": "Original",
//                                                 "NameUnique": "original",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 3,
//                                         "MinQuantity": 1,
//                                         "MaxQuantity": 1,
//                                         "ID": "a140b6dd-8ddf-42f1-a529-ed8f9c49ac2e",
//                                         "Name": "Flavor",
//                                         "NameUnique": "flavor",
//                                         "Description": "",
//                                         "DisplayOrder": 2
//                                     }
//                                 ],
//                                 "DisplayModeID": 4,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 1,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/original-ch.png",
//                                 "ID": "9220c605-7af2-4bb7-b134-08bcf887553b",
//                                 "Name": "Bone-in Chicken Piece",
//                                 "NameUnique": "bonein_chicken_piece",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 4,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "47b0c26b-a7ed-48da-bacd-4268ad312662",
//                         "Name": "Chicken Part",
//                         "NameUnique": "chicken_part",
//                         "Description": "",
//                         "DisplayOrder": 2
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [],
//                                 "DisplayModeID": 1,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 0,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/a16f5ee0-3ba4-47e4-9a37-0526934b5c88.png",
//                                 "ID": "0346aac7-ac42-4e4a-91ed-5901a575d245",
//                                 "Name": "French Fries",
//                                 "NameUnique": "french_fries",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 1,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "33b206f7-5a16-4382-ac32-55ac946d9b7c",
//                         "Name": "Side",
//                         "NameUnique": "side",
//                         "Description": "",
//                         "DisplayOrder": 3
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [],
//                                 "DisplayModeID": 1,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 0,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/b38d6182-0e92-46dd-8bb5-139fe9c5f6da.png",
//                                 "ID": "6906ac00-8483-404e-8dc7-1fad927d428c",
//                                 "Name": "Pepsi",
//                                 "NameUnique": "pepsi",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 1,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "9ecce14a-ce13-4f66-852d-6a433a678e91",
//                         "Name": "Drink",
//                         "NameUnique": "drink",
//                         "Description": "",
//                         "DisplayOrder": 4
//                     }
//                 ],
//                 "Price": 3,
//                 "DiscountAmount": 0,
//                 "DiscountPercentage": 0,
//                 "PriceAfterDiscount": 3,
//                 "IsDiscountViewPercentage": false,
//                 "IsFeatured": false,
//                 "IsBestSeller": false,
//                 "Calories": "-",
//                 "IconURL": "https://tx-imgrepository.psdigital.me/1006da73-0f26-45c1-a0d6-812d23349fdd.png",
//                 "IsTaxInclusive": false,
//                 "TaxPercentage": 0,
//                 "IsAddingPoints": false,
//                 "ID": "aeccd7b5-aa4f-4f2c-a2dc-d2aebda92557",
//                 "Name": "Mexicana Sandwich Box",
//                 "NameUnique": "mexicana_sandwich_box",
//                 "Description": "Mexicana sandwich served with fries, 1-piece bone-in chicken, and a drink of your choice.",
//                 "DisplayOrder": 3
//             },
//             "CreatedDate": "2025-01-27T15:29:55.4360984Z",
//             "ModifiedDate": "0001-01-01T00:00:00",
//             "IsQuickAdd": false,
//             "DealDetailsID": null,
//             "DealHeaderID": null,
//             "Quantity": 1,
//             "SinglePrice": 3,
//             "SingleExtraPrice": 0,
//             "SingleDiscountAmount": 0,
//             "SubTotal": 3,
//             "TotalDiscountAmount": 0,
//             "SubTotalAfterDiscount": 3,
//             "Total": 3,
//             "ID": "8d08742c-ee31-4695-b0cb-00003c27af08"
//         },
//         {
//             "MenuItem": {
//                 "CategoryID": "83180f9e-a901-4bfa-8d82-6ae9de3a6c76",
//                 "CategoryName": "Starbox Meals",
//                 "CategoryNameUnique": "BH95starboxmeals",
//                 "IsCustomizable": true,
//                 "SelectedQuantity": 1,
//                 "CustomizationDescription": "1xMexicana Wrap, 1xOriginal, 1xSalad, 1xTomato, 1xLettuce, 1xOnion, 1xCheese, 1xNacho Strips, 1xMayonnaise, 1xBone-in Chicken Piece, 1xOriginal, 1xFrench Fries, 1xPepsi",
//                 "ModifierGroups": [
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0,
//                                                 "DisplayModeID": 3,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 1,
//                                                 "ExtraPrice": 0,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/c8a9cbef-c3be-457c-95cd-282e7ba16687_.png",
//                                                 "ID": "4d5b08aa-f0b1-43e4-be6f-c2362f6ee804",
//                                                 "Name": "Original",
//                                                 "NameUnique": "original",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 3,
//                                         "MinQuantity": 1,
//                                         "MaxQuantity": 1,
//                                         "ID": "92226467-cde4-43e6-b069-624fb8c3d0d3",
//                                         "Name": "Flavor",
//                                         "NameUnique": "flavor",
//                                         "Description": "",
//                                         "DisplayOrder": 2
//                                     },
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/salad.png",
//                                                 "ID": "e1b95c36-3508-4a50-90a5-93601c222444",
//                                                 "Name": "Salad  ",
//                                                 "NameUnique": "salad",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/tomato3.png",
//                                                 "ID": "8212021a-8ed4-4fc7-aa2c-db23b5875c71",
//                                                 "Name": "Tomato  ",
//                                                 "NameUnique": "tomato",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/lettuce.png",
//                                                 "ID": "86d97355-cf4e-4568-b7c8-8241e7349345",
//                                                 "Name": "Lettuce  ",
//                                                 "NameUnique": "lettuce",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/onionslices2.png",
//                                                 "ID": "b5297b0b-2879-4017-8efa-0135a98a6329",
//                                                 "Name": "Onion  ",
//                                                 "NameUnique": "onion",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/Cheese.png",
//                                                 "ID": "f0669eab-580b-42fd-9c7a-5166426bb4f6",
//                                                 "Name": "Cheese  ",
//                                                 "NameUnique": "cheese",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/TriangularNachos3.png",
//                                                 "ID": "013a0cde-2469-4fa3-a4a6-8f474167e8b1",
//                                                 "Name": "Nacho Strips",
//                                                 "NameUnique": "nacho_strips",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             },
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0.1,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0.1,
//                                                 "DisplayModeID": 2,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 3,
//                                                 "ExtraPrice": 0.1,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/mayonnaise.png",
//                                                 "ID": "74e8f53a-c78e-4d16-899f-d795019c34f1",
//                                                 "Name": "Mayonnaise",
//                                                 "NameUnique": "mayonnaise",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 2,
//                                         "MinQuantity": 0,
//                                         "MaxQuantity": 21,
//                                         "ID": "15c8aabd-53a6-4fe9-a5d1-fc6f26bd3f28",
//                                         "Name": "Ingredient",
//                                         "NameUnique": "ingredient",
//                                         "Description": "",
//                                         "DisplayOrder": 3
//                                     }
//                                 ],
//                                 "DisplayModeID": 4,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 1,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/c8a9cbef-c3be-457c-95cd-282e7ba16687_.png",
//                                 "ID": "9c2e6334-1772-49e8-85a7-093c1444be40",
//                                 "Name": "Mexicana Wrap",
//                                 "NameUnique": "mexicana_wrap",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 4,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "ce22b494-9cbc-4b62-aa0e-4a47548f2851",
//                         "Name": "Sandwich",
//                         "NameUnique": "sandwich",
//                         "Description": "",
//                         "DisplayOrder": 2
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [
//                                     {
//                                         "ModifierItems": [
//                                             {
//                                                 "SelectedQuantity": 1,
//                                                 "SinglePrice": 0,
//                                                 "SingleDiscount": 0,
//                                                 "Total": 0,
//                                                 "DisplayModeID": 3,
//                                                 "DefaultQuantity": 1,
//                                                 "MinQuantity": 0,
//                                                 "MaxQuantity": 1,
//                                                 "ExtraPrice": 0,
//                                                 "DiscountAmount": 0,
//                                                 "DiscountPercentage": 0,
//                                                 "PriceAfterDiscount": 0,
//                                                 "IsDiscountViewPercentage": false,
//                                                 "IconURL": "https://tx-imgrepository.psdigital.me/original-ch.png",
//                                                 "ID": "b613dca3-0baf-4b8a-831b-c94af5c1393f",
//                                                 "Name": "Original",
//                                                 "NameUnique": "original",
//                                                 "Description": "",
//                                                 "DisplayOrder": 1
//                                             }
//                                         ],
//                                         "DisplayModeID": 3,
//                                         "MinQuantity": 1,
//                                         "MaxQuantity": 1,
//                                         "ID": "84ddfe78-309b-4abf-bdde-d3edc84aadee",
//                                         "Name": "Flavor",
//                                         "NameUnique": "flavor",
//                                         "Description": "",
//                                         "DisplayOrder": 2
//                                     }
//                                 ],
//                                 "DisplayModeID": 4,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 1,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/original-ch.png",
//                                 "ID": "5b96067b-336b-41ed-9d32-358ce4452ebf",
//                                 "Name": "Bone-in Chicken Piece",
//                                 "NameUnique": "bonein_chicken_piece",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 4,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "67b716c8-a376-40bb-b744-5a4b65b48e9f",
//                         "Name": "Chicken Part",
//                         "NameUnique": "chicken_part",
//                         "Description": "",
//                         "DisplayOrder": 2
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [],
//                                 "DisplayModeID": 1,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 0,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/a16f5ee0-3ba4-47e4-9a37-0526934b5c88.png",
//                                 "ID": "aaef2e64-bf1e-4bcb-a094-e14091fe346f",
//                                 "Name": "French Fries",
//                                 "NameUnique": "french_fries",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 1,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "77bae632-f6dd-4c7d-92da-335d4932fc65",
//                         "Name": "Side",
//                         "NameUnique": "side",
//                         "Description": "",
//                         "DisplayOrder": 3
//                     },
//                     {
//                         "ModifierItems": [
//                             {
//                                 "SelectedQuantity": 1,
//                                 "SinglePrice": 0,
//                                 "SingleDiscount": 0,
//                                 "Total": 0,
//                                 "ModifierGroups": [],
//                                 "DisplayModeID": 1,
//                                 "DefaultQuantity": 1,
//                                 "MinQuantity": 0,
//                                 "MaxQuantity": 1,
//                                 "ExtraPrice": 0,
//                                 "DiscountAmount": 0,
//                                 "DiscountPercentage": 0,
//                                 "PriceAfterDiscount": 0,
//                                 "IsDiscountViewPercentage": false,
//                                 "IconURL": "https://tx-imgrepository.psdigital.me/b38d6182-0e92-46dd-8bb5-139fe9c5f6da.png",
//                                 "ID": "5f0ea1c4-891c-440d-90fd-be93b74e803b",
//                                 "Name": "Pepsi",
//                                 "NameUnique": "pepsi",
//                                 "Description": "",
//                                 "DisplayOrder": 1
//                             }
//                         ],
//                         "DisplayModeID": 1,
//                         "MinQuantity": 1,
//                         "MaxQuantity": 1,
//                         "ID": "84a233d4-6e0a-4968-b2d1-13be02ebb9db",
//                         "Name": "Drink",
//                         "NameUnique": "drink",
//                         "Description": "",
//                         "DisplayOrder": 4
//                     }
//                 ],
//                 "Price": 2.5,
//                 "DiscountAmount": 0,
//                 "DiscountPercentage": 0,
//                 "PriceAfterDiscount": 2.5,
//                 "IsDiscountViewPercentage": false,
//                 "IsFeatured": false,
//                 "IsBestSeller": false,
//                 "Calories": "-",
//                 "IconURL": "https://tx-imgrepository.psdigital.me/33032717-d852-40b4-9bd3-9e2b7c34db1b.png",
//                 "IsTaxInclusive": false,
//                 "TaxPercentage": 0,
//                 "IsAddingPoints": false,
//                 "ID": "a6e04e5c-f47d-46e4-b3ee-126465352f88",
//                 "Name": "Mexicana Wrap Box",
//                 "NameUnique": "mexicana_wrap_box",
//                 "Description": "Mexicana wrap served with fries, a 1-piece bone-in chicken, and a drink of your choice.",
//                 "DisplayOrder": 4
//             },
//             "CreatedDate": "2025-01-27T15:29:55.8735402Z",
//             "ModifiedDate": "0001-01-01T00:00:00",
//             "IsQuickAdd": false,
//             "DealDetailsID": null,
//             "DealHeaderID": null,
//             "Quantity": 1,
//             "SinglePrice": 2.5,
//             "SingleExtraPrice": 0,
//             "SingleDiscountAmount": 0,
//             "SubTotal": 2.5,
//             "TotalDiscountAmount": 0,
//             "SubTotalAfterDiscount": 2.5,
//             "Total": 2.5,
//             "ID": "8c0fcb60-ae39-4441-9079-8eeaa5c6d827"
//         }
//     ],
//     "Deals": null,
//     "SubTotalAfterDiscount": 5.5,
//     "PromoCode": null,
//     "DealHeaderID": null,
//     "IsHeaderContainsLists": false,
//     "ExpiredDate": "2025-01-27T20:26:10.873",
//     "StoreID": "7ffe5196-5bde-43f6-9ffd-8906a6a15fdd",
//     "OrderTypeID": "c1942d34-70d2-4654-9597-1d93d03d92e5",
//     "SubTotal": 5.5,
//     "DiscountAmount": 0,
//     "DeliveryChargeAmount": 0,
//     "TaxAmount": 0,
//     "Total": 5.5,
//     "ID": "d2b3116c-0d86-4aec-9af5-cf5816bc6742"
// }
