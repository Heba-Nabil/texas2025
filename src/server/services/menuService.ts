import { notFound, RedirectType } from "next/navigation";
import getRequestHeaders, {
  getCommonHeaders,
} from "@/server/lib/getRequestHeaders";
import { isAuthenticated } from "@/server/lib/auth";
import { redirect } from "@/navigation";
import { apiEndpoints } from "@/utils/constants";
import apiFetcher from "@/server/lib/apiFetcher";
import { displayInOrder } from "@/utils";
// Types
import { GenericResponse } from "@/types";
import {
  CategoryItemProps,
  MealItemProps,
  MenuCategoryProps,
  MenuSinlgeCategoryProps,
} from "@/types/api";

export async function getMenuCategories(
  lang: string,
): Promise<GenericResponse<MenuCategoryProps[]>> {
  const { orderTypeId, orderLocation } = getRequestHeaders(lang);

  const commonHeaders = getCommonHeaders(lang);

  const AccessToken = await isAuthenticated();
  // if (!AccessToken) return redirect("/login", RedirectType.push);

  const body = {
    StoreID: orderLocation?.storeId,
    OrderTypeID: orderTypeId,
  };

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken as string,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.menuCategories, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  if (response?.data) {
    return {
      ...response,
      data: displayInOrder(response?.data),
    };
  } else {
    return response;
  }
}

export async function getMenuCategory(
  lang: string,
  categorySlug: string,
): Promise<GenericResponse<MenuSinlgeCategoryProps>> {
  const { orderTypeId, orderLocation } = getRequestHeaders(lang);
  const commonHeaders = getCommonHeaders(lang);

  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const body = {
    NameUnique: decodeURI(categorySlug),
    StoreID: orderLocation?.storeId,
    OrderTypeID: orderTypeId,
  };

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken as string,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.menuCategory, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  // if (response?.hasError) return notFound();

  return response;
}

export async function getMenuCategoryItem(
  lang: string,
  itemSlug: string,
): Promise<GenericResponse<MealItemProps>> {
  const { orderTypeId, orderLocation } = getRequestHeaders(lang);
  const commonHeaders = getCommonHeaders(lang);

  const AccessToken = await isAuthenticated();
  if (!AccessToken) return redirect("/login", RedirectType.push);

  const body = {
    NameUnique: decodeURI(itemSlug),
    StoreID: orderLocation?.storeId,
    OrderTypeID: orderTypeId,
  };

  const headers = {
    "Content-Type": "application/json",
    AccessToken: AccessToken as string,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.menuItem, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  if (response?.hasError) return notFound();

  return response;
}

export async function getTopDeals(
  lang: string,
): Promise<GenericResponse<CategoryItemProps[]>> {
  const { orderTypeId, orderLocation } = getRequestHeaders(lang);
  const commonHeaders = getCommonHeaders(lang);

  // const AccessToken = await isAuthenticated();
  // if (!AccessToken) return redirect("/login", RedirectType.push);

  const body = {
    StoreID: orderLocation?.storeId || "",
    OrderTypeID: orderTypeId || "",
  };

  const headers = {
    "Content-Type": "application/json",
    // AccessToken: AccessToken as string,
    ...commonHeaders,
  };

  const response = await apiFetcher(apiEndpoints.topDeals, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  return response;
}
