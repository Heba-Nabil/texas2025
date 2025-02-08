"use client";

import DataProvider from "./DataProvider";
import StoreProvider from "./StoreProvider";
// Types
import {
  ClientSessionProps,
  GenericResponse,
  OrderLocationProps,
} from "@/types";
import { CartProps, SingleCountryDataProps } from "@/types/api";

type ProvidersProps = {
  children: React.ReactNode;
  countryData: SingleCountryDataProps;
  session: ClientSessionProps;
  orderTypeId: string | undefined;
  orderLocation: OrderLocationProps;
  allowTracking: string | undefined;
  cartItems: GenericResponse<CartProps>;
};

export default function Providers(props: ProvidersProps) {
  const {
    children,
    countryData,
    session,
    orderTypeId,
    orderLocation,
    allowTracking,
    cartItems,
  } = props;

  return (
    <DataProvider data={countryData}>
      <StoreProvider
        orderTypeId={orderTypeId}
        orderLocation={orderLocation}
        session={session}
        allowTracking={session?.isLoggedIn || allowTracking}
        cartItems={cartItems}
      >
        {children}
      </StoreProvider>
    </DataProvider>
  );
}
