import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./features/global/globalSlice";
import orderReducer from "./features/order/orderSlice";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalReducer,
      order: orderReducer,
      auth: authReducer,
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
