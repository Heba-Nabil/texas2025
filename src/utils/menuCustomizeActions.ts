import { RefactorMenuItem } from "@/types";
import {
  CartLineMenuItemProps,
  CartLineProps,
  CartModifierGroupProps,
  CartProps,
  MealItemProps,
  ModifierItemProps,
  SingleOrderResponseProps,
} from "@/types/api";
import { DisplayModeEnum } from "@/types/enums";

// Calculate Menu Item Price
export function calcMenuItemPrice(data: MealItemProps) {
  // debugger;
  if (data?.ModifierGroups && data?.ModifierGroups?.length > 0) {
    return data?.ModifierGroups?.reduce((acc, receivedMG) => {
      if (receivedMG.ModifierItems && receivedMG.ModifierItems?.length > 0) {
        const sumOfDefaultQty = receivedMG?.ModifierItems?.reduce(
          (modAcc, modCur) => (modAcc += modCur.DefaultQuantity),
          0,
        );

        let UnCalculatedModifierItem =
          receivedMG.DisplayModeID === DisplayModeEnum.add ||
          receivedMG.DisplayModeID === DisplayModeEnum.addWithToggle
            ? sumOfDefaultQty > receivedMG.MinQuantity
              ? sumOfDefaultQty
              : receivedMG.MinQuantity
            : 0;

        receivedMG.ModifierItems?.forEach((receivedMI) => {
          if ((receivedMI?.SelectedQuantity ?? 0) > 0) {
            if (receivedMG?.MinQuantity > 0) {
              if (
                (receivedMI.SelectedQuantity ?? 0) > UnCalculatedModifierItem
              ) {
                let CalcualtedQuantity = receivedMI.SelectedQuantity ?? 0;

                if (CalcualtedQuantity > UnCalculatedModifierItem) {
                  CalcualtedQuantity -= UnCalculatedModifierItem;
                  UnCalculatedModifierItem = 0;
                } else {
                  UnCalculatedModifierItem -= CalcualtedQuantity;
                }

                acc += receivedMI.PriceAfterDiscount * CalcualtedQuantity;
              } else {
                UnCalculatedModifierItem -= receivedMI.SelectedQuantity ?? 0;
              }
            } else {
              if (
                (receivedMI.SelectedQuantity ?? 0) > receivedMI.DefaultQuantity
              ) {
                acc +=
                  receivedMI.PriceAfterDiscount *
                  ((receivedMI.SelectedQuantity ?? 0) -
                    receivedMI.DefaultQuantity);
              }
            }
          }

          if (
            receivedMI.ModifierGroups &&
            receivedMI.ModifierGroups?.length > 0
          ) {
            receivedMI.ModifierGroups?.forEach((receivedSMG) => {
              if (
                receivedSMG.ModifierItems &&
                receivedSMG.ModifierItems?.length > 0
              ) {
                const sumOfDefaultQty = receivedSMG?.ModifierItems?.reduce(
                  (modAcc, modCur) => (modAcc += modCur.DefaultQuantity),
                  0,
                );

                let UnCalculatedSubModifierItem =
                  receivedSMG.DisplayModeID === DisplayModeEnum.add ||
                  receivedSMG.DisplayModeID === DisplayModeEnum.addWithToggle
                    ? sumOfDefaultQty > receivedSMG.MinQuantity
                      ? sumOfDefaultQty
                      : receivedSMG.MinQuantity
                    : 0;

                receivedSMG.ModifierItems?.forEach((receivedSMGI) => {
                  if ((receivedSMGI.SelectedQuantity ?? 0) > 0) {
                    if (receivedSMG.MinQuantity > 0) {
                      if (
                        (receivedSMGI.SelectedQuantity ?? 0) >
                        UnCalculatedSubModifierItem
                      ) {
                        let CalcualtedQuantity =
                          receivedSMGI.SelectedQuantity ?? 0;
                        if (CalcualtedQuantity >= UnCalculatedSubModifierItem) {
                          CalcualtedQuantity -= UnCalculatedSubModifierItem;
                          UnCalculatedSubModifierItem = 0;
                        } else {
                          UnCalculatedSubModifierItem -= CalcualtedQuantity;
                        }
                        acc +=
                          receivedSMGI.PriceAfterDiscount * CalcualtedQuantity;
                      } else {
                        UnCalculatedSubModifierItem -=
                          receivedSMGI.SelectedQuantity ?? 0;
                      }
                    } else {
                      if (
                        (receivedSMGI.SelectedQuantity ?? 0) >
                        receivedSMGI.DefaultQuantity
                      ) {
                        acc +=
                          receivedSMGI.PriceAfterDiscount *
                          ((receivedSMGI.SelectedQuantity ?? 0) -
                            receivedSMGI.DefaultQuantity);
                      }
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        return acc;
      }

      return acc;
    }, data?.PriceAfterDiscount);
  } else {
    return 0;
  }
}

// export function calcMenuItemPrice(data: MealItemProps) {
//   return data?.ModifierGroups?.reduce((acc, cur) => {
//     const defaultModItems = cur.ModifierItems?.filter(
//       (item) => item.DefaultQuantity > 0,
//     );
//     // Consider they are the same price
//     const defaultModItemPrice = defaultModItems[0]?.PriceAfterDiscount ?? 0;

//     const totalModItemsSelectedQty = cur.ModifierItems?.reduce(
//       (acc, cur) => acc + (cur.SelectedQuantity ?? 0),
//       0,
//     );

//     const minQty =
//       cur.MinQuantity ||
//       cur.ModifierItems?.reduce(
//         (_acc, _cur) => (_acc += _cur.DefaultQuantity),
//         0,
//       );

//     const remainingQty = minQty - totalModItemsSelectedQty;

//     cur.ModifierItems.forEach((parentModItem) => {
//       if (parentModItem?.PriceAfterDiscount === defaultModItemPrice) {
//         if (remainingQty < 0) {
//           const qtyToAdd =
//             (parentModItem.SelectedQuantity ?? 0) - remainingQty < 0
//               ? 0
//               : (parentModItem.SelectedQuantity ?? 0) -
//                 parentModItem.DefaultQuantity;

//           acc += parentModItem.PriceAfterDiscount * qtyToAdd;
//         }
//       } else {
//         if (
//           (parentModItem.SelectedQuantity ?? 0) > parentModItem.DefaultQuantity
//         ) {
//           acc +=
//             parentModItem.PriceAfterDiscount *
//             ((parentModItem.SelectedQuantity ?? 0) -
//               parentModItem.DefaultQuantity);
//         }
//       }

//       if (parentModItem?.ModifierGroups?.length > 0) {
//         parentModItem?.ModifierGroups?.forEach((subModGroup) => {
//           const defaultModItems = subModGroup.ModifierItems?.filter(
//             (item) => item.DefaultQuantity > 0,
//           );

//           // Consider they are the same price
//           const defaultModItemPrice =
//             defaultModItems[0]?.PriceAfterDiscount ?? 0;

//           const minQty =
//             subModGroup.MinQuantity ||
//             subModGroup.ModifierItems?.reduce(
//               (acc, cur) => (acc += cur.DefaultQuantity),
//               0,
//             );

//           const totalModItemsSelectedQty = subModGroup.ModifierItems?.reduce(
//             (acc, cur) => acc + (cur.SelectedQuantity ?? 0),
//             0,
//           );
//           const remainingQty = minQty - totalModItemsSelectedQty;

//           subModGroup?.ModifierItems?.forEach((modItem) => {
//             if (modItem?.PriceAfterDiscount === defaultModItemPrice) {
//               if (remainingQty < 0) {
//                 const qtyToAdd =
//                   (modItem.SelectedQuantity ?? 0) - remainingQty < 0
//                     ? 0
//                     : (modItem.SelectedQuantity ?? 0) - modItem.DefaultQuantity;

//                 acc += modItem.PriceAfterDiscount * qtyToAdd;
//               }
//             } else {
//               if ((modItem.SelectedQuantity ?? 0) > modItem.DefaultQuantity) {
//                 acc +=
//                   modItem.PriceAfterDiscount *
//                   ((modItem.SelectedQuantity ?? 0) - modItem.DefaultQuantity);
//               }
//             }
//           });
//         });
//       }
//     });

//     return acc;
//   }, data?.PriceAfterDiscount);
// }

// export function calcMenuItemPrice(data: MealItemProps) {
//   return data?.ModifierGroups?.reduce((acc, cur) => {
//     cur.ModifierItems.forEach((parentModItem) => {
//       if (
//         (parentModItem.SelectedQuantity ?? 0) > parentModItem.DefaultQuantity
//       ) {
//         acc +=
//           parentModItem.PriceAfterDiscount *
//           (parentModItem.SelectedQuantity ?? 0);
//       }

//       if (parentModItem?.ModifierGroups?.length > 0) {
//         parentModItem?.ModifierGroups?.forEach((subModGroup) => {
//           subModGroup?.ModifierItems?.forEach((modItem) => {
//             if ((modItem.SelectedQuantity ?? 0) > modItem.DefaultQuantity) {
//               acc +=
//                 modItem.PriceAfterDiscount * (modItem.SelectedQuantity ?? 0);
//             }
//           });
//         });
//       }
//     });

//     return acc;
//   }, data?.PriceAfterDiscount);
// }

// Customize Level Change
export function handleCustomizeChange(
  data: MealItemProps,
  parentGroupId: string,
  objectId: string,
  quantity: number,
  cb: (
    data: ModifierItemProps[],
    objectId: string,
    quantity: number,
  ) => ModifierItemProps[],
  parentItemId?: string,
  subGroupId?: string,
) {
  return {
    ...data,
    ModifierGroups: data.ModifierGroups.map((pModGroup) => {
      if (pModGroup.ID === parentGroupId) {
        const isExistInThisLevel =
          pModGroup?.ModifierItems?.findIndex(
            (item) => item.ID === objectId,
          ) !== -1;

        if (isExistInThisLevel) {
          return {
            ...pModGroup,
            ModifierItems: cb(pModGroup.ModifierItems, objectId, quantity),
          };
        }

        return {
          ...pModGroup,
          ModifierItems: pModGroup.ModifierItems.map((pModItem) => {
            if (pModItem.ID === parentItemId) {
              return {
                ...pModItem,
                ModifierGroups: pModItem.ModifierGroups.map((subModGroup) => {
                  if (subModGroup.ID === subGroupId) {
                    const isExistInThisLevel =
                      subModGroup?.ModifierItems?.findIndex(
                        (item) => item.ID === objectId,
                      ) !== -1;

                    if (isExistInThisLevel) {
                      return {
                        ...subModGroup,
                        ModifierItems: cb(
                          subModGroup.ModifierItems,
                          objectId,
                          quantity,
                        ),
                      };
                    }

                    return subModGroup;
                  }

                  return subModGroup;
                }),
              };
            }

            return pModItem;
          }),
        };
      }

      return pModGroup;
    }),
  };
}

// Radio Behavior
export function radioBehavior(
  data: ModifierItemProps[],
  objectId: string,
  quantity: number,
) {
  return data?.map((item) => ({
    ...item,
    SelectedQuantity: item.ID === objectId ? quantity : 0,
  }));
}

// Quantity Behavior
export function quantityBehavior(
  data: ModifierItemProps[],
  objectId: string,
  quantity: number,
) {
  return data?.map((item) => ({
    ...item,
    SelectedQuantity: item.ID === objectId ? quantity : item.SelectedQuantity,
  }));
}

// Quantity with Toggle
export function quantityWithToggleBehavior(
  data: ModifierItemProps[],
  objectId: string,
  quantity: number,
) {
  return data?.map((item) => {
    if (item.ID === objectId)
      return {
        ...item,
        SelectedQuantity: quantity,
      };

    const currentItemQty =
      data?.find((el) => el.ID === objectId)?.SelectedQuantity ?? 0;
    const difference = (quantity - currentItemQty) * -1;

    return {
      ...item,
      SelectedQuantity: (item.SelectedQuantity ?? 0) + difference,
    };
  });
}

// Check if customization achieve requirements
export function isCustomizationValid(data: MealItemProps) {
  const result: {
    hasError: boolean;
    data: {
      parent: null | {
        Name: string;
        MinQuantity: number;
        MaxQuantity: number;
      };
      child: null | { Name: string; MinQuantity: number; MaxQuantity: number };
    };
  } = {
    hasError: false,
    data: {
      parent: null,
      child: null,
    },
  };

  for (let parentModGroup in data?.ModifierGroups) {
    const currentParentGroup = data?.ModifierGroups[parentModGroup];

    const currentModiferGroupModierItemsTotalQuantities =
      currentParentGroup?.ModifierItems?.reduce((acc, cur) => {
        acc += cur.SelectedQuantity ?? 0;

        return acc;
      }, 0);

    if (
      currentModiferGroupModierItemsTotalQuantities <
        currentParentGroup.MinQuantity ||
      currentModiferGroupModierItemsTotalQuantities >
        currentParentGroup.MaxQuantity
    ) {
      result.hasError = true;
      result.data.parent = {
        Name: currentParentGroup.Name,
        MinQuantity: currentParentGroup.MinQuantity,
        MaxQuantity: currentParentGroup.MaxQuantity,
      };

      break;
    }

    for (let parentModItem in currentParentGroup.ModifierItems) {
      const currentParentModItem =
        currentParentGroup.ModifierItems[parentModItem];

      if (currentParentModItem?.ModifierGroups.length === 0) continue;

      for (let subModGroup in currentParentModItem.ModifierGroups) {
        const currentSubGroup =
          currentParentModItem.ModifierGroups[subModGroup];

        const currentModiferGroupModierItemsTotalQuantities =
          currentSubGroup?.ModifierItems?.reduce((acc, cur) => {
            acc += cur.SelectedQuantity ?? 0;

            return acc;
          }, 0);

        if (
          currentModiferGroupModierItemsTotalQuantities <
            currentSubGroup.MinQuantity ||
          currentModiferGroupModierItemsTotalQuantities >
            currentSubGroup.MaxQuantity
        ) {
          result.hasError = true;
          result.data.parent = {
            Name: currentParentGroup.Name,
            MinQuantity: currentParentGroup.MinQuantity,
            MaxQuantity: currentParentGroup.MaxQuantity,
          };
          result.data.child = {
            Name: currentSubGroup.Name,
            MinQuantity: currentSubGroup.MinQuantity,
            MaxQuantity: currentSubGroup.MaxQuantity,
          };

          break;
        }
      }
    }
  }

  return result;
}

// Adjust Menu Item For Compare
export function refactorMenuItem(data: MealItemProps): RefactorMenuItem {
  if (!data) throw new Error("Missing required parameter data");

  return {
    ID: data.ID,
    ModifierGroups: data?.ModifierGroups?.map((pModGroup) => ({
      ID: pModGroup.ID,
      ModifierItems: pModGroup.ModifierItems?.map((pModItem) => ({
        ID: pModItem.ID,
        SelectedQuantity: pModItem.SelectedQuantity,
        ModifierGroups: pModItem.ModifierGroups?.map((subModGroup) => ({
          ID: subModGroup.ID,
          ModifierItems: subModGroup.ModifierItems?.map((subModItem) => ({
            ID: subModItem.ID,
            SelectedQuantity: subModItem.SelectedQuantity,
          })),
        })),
      })),
    })),
  };
}

// Adjust Cart Item For Compare
export function refactorCartItem(data: CartLineMenuItemProps) {
  if (!data) throw new Error("Missing required parameter data");

  return {
    ID: data.ID,
    ModifierGroups: data?.ModifierGroups?.map((pModGroup) => ({
      ID: pModGroup.ID,
      ModifierItems: pModGroup.ModifierItems?.map((pModItem) => ({
        ID: pModItem.ID,
        SelectedQuantity: pModItem.SelectedQuantity,
        ModifierGroups: pModItem.ModifierGroups?.map((subModGroup) => ({
          ID: subModGroup.ID,
          ModifierItems: subModGroup.ModifierItems?.map((subModItem) => ({
            ID: subModItem.ID,
            SelectedQuantity: subModItem.SelectedQuantity,
          })),
        })),
      })),
    })),
  };
}

// Map Cart Line To Menu Item
export function mapCartLineToMenuItem(
  cartLine: CartLineProps,
  menuItem: MealItemProps,
): MealItemProps {
  if (!cartLine || !menuItem) throw new Error("Missing Required parameter");

  const cartItem = cartLine?.MenuItem;

  return {
    ...menuItem,
    SelectedQuantity: cartLine.Quantity,
    ModifierGroups: menuItem.ModifierGroups?.map((pModGroup) => {
      const equivParentModGroup = cartItem.ModifierGroups.find(
        (item) => item.ID === pModGroup.ID,
      );

      return {
        ...pModGroup,
        ModifierItems: pModGroup.ModifierItems?.map((pModItem) => {
          const equivParentModItem = equivParentModGroup?.ModifierItems.find(
            (item) => item.ID === pModItem.ID,
          );

          return {
            ...pModItem,
            SelectedQuantity: equivParentModItem?.SelectedQuantity ?? 0,
            ModifierGroups: pModItem.ModifierGroups?.map((subModGroup) => {
              const equivSubModGroup = equivParentModItem?.ModifierGroups.find(
                (item) => item.ID === subModGroup.ID,
              );

              return {
                ...subModGroup,
                ModifierItems: subModGroup.ModifierItems?.map((subModItem) => {
                  const equivSubModItem = equivSubModGroup?.ModifierItems?.find(
                    (item) => item.ID === subModItem.ID,
                  );

                  return {
                    ...subModItem,
                    SelectedQuantity: equivSubModItem?.SelectedQuantity ?? 0,
                  };
                }),
              };
            }),
          };
        }),
      };
    }),
  };
}

// Map Cart To Bill
export function mapCartToBill(cartData: CartProps) {
  return {
    TotalQuantity: cartData?.TotalQuantity,
    ExpiredDate: cartData?.ExpiredDate,
    SubTotal: cartData?.SubTotal,
    DiscountAmount: cartData?.DiscountAmount,
    DeliveryChargeAmount: cartData?.DeliveryChargeAmount,
    TaxAmount: cartData?.TaxAmount,
    Total: cartData?.Total,
    PromoCode: cartData?.PromoCode,
    DealHeaderID: cartData?.DealHeaderID,
    Lines: cartData?.Lines?.map((line) => ({
      Quantity: line.Quantity,
      SubTotal: line.SubTotal,
      SubTotalAfterDiscount: line.SubTotalAfterDiscount,
      MenuItem: {
        CustomizationDescription: line.MenuItem.CustomizationDescription,
        IconURL: line.MenuItem.IconURL,
        Name: line.MenuItem.Name,
        Description: line.MenuItem.Description,
      },
    })),
    Deals: cartData?.Deals?.map((deal) => ({
      ID: deal.ID,
      Name: deal.Name,
      Points: deal.Points,
      Lines: deal?.Lines?.map((line) => ({
        Quantity: line.Quantity,
        SubTotal: line.SubTotal,
        SubTotalAfterDiscount: line.SubTotalAfterDiscount,
        MenuItem: {
          CustomizationDescription: line.MenuItem.CustomizationDescription,
          IconURL: line.MenuItem.IconURL,
          Name: line.MenuItem.Name,
          Description: line.MenuItem.Description,
        },
      })),
    })),
  };
}

// convert order object to bill object
export function mapOrderToBill(orderData: SingleOrderResponseProps) {
  const TotalQuantity = orderData.MenuItems.reduce((acc, cur) => {
    return acc + cur.Quantity;
  }, 0);
  return {
    TotalQuantity,
    ExpiredDate: "",
    SubTotal: orderData?.SubTotal,
    DiscountAmount: orderData?.DiscountAmount,
    DeliveryChargeAmount: orderData?.DeliveryChargeAmount,
    TaxAmount: orderData?.TaxAmount,
    Total: orderData?.Total,
    Lines: orderData?.MenuItems?.map((line) => ({
      Quantity: line.Quantity,
      SubTotal: line.SubTotal,
      SubTotalAfterDiscount: line.SubTotal,
      MenuItem: {
        CustomizationDescription: line.CustomizationDescription,
        IconURL: line.IconURL,
        Name: line.Name,
        Description: line.Description,
      },
    })),
  };
}

// Cart Item Description
export const getCartItemDetails = (
  cartItemModifierGroup: CartModifierGroupProps[],
) => {
  let detailsArray: string[] = [];

  const processModifierItems = (items: any[]) => {
    items.forEach((item) => {
      if (item.SelectedQuantity > 0) {
        if (item?.ModifierGroups?.length > 0) {
          item.ModifierGroups.forEach((subGroup: any) => {
            if (subGroup?.ModifierItems?.length > 0) {
              processModifierItems(subGroup?.ModifierItems);
            }
          });
        } else {
          detailsArray.push(`${item.Name} x ${item.SelectedQuantity}`);
        }
      }
    });
  };

  cartItemModifierGroup?.forEach((group) => {
    if (group?.ModifierItems && Array.isArray(group.ModifierItems)) {
      processModifierItems(group.ModifierItems);
    }
  });

  return detailsArray.join(" - ");
};

// Cart Item Description
// export const getCartProductDetails = (
//   productData: CartModifierGroupProps[],
// ) => {
//   let detailsArray: string[] = [];

//   const processModifierItems = (items: any[]) => {
//     items.forEach((item) => {
//       if (item.SelectedQuantity > 0) {
//         if (item?.ModifierGroups?.length > 0) {
//           item.ModifierGroups.forEach((subGroup: any) => {
//             if (subGroup?.ModifierItems?.length > 0) {
//               processModifierItems(subGroup?.ModifierItems);
//             }
//           });
//         } else {
//           detailsArray.push(`${item.Name} x ${item.SelectedQuantity}`);
//         }
//       }
//     });
//   };

//   productData?.forEach((group) => {
//     if (group?.ModifierItems && Array.isArray(group.ModifierItems)) {
//       processModifierItems(group.ModifierItems);
//     }
//   });

//   return detailsArray.join(" - ");
// };
