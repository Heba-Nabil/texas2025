import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientSideFetch } from "@/utils";
import { apiErrorCodes, routeHandlersKeys } from "@/utils/constants";
import { toggleModal } from "../global/globalSlice";
// Types
import {
  ApplyDealValuesProps,
  GenericResponse,
  RefactorMenuItem,
} from "@/types";
import {
  CartActionResponseProps,
  CartProps,
  UserSingleDealResponseProps,
} from "@/types/api";

type InitializeCartDataProps = {
  locale: string;
  OrderTypeID: string | undefined;
  StoreID: string | undefined;
  CityID?: string;
  AreaID?: string;
  AddressID?: string;
  Block?: string;
  Street?: string;
  Building?: string;
  Floor?: string;
  Apartment?: string;
  Landmark?: string;
  // Instructions?: string;
  Latitude?: number;
  Longitude?: number;
};

export const initializeCartThunk = createAsyncThunk(
  "cart/initializeCartStatus",
  async (data: InitializeCartDataProps, { dispatch }) => {
    const { locale, ...rest } = data;

    // Incase of there is no order type id or store id open select order type modal
    if (!data?.OrderTypeID || !data?.StoreID) {
      dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

      return {
        hasError: true,
        errors: [],
        responseCode: apiErrorCodes.missingParameter,
        data: null,
      };
    } else {
      const response = await clientSideFetch<GenericResponse<string>>(
        `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.initializeCart}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...rest,
          }),
        },
      );

      return response;
    }
  },
);

type AddToCartThunkDataProps = {
  OrderTypeID: string | undefined;
  StoreID: string | undefined;
  MenuItem: RefactorMenuItem;
  locale: string;
};

export const addToCartThunk = createAsyncThunk(
  "cart/addToCartStatus",
  async (data: AddToCartThunkDataProps, { dispatch }) => {
    const { locale, ...rest } = data;

    // Incase of there is no order type id or store id open select order type modal
    if (!data?.OrderTypeID || !data?.StoreID) {
      dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

      return {
        hasError: true,
        errors: [],
        responseCode: apiErrorCodes.missingParameter,
        data: null,
      };
    }

    const response = await clientSideFetch<
      GenericResponse<CartActionResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.addToCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

type QuickAddToCartThunkDataProps = {
  OrderTypeID: string | undefined;
  StoreID: string | undefined;
  MenuItemID: string;
  SelectedQuantity: number;
  locale: string;
};

export const quickAddToCartThunk = createAsyncThunk(
  "cart/quickAddToCartStatus",
  async (data: QuickAddToCartThunkDataProps, { dispatch }) => {
    const { locale, ...rest } = data;

    // Incase of there is no order type id or store id open select order type modal
    if (!data?.OrderTypeID || !data?.StoreID) {
      dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

      return {
        hasError: true,
        errors: [],
        responseCode: apiErrorCodes.missingParameter,
        data: null,
      };
    }

    const response = await clientSideFetch<
      GenericResponse<CartActionResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.quickAddToCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

type UpdateCartLineThunkDataProps = {
  OrderTypeID: string | undefined;
  StoreID: string | undefined;
  LineID: string;
  MenuItem: RefactorMenuItem;
  locale: string;
};

export const updateCartLineThunk = createAsyncThunk(
  "cart/updateCartLineStatus",
  async (data: UpdateCartLineThunkDataProps, { dispatch }) => {
    const { locale, LineID, ...rest } = data;

    // Incase of there is no order type id or store id open select order type modal
    if (!data?.OrderTypeID || !data?.StoreID) {
      dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

      return {
        hasError: true,
        errors: [],
        responseCode: apiErrorCodes.missingParameter,
        data: null,
      };
    }

    const response = await clientSideFetch<
      GenericResponse<CartActionResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.updateCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: data?.LineID,
          ...rest,
        }),
      },
    );

    return response;
  },
);

type QuickUpdateCartLineThunkDataProps = {
  OrderTypeID: string | undefined;
  StoreID: string | undefined;
  LineID: string;
  MenuItemID: string;
  SelectedQuantity: number;
  locale: string;
};

export const quickUpdateCartLineThunk = createAsyncThunk(
  "cart/quickUpdateCartLineStatus",
  async (data: QuickUpdateCartLineThunkDataProps, { dispatch }) => {
    const { locale, LineID, ...rest } = data;

    // Incase of there is no order type id or store id open select order type modal
    if (!data?.OrderTypeID || !data?.StoreID) {
      dispatch(toggleModal({ orderTypeModal: { isOpen: true } }));

      return {
        hasError: true,
        errors: [],
        responseCode: apiErrorCodes.missingParameter,
        data: null,
      };
    }

    const response = await clientSideFetch<
      GenericResponse<CartActionResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.quickUpdateCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: data?.LineID,
          ...rest,
        }),
      },
    );

    return response;
  },
);

type removeCartLineThunkDataProps = {
  LineID: string;
  locale: string;
};

export const removeCartLineThunk = createAsyncThunk(
  "cart/removeCartLineStatus",
  async (data: removeCartLineThunkDataProps) => {
    const { locale, LineID, ...rest } = data;

    const response = await clientSideFetch<
      GenericResponse<CartActionResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.removeFromCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: data?.LineID,
          ...rest,
        }),
      },
    );

    return response;
  },
);

type transferCartThunkDataProps = {
  locale: string;
  userID?: string | null;
};

export const transferCartThunk = createAsyncThunk(
  "cart/transferCartStatus",
  async (data: transferCartThunkDataProps) => {
    const { locale, userID } = data;

    const response = await clientSideFetch<GenericResponse<any>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.transferCart}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: userID,
        }),
      },
    );

    return response;
  },
);

// Start of PromoCode
type ApplyPromoCodeThunkDataProps = {
  locale: string;
  Code: string;
};

export const applyPromoCodeThunk = createAsyncThunk(
  "cart/applyPromoCodeStatus",
  async (data: ApplyPromoCodeThunkDataProps) => {
    const { locale, Code } = data;

    const response = await clientSideFetch<GenericResponse<CartProps>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.applyPromoCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Code,
        }),
      },
    );

    return response;
  },
);

type RemovePromoCodeThunkDataProps = {
  locale: string;
  Code: string;
};

export const removePromoCodeThunk = createAsyncThunk(
  "cart/removePromoCodeStatus",
  async (data: RemovePromoCodeThunkDataProps) => {
    const { locale, Code } = data;

    const response = await clientSideFetch<GenericResponse<CartProps>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.removePromoCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Code,
        }),
      },
    );

    return response;
  },
);
// End of PromoCode

// Start of Cart Deals
type ApplyDealThunkDataProps = ApplyDealValuesProps & {
  locale: string;
};

export const applyDealThunk = createAsyncThunk(
  "cart/applyDealStatus",
  async (data: ApplyDealThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<GenericResponse<CartProps>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.applyDeal}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

type RemoveDealThunkDataProps = {
  locale: string;
  DealHeaderID: string;
};

export const removeDealThunk = createAsyncThunk(
  "cart/removeDealStatus",
  async (data: RemoveDealThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<GenericResponse<CartProps>>(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.removeDeal}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);
// End of Cart Deals

// Start of Loyalty Deals
type AddLoyaltyDealThunkDataProps = {
  locale: string;
  DealHeaderID: string;
};

export const addLoyaltyDealThunk = createAsyncThunk(
  "cart/addLoyaltyDealStatus",
  async (data: AddLoyaltyDealThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<
      GenericResponse<UserSingleDealResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${locale}${routeHandlersKeys.addLoyaltyDeal}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);
// End of Loyalty Deals
