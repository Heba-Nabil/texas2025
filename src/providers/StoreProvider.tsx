"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { cartInitialState } from "@/utils/constants";
import { AppStore, makeStore } from "@/store";
import {
  setOrderTypeId,
  setOrderLocation,
} from "@/store/features/order/orderSlice";
import { toggleModal } from "@/store/features/global/globalSlice";
import { loadCart } from "@/store/features/cart/cartSlice";
// Types
import {
  ClientSessionProps,
  GenericResponse,
  OrderLocationProps,
} from "@/types";
import { updateSession } from "@/store/features/auth/authSlice";
import { CartProps } from "@/types/api";

type StoreProviderProps = {
  children: React.ReactNode;
  orderTypeId: string | undefined;
  orderLocation: OrderLocationProps;
  session: ClientSessionProps;
  allowTracking: string | undefined | boolean;
  cartItems: GenericResponse<CartProps>;
};

export default function StoreProvider(props: StoreProviderProps) {
  const {
    children,
    orderTypeId,
    orderLocation,
    session,
    allowTracking,
    cartItems,
  } = props;

  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // Set Default Order Data
    orderTypeId && storeRef.current.dispatch(setOrderTypeId(orderTypeId));
    storeRef.current.dispatch(setOrderLocation(orderLocation));

    // Default value to open allow tracking modal
    storeRef.current.dispatch(
      toggleModal({ allowTrackingModal: { isOpen: !allowTracking } }),
    );

    // Default Session
    storeRef.current.dispatch(updateSession(session));

    // Load Cart Items
    storeRef.current.dispatch(
      loadCart(cartItems?.data ? cartItems?.data : cartInitialState),
    );
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
