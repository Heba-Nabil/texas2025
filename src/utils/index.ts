import {
  CountryModuleProps,
  CountryResourcesProps,
  ErrorProps,
  OrderTypeCityProps,
  OrderTypeProps,
} from "@/types/api";

// SWR Fetcher
export async function clientSideFetch<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);

  const data = await response?.json();

  return data;
}

// Sort by Display Order
export function displayInOrder<T extends { DisplayOrder: number }>(
  data: T[],
): T[] {
  return data ? data.sort((a, b) => a.DisplayOrder - b.DisplayOrder) : [];
}

// Sort by Order
export function sortByOrder<T extends { Order: number }>(data: T[]): T[] {
  return data ? data.sort((a, b) => a.Order - b.Order) : [];
}

// Find Item by ID
export function findById<T extends { ID: string }>(data: T[], id: string) {
  return data?.find((item) => item.ID === id);
}

// Get City Stores
export function getCityStores(cities: OrderTypeCityProps[], cityId: string) {
  return cities?.find((city) => city.ID === cityId)?.Stores;
}

// Get City By Order Type Id and Store Id
export function getCityByOrderId(
  orderTypes: OrderTypeProps[] | undefined,
  orderTypeId: string,
  storeId: string,
) {
  return orderTypes
    ?.find((type) => type.ID === orderTypeId)
    ?.Cities?.find((city) =>
      city.Stores?.find((store) => store.ID === storeId),
    );
}

// Format Dates
export function getDateInHours(dateString: string, locale: string = "en") {
  const formattedDate = new Date(dateString).toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedDate;
}

// Format Date like Jan 19, 9:00 AM
export const formatDateInMonthDayTime = (
  dateString: any,
  locale: string = "en",
) => {
  const formattedDate = new Date(dateString).toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
};

export function formatDateTo24HourISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Refine Duplicated Data
export function refineDataById<T extends { ID: string }>(
  data: T[] | undefined,
): T[] {
  return data?.reduce((acc: T[], cur: T) => {
    if (!acc.find((item: T) => item.ID === cur.ID)) {
      acc.push(cur);
    }

    return acc;
  }, []) as T[];
}

// Get User Avatar Name
export const avatarName = (name: string) => {
  if (!name) return "";

  const nameArr = name
    ?.trim()
    ?.split(" ")
    ?.filter((item) => !!item);

  return nameArr.length > 1
    ? nameArr[0][0].toUpperCase() + nameArr[1][0].toUpperCase()
    : nameArr[0][0].toUpperCase();
};

// Remove >< Whitespaces from inputs
export function sanitizeInputs(
  inputs: { [keyTerm: string]: any },
  exceptions: string[] = [],
): { [keyTerm: string]: any } {
  return Object.entries(inputs).reduce(
    (sanitizedInputs: { [keyTerm: string]: any }, [keyTerm, value]) => {
      if (exceptions.includes(keyTerm)) {
        sanitizedInputs[keyTerm] = value;
      } else {
        if (typeof keyTerm === "string") {
          sanitizedInputs[keyTerm] = value.trim().replace(/[<>*#]/g, "");
        } else {
          sanitizedInputs[keyTerm] = value;
        }
      }
      return sanitizedInputs;
    },
    {} as { [keyTerm: string]: any },
  );
}

// Response Handlers for Server Fetchs
export function errorResponse(responseCode: number, errors: ErrorProps[]) {
  return {
    hasError: true,
    errors,
    responseCode,
    data: null,
  };
}
export function successResponse(responseCode: number, data: any) {
  return {
    hasError: false,
    errors: [],
    responseCode,
    data,
  };
}

//sort by newest date
export function sortByDate<T extends { CreatedDate: string }>(
  notifications: T[],
): T[] {
  return notifications
    ? notifications.sort(
        (a, b) =>
          new Date(b.CreatedDate).getTime() - new Date(a.CreatedDate).getTime(),
      )
    : [];
}

// Get greeting
export function getGreeting(resources: {
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
}): string {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return resources?.goodMorning;
  } else if (currentHour >= 12 && currentHour < 17) {
    return resources?.goodAfternoon;
  } else {
    return resources?.goodEvening;
  }
}

export function formatPointsInK(points: number) {
  return points >= 1000 ? `${(points / 1000).toFixed(2)}k` : points;
}

export function convertResourcesToMessages(
  resources: CountryResourcesProps[],
  locale: string,
) {
  if (!resources || resources?.length === 0) return {};

  const localeResources = resources?.filter(
    (item) => item.LanguageCode === locale,
  );

  const messages = localeResources?.reduce((obj, item) => {
    return {
      ...obj,
      [item.Name]: item.Value,
    };
  }, {});

  return messages;
}

// Get Location Difference
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance.toFixed(2);
}

// Module Filtration
export function findModuleItem(
  modules: CountryModuleProps[] | undefined,
  moduleName: string,
) {
  return modules?.find((module) => module?.Name === moduleName);
}

// Check is Module Active
export function isModuleOn(modules: CountryModuleProps[], moduleName: string) {
  return modules?.find(
    (item) => item.Name.toLowerCase() === moduleName.toLowerCase(),
  )?.Status;
}
