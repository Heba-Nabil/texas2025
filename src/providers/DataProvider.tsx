"use client";

import { createContext, useContext } from "react";
// Types
import { SingleCountryDataProps } from "@/types/api";

const DataContext = createContext<SingleCountryDataProps>(
  {} as SingleCountryDataProps,
);

export const useData = () => useContext<SingleCountryDataProps>(DataContext);

type DataProviderProps = {
  children: React.ReactNode;
  data: SingleCountryDataProps;
};

export default function DataProvider(props: DataProviderProps) {
  const { children, data } = props;

  return (
    <DataContext.Provider
      value={{
        ...data,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
