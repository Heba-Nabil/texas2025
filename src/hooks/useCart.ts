import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearServerCookie } from "@/server/actions/clearCookies";
import {
  addLoyaltyDealThunk,
  addToCartThunk,
  applyDealThunk,
  applyPromoCodeThunk,
  initializeCartThunk,
  quickAddToCartThunk,
  quickUpdateCartLineThunk,
  removeCartLineThunk,
  removeDealThunk,
  removePromoCodeThunk,
  transferCartThunk,
  updateCartLineThunk,
} from "@/store/features/cart/cartThunk";
import { apiErrorCodes } from "@/utils/constants";
import { toggleModal } from "@/store/features/global/globalSlice";
import { useData } from "@/providers/DataProvider";
// Types
import { ApplyDealValuesProps, RefactorMenuItem } from "@/types";

export default function useCart() {
  const { selectedOrderTypeId, orderLocation } = useAppSelector(
    (state) => state.order,
  );

  const {
    Data: { CurrencyName, CurrencyISOCode },
  } = useData();

  const cartData = useAppSelector((state) => state.cart);

  const {
    TotalQuantity,
    Lines,
    Total,
    SubTotal,
    SubTotalAfterDiscount,
    Deals,
  } = cartData;

  const dispatch = useAppDispatch();

  // Get Cart Item by LineID
  const findByLineId = (lineId: string | undefined) =>
    Lines?.find((item) => item.ID?.toLowerCase() === lineId?.toLowerCase());

  // Get Cart Deal by dealid and lineid
  const findDealById = (dealId: string, lineId: string) => {
    const deal = Deals?.find((item) => item.ID === dealId);

    const dealLine = deal?.Lines?.find((item) => item.ID === lineId);

    return dealLine;
  };

  // Get all Customizations for the same item
  const getCustomizations = (id: string) =>
    Lines?.filter((item) => item.MenuItem.ID === id);

  // Handle Add Menu Item to Cart
  const handleAddMenuItemToCart = async (
    requireInitailization: boolean,
    menuItemData: RefactorMenuItem,
    locale: string,
    handleModalDismiss?: () => void,
  ) => {
    const response = await dispatch(
      addToCartThunk({
        OrderTypeID: selectedOrderTypeId,
        StoreID: orderLocation?.storeId,
        MenuItem: menuItemData,
        locale,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        handleModalDismiss && handleModalDismiss();

        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Add");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        if (response?.hasError) {
          console.log("Error from Initialize cart", response.errors);

          const isMissingParam = response?.errors?.find(
            (item) => item.Code === apiErrorCodes.missingParameter,
          );

          if (isMissingParam) {
            dispatch(
              toggleModal({
                orderTypeModal: {
                  isOpen: true,
                  redirect: "",
                },
              }),
            );
          }

          return response;
        }

        return handleAddMenuItemToCart(
          requireInitailization,
          menuItemData,
          locale,
        );
      }
    }

    return response;
  };

  // Handle Quick Add
  const handleQuickAdd = async (
    requireInitailization: boolean,
    menuItemId: string,
    quantity: number,
    locale: string,
  ) => {
    const response = await dispatch(
      quickAddToCartThunk({
        OrderTypeID: selectedOrderTypeId,
        StoreID: orderLocation?.storeId,
        MenuItemID: menuItemId,
        SelectedQuantity: quantity,
        locale,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Quick Add");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        if (response?.hasError) {
          console.log("Error from Initialize cart", response.errors);

          const isMissingParam = response?.errors?.find(
            (item) => item.Code === apiErrorCodes.missingParameter,
          );

          if (isMissingParam) {
            dispatch(
              toggleModal({
                orderTypeModal: {
                  isOpen: true,
                  redirect: "",
                },
              }),
            );
          }

          return response;
        }

        return handleQuickAdd(
          requireInitailization,
          menuItemId,
          quantity,
          locale,
        );
      }
    }

    return response;
  };

  // Handle Edit Cart Item
  const handleEditCartItem = async (
    requireInitailization: boolean,
    LineID: string,
    locale: string,
    menuItemData?: RefactorMenuItem,
    handleModalDismiss?: () => void,
  ) => {
    if (!LineID || !menuItemData)
      throw new Error("Missing Required Parameter: LineID | MenuItemData");

    const response = await dispatch(
      updateCartLineThunk({
        OrderTypeID: selectedOrderTypeId,
        StoreID: orderLocation?.storeId,
        MenuItem: menuItemData,
        LineID,
        locale,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isItemNotFound = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.notFound,
      );

      if (isItemNotFound) {
        return location.reload();
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        handleModalDismiss && handleModalDismiss();

        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Update");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            // Instructions: orderLocation?.instructions,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle Quick Update
  const handleQuickUpdateCartItem = async (
    requireInitailization: boolean,
    LineID: string,
    MenuItemID: string,
    SelectedQuantity: number,
    locale: string,
    isIncrease: boolean,
    handleModalDismiss?: () => void,
  ) => {
    if (!LineID || !MenuItemID || !SelectedQuantity)
      throw new Error("Missing Required Parameter: LineID | MenuItemData");

    const data = findByLineId(LineID);

    const response = await dispatch(
      quickUpdateCartLineThunk({
        OrderTypeID: selectedOrderTypeId,
        StoreID: orderLocation?.storeId,
        LineID,
        MenuItemID,
        SelectedQuantity,
        locale,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isItemNotFound = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.notFound,
      );

      if (isItemNotFound) {
        return location.reload();
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        handleModalDismiss && handleModalDismiss();

        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Quick Update");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            // Instructions: orderLocation?.instructions,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    if (isIncrease) {
      // Facebook pixels
      !!window.fbq &&
        fbq("track", "AddToCart", {
          content_type: "product",
          content_ids: [data?.MenuItem?.NameUnique],
          contents: [
            {
              index: 1,
              id: data?.MenuItem?.NameUnique,
              item_name: data?.MenuItem?.Name,
              item_category: data?.MenuItem?.CategoryNameUnique,
              price: data?.MenuItem?.PriceAfterDiscount,
              discount: data?.MenuItem?.DiscountAmount,
              quantity: data?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
            },
          ],
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("AddToCart", {
          contents: [
            {
              content_type: "product",
              content_id: data?.MenuItem?.NameUnique,
              content_name: data?.MenuItem?.Name,
              discount: data?.MenuItem?.DiscountAmount,
              content_category: data?.MenuItem?.CategoryNameUnique,
              value: data?.MenuItem?.PriceAfterDiscount,
              quantity: data?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
              description: "Product",
            },
          ],
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "add_to_cart", {
          currency: CurrencyISOCode,
          value: data?.MenuItem?.PriceAfterDiscount,
          items: [
            {
              index: 1,
              item_id: data?.MenuItem?.NameUnique,
              item_name: data?.MenuItem?.Name,
              discount: data?.MenuItem?.DiscountAmount,
              item_category: data?.MenuItem?.CategoryNameUnique,
              price: data?.MenuItem?.PriceAfterDiscount,
              quantity: data?.MenuItem?.SelectedQuantity,
            },
          ],
        });

      // Snapchat event
      !!window.snaptr &&
        snaptr("track", "ADD_CART", {
          item_ids: [data?.MenuItem?.NameUnique],
          item_category: data?.MenuItem?.CategoryNameUnique,
          price: data?.MenuItem?.PriceAfterDiscount,
          description: data?.MenuItem?.Name,
          number_items: data?.MenuItem?.SelectedQuantity,
          currency: CurrencyISOCode,
          discount: data?.MenuItem?.DiscountAmount,
        });
    } else {
      // Facebook pixels
      !!window.fbq &&
        fbq("track", "RemoveFromCart", {
          content_type: "product",
          content_ids: [data?.MenuItem?.NameUnique],
          contents: [
            {
              index: 1,
              id: data?.MenuItem?.NameUnique,
              item_name: data?.MenuItem?.Name,
              item_category: data?.MenuItem?.CategoryNameUnique,
              price: data?.MenuItem?.PriceAfterDiscount,
              discount: data?.MenuItem?.DiscountAmount,
              quantity: data?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
            },
          ],
        });

      // Tiktok pixels
      !!window.ttq &&
        ttq.track("RemoveFromCart", {
          contents: [
            {
              content_type: "product",
              content_id: data?.MenuItem?.NameUnique,
              content_name: data?.MenuItem?.Name,
              discount: data?.MenuItem?.DiscountAmount,
              content_category: data?.MenuItem?.CategoryNameUnique,
              value: data?.MenuItem?.PriceAfterDiscount,
              quantity: data?.MenuItem?.SelectedQuantity,
              currency: CurrencyISOCode,
              description: "Product",
            },
          ],
        });

      // Google events
      !!window.gtag &&
        window.gtag("event", "remove_from_cart", {
          currency: CurrencyISOCode,
          value: data?.MenuItem?.PriceAfterDiscount,
          items: [
            {
              index: 1,
              item_id: data?.MenuItem?.NameUnique,
              item_name: data?.MenuItem?.Name,
              discount: data?.MenuItem?.DiscountAmount,
              item_category: data?.MenuItem?.CategoryNameUnique,
              price: data?.MenuItem?.PriceAfterDiscount,
              quantity: data?.MenuItem?.SelectedQuantity,
            },
          ],
        });

      // Snapchat events
      !!window.snaptr &&
        snaptr("track", "REMOVE_FROM_CART", {
          item_ids: [data?.MenuItem?.NameUnique],
          item_category: data?.MenuItem?.CategoryNameUnique,
          price: data?.MenuItem?.PriceAfterDiscount,
          description: data?.MenuItem?.Name,
          number_items: data?.MenuItem?.SelectedQuantity,
          currency: CurrencyISOCode,
          discount: data?.MenuItem?.DiscountAmount,
        });
    }

    return response;
  };

  // Handle Delete Cart Item
  const handleRemoveLineFromCart = async (
    requireInitailization: boolean,
    LineID: string,
    locale: string,
  ) => {
    if (!LineID)
      throw new Error("Missing Required Parameter: LineID | MenuItemData");

    const response = await dispatch(
      removeCartLineThunk({
        LineID,
        locale,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isItemNotFound = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.notFound,
      );

      if (isItemNotFound) {
        return location.reload();
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            // Instructions: orderLocation?.instructions,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle Transfer Cart
  const handleTransferCart = async (locale: string, userID?: string | null) => {
    const response = await dispatch(
      transferCartThunk({
        locale,
        userID,
      }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            // Instructions: orderLocation?.instructions,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle User Add PromoCode
  const handleApplyPromoCode = async (locale: string, Code: string) => {
    const response = await dispatch(
      applyPromoCodeThunk({ locale, Code }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle User Remove PromoCode
  const handleRemovePromoCode = async (locale: string, Code: string) => {
    const response = await dispatch(
      removePromoCodeThunk({ locale, Code }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle User Add Deal
  const handleApplyDeal = async (
    locale: string,
    values: ApplyDealValuesProps,
  ) => {
    const response = await dispatch(
      applyDealThunk({ locale, ...values }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }
    return response;
  };

  // Handle User Remove Deal
  const handleRemoveDeal = async (locale: string, DealHeaderID: string) => {
    const response = await dispatch(
      removeDealThunk({ locale, DealHeaderID }),
    ).unwrap();

    // Initialize cart in case of country require order type and cart already not initialized
    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }

      const missingParameterError = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.missingParameter,
      );

      if (
        missingParameterError &&
        (!selectedOrderTypeId || !orderLocation?.storeId)
      ) {
        dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

        return response;
      }

      const isCartExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.cartExpired,
      );

      if (isCartExpired) {
        const toaster = (await import("@/components/global/Toaster")).toaster;

        toaster.error({
          title: isCartExpired.Title,
          message: isCartExpired.Message,
        });

        console.log("Cart Expired from Remove");
        const response = await dispatch(
          initializeCartThunk({
            locale,
            OrderTypeID: selectedOrderTypeId,
            StoreID: orderLocation?.storeId,
            AddressID: orderLocation?.addressId,
            AreaID: orderLocation?.areaId,
            CityID: orderLocation?.cityId,
            Latitude: orderLocation?.lat,
            Longitude: orderLocation?.lng,
            Apartment: orderLocation?.apartment,
            Block: orderLocation?.block,
            Building: orderLocation?.building,
            Floor: orderLocation?.floor,
            Landmark: orderLocation?.landmark,
            Street: orderLocation?.street,
          }),
        ).unwrap();

        return response;
      }
    }

    return response;
  };

  // Handle Add Loyalty Deal
  const handleAddLoyaltyDeal = async (locale: string, DealHeaderID: string) => {
    const response = await dispatch(
      addLoyaltyDealThunk({ locale, DealHeaderID }),
    ).unwrap();

    if (response?.hasError) {
      const isTokenExpired = response?.errors?.find(
        (item) => item.Code === apiErrorCodes.tokenExpired,
      );

      if (isTokenExpired) {
        await clearServerCookie();

        window.location.replace(`/${locale}`);

        return response;
      }
    }

    return response;
  };

  return {
    cartData,
    cartItemsQty: TotalQuantity,
    totalPrice: Total,
    subTotal: SubTotal,
    SubTotalAfterDiscount,
    cartLines: Lines,
    findByLineId,
    findDealById,
    getCustomizations,
    handleAddMenuItemToCart,
    handleQuickAdd,
    handleEditCartItem,
    handleQuickUpdateCartItem,
    handleRemoveLineFromCart,
    handleTransferCart,
    handleApplyPromoCode,
    handleRemovePromoCode,
    handleApplyDeal,
    handleRemoveDeal,
    handleAddLoyaltyDeal,
  };
}
