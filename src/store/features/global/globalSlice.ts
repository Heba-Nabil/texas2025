import {
  UserDealsResponseProps,
  UserSingleDealResponseProps,
} from "@/types/api";
import { createSlice } from "@reduxjs/toolkit";
// Types
import type { PayloadAction } from "@reduxjs/toolkit";

type OrderTypeIdProp = string;

type InitialStateProps = {
  activeOrderType: OrderTypeIdProp;
  showDashboardPages: boolean;
  modals: {
    changeCountryModal: { isOpen: boolean };
    orderTypeModal: { isOpen: boolean; redirect?: string };
    loadingModal: { isOpen: boolean };
    logOutModal: { isOpen: boolean };
    allowTrackingModal: { isOpen: boolean };
    completeInfoModal: {
      isOpen: boolean;
      data?: {
        firstName: string;
        lastName: string;
        email: string;
        id: string | null;
        type: string | null;
      };
    };
    clearCartModal: {
      isOpen: boolean;
      data?: {
        message: string;
        orderTypeId: string;
        storeId: string;
        cityId?: string;
        areaId?: string;
        addressId?: string;
        block?: string;
        street?: string;
        building?: string;
        floor?: string;
        apartment?: string;
        landmark?: string;
        // instructions?: string;
        lng?: number;
        lat?: number;
      } | null;
      cb?: any;
    };
    deleteCartItemModal: {
      isOpen: boolean;
      data?: {
        orderTypeId: string;
        storeId: string;
        lineID: string;
      } | null;
    };
    menuItemCustomizationsModal: {
      isOpen: boolean;
      data?: {
        id: string;
        menuItemNameUnique: string;
        categoryNameUnique: string;
      } | null;
    };
    deleteAddressModal: {
      isOpen: boolean;
      data?: {
        AddressID: string;
      } | null;
    };
    addressModal: {
      isOpen: boolean;
      data?: { AddressID: string } | null;
      cb?: any;
    };
    confirmToggleDealModal: {
      isOpen: boolean;
      data?: UserDealsResponseProps | null;
    };
    singleDealWithListModal: {
      isOpen: boolean;
      data?: UserSingleDealResponseProps | null;
    };
  };
};

type PartialRecord<K extends keyof InitialStateProps["modals"], T> = {
  [P in K]?: T;
};

type ModalPayloadActionProps = PartialRecord<
  keyof InitialStateProps["modals"],
  { isOpen: boolean; redirect?: string; data?: any; cb?: any }
>;

const initialState: InitialStateProps = {
  activeOrderType: "",
  showDashboardPages: false,
  modals: {
    changeCountryModal: { isOpen: false },
    orderTypeModal: { isOpen: false },
    loadingModal: { isOpen: false },
    logOutModal: { isOpen: false },
    allowTrackingModal: { isOpen: true },
    addressModal: {
      isOpen: false,
      data: null,
    },
    completeInfoModal: {
      isOpen: false,
      data: { firstName: "", lastName: "", email: "", id: null, type: null },
    },
    clearCartModal: {
      isOpen: false,
      data: {
        orderTypeId: "",
        storeId: "",
        message: "",
      },
      cb: null,
    },
    deleteCartItemModal: {
      isOpen: false,
      data: {
        orderTypeId: "",
        storeId: "",
        lineID: "",
      },
    },
    menuItemCustomizationsModal: {
      isOpen: false,
      data: null,
    },
    deleteAddressModal: {
      isOpen: false,
      data: null,
    },
    confirmToggleDealModal: {
      isOpen: false,
      data: null,
    },
    singleDealWithListModal: {
      isOpen: false,
      data: null,
    },
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setActiveOrderType: (state, action: PayloadAction<OrderTypeIdProp>) => {
      state.activeOrderType = action.payload;
    },
    toggleShowDashboardPages: (state, action: PayloadAction<boolean>) => {
      state.showDashboardPages = action.payload;
    },
    toggleModal: (state, action: PayloadAction<ModalPayloadActionProps>) => {
      const modalKey = Object.keys(action.payload)[0];

      state.modals[modalKey as keyof InitialStateProps["modals"]] =
        Object.values(action.payload)[0];
    },
  },
  selectors: {
    getActiveOrderType: (state) => state.activeOrderType,
    getShowDashboardPages: (state) => state.showDashboardPages,
    getModals: (state) => state.modals,
  },
});

export const { setActiveOrderType, toggleShowDashboardPages, toggleModal } =
  globalSlice.actions;

export const { getActiveOrderType, getShowDashboardPages, getModals } =
  globalSlice.selectors;

export default globalSlice.reducer;
