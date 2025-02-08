import { createSlice } from "@reduxjs/toolkit";
// Types
import type { PayloadAction } from "@reduxjs/toolkit";
import { OrderLocationProps } from "@/types";

type OrderTypeIdProp = string | undefined;

type InitialStateProps = {
  selectedOrderTypeId: OrderTypeIdProp;
  orderLocation: OrderLocationProps;
};

const initialState: InitialStateProps = {
  selectedOrderTypeId: undefined,
  orderLocation: {
    cityId: undefined,
    storeId: undefined,
    addressId: undefined,
    areaId: undefined,
    apartment: undefined,
    block: undefined,
    building: undefined,
    floor: undefined,
    // instructions: undefined,
    landmark: undefined,
    street: undefined,
    lat: undefined,
    lng: undefined,
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderTypeId: (state, action: PayloadAction<string>) => {
      state.selectedOrderTypeId = action.payload;
    },
    setOrderLocation: (state, action: PayloadAction<OrderLocationProps>) => {
      state.orderLocation.addressId = action.payload.addressId;
      state.orderLocation.apartment = action.payload.apartment;
      state.orderLocation.areaId = action.payload.areaId;
      state.orderLocation.block = action.payload.block;
      state.orderLocation.building = action.payload.building;
      state.orderLocation.cityId = action.payload.cityId;
      state.orderLocation.floor = action.payload.floor;
      state.orderLocation.landmark = action.payload.landmark;
      state.orderLocation.lat = action.payload.lat;
      state.orderLocation.lng = action.payload.lng;
      state.orderLocation.storeId = action.payload.storeId;
      state.orderLocation.street = action.payload.street;
    },
  },
});

export const { setOrderTypeId, setOrderLocation } = orderSlice.actions;

export default orderSlice.reducer;
