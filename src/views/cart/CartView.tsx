"use client";

import { useEffect, useMemo } from "react";
import useCart from "@/hooks/useCart";
import { useRouter } from "@/navigation";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { useData } from "@/providers/DataProvider";
import { mutatePath } from "@/server/actions";
import { Button } from "@/components/ui/button";
import EmptyCart from "@/components/emptyStates/EmptyCart";
import CartItemsWrapper from "./CartItemsWrapper";
import CartSummary from "./CartSummary";
import CompleteMealWrapper from "./CompleteMealWrapper";
// Types
import { CartPageResourcesProps } from "@/types/resources";
import { CategoryItemProps, UserDealsResponseProps } from "@/types/api";
import {
  facebookAnalyticItems,
  googleAnalyticItems,
  tiktokAnalyticItems,
} from "@/types/analytics";

type CartViewProps = {
  resources: CartPageResourcesProps;
  locale: string;
  userDeals?: UserDealsResponseProps[] | null;
  suggestiveItems?: CategoryItemProps[] | null;
};

export default function CartView(props: CartViewProps) {
  const { resources, locale, userDeals, suggestiveItems } = props;

  const router = useRouter();

  const dispatch = useAppDispatch();

  const {
    Data: {
      CurrencyName,
      CurrencyISOCode,
      IsCartOrderTypeRequired,
      MinOrderValue,
    },
  } = useData();

  const { cartData, cartItemsQty, handleRemoveDeal } = useCart();

  const currentDealId = cartData?.DealHeaderID;
  const currentDeal = userDeals?.find((item) => item.ID === currentDealId);

  const removeDealFromClient = async (id: string) => {
    if (!id) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await handleRemoveDeal(locale, id);
      console.log(response);

      if (response?.hasError) {
        router.refresh();

        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutatePath("/cart");

      toaster.success({ message: resources["dealRemoveSuccess"] });
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };
  // Facebook analytics items
  const facebookMenuItems: facebookAnalyticItems = useMemo(() => {
    return cartData?.Lines?.map((item, index) => ({
      index: index,
      id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      discount: item?.MenuItem?.DiscountAmount || 0,
      item_category: item?.MenuItem?.CategoryNameUnique,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }));
  }, [cartData, CurrencyISOCode]);

  // Tiktok analytics items
  const tiktokMenuItems: tiktokAnalyticItems = useMemo(() => {
    return cartData?.Lines?.map((item, index) => ({
      index: index,
      content_id: item?.MenuItem?.NameUnique,
      content_name: item?.MenuItem?.Name,
      content_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      value: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
      content_type: "product",
      description: "Product",
    }));
  }, [cartData, CurrencyISOCode]);
  // Google analytics items
  const googleMenuItems: googleAnalyticItems = useMemo(() => {
    return cartData?.Lines?.map((item, index) => ({
      index: index,
      item_id: item?.MenuItem?.NameUnique,
      item_name: item?.MenuItem?.Name,
      item_category: item?.MenuItem?.CategoryNameUnique,
      discount: item?.MenuItem?.DiscountAmount || 0,
      price: item?.MenuItem?.PriceAfterDiscount,
      quantity: item?.MenuItem?.SelectedQuantity || 1,
      currency: CurrencyISOCode,
    }));
  }, [cartData, CurrencyISOCode]);

  const facebookContentID: string[] = useMemo(() => {
    return cartData?.Lines?.map((item) => item?.MenuItem?.NameUnique);
  }, [cartData]);

  const totalCartPrice: number = cartData?.Lines?.reduce(
    (acc, item) => acc + item?.MenuItem?.PriceAfterDiscount,
    0,
  );

  useEffect(() => {
    // Facebook pixels
    !!window.fbq &&
      fbq("track", "ViewContent", {
        content_type: "product_group",
        content_ids: facebookContentID,
        contents: facebookMenuItems,
      });

    // Tiktok pixels
    !!window.ttq &&
      ttq.track("ViewContent", {
        content_type: "product_group",
        contents: tiktokMenuItems,
      });

    // Google events
    !!window.gtag &&
      window.gtag("event", "view_cart", {
        currency: CurrencyISOCode,
        value: totalCartPrice,
        items: googleMenuItems,
      });

    // Snapchat pixels
    !!window.snaptr &&
      snaptr("track", "VIEW_CONTENT", {
        contents: facebookMenuItems,
        item_ids: cartData?.Lines?.map((item) => item?.MenuItem?.NameUnique),
        item_category: cartData?.Lines?.map(
          (item) => item?.MenuItem?.CategoryNameUnique,
        ),
        price: cartData?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.PriceAfterDiscount,
          0,
        ),
        item_name: cartData?.Lines?.map((item) => item?.MenuItem?.Name),
        number_items: cartData?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.SelectedQuantity,
          0,
        ),
        currency: CurrencyISOCode,
        discount: cartData?.Lines?.reduce(
          (total, item) => total + item?.MenuItem?.DiscountAmount,
          0,
        ),
      });
  }, [
    cartData,
    facebookContentID,
    CurrencyISOCode,
    facebookMenuItems,
    googleMenuItems,
    tiktokMenuItems,
    totalCartPrice,
  ]);

  return (
    <div className="flex w-full flex-col bg-gray-100 max-lg:pb-16">
      <div className="container flex-grow py-10">
        {cartItemsQty < 1 && (
          <div className="flex-center my-2 w-full">
            <div className="flex-center max-w-md flex-col">
              <EmptyCart
                resources={{
                  cartEmpty: resources["cartEmpty"],
                  cartEmptyDesc: resources["cartEmptyDesc"],
                }}
                locale={locale}
              />

              <Button onClick={() => router.push("/menu")}>
                {resources["exploreMenu"]}
              </Button>
            </div>
          </div>
        )}

        {cartItemsQty > 0 && (
          <div className="grid w-full grid-cols-12 gap-6">
            <div className="col-span-full lg:col-span-8">
              <div className="rounded-lg bg-white">
                <CartItemsWrapper
                  data={cartData}
                  resources={resources}
                  currency={CurrencyName}
                  IsCartOrderTypeRequired={IsCartOrderTypeRequired}
                  locale={locale}
                  userDeals={userDeals}
                  currentDeal={currentDeal}
                  removeDealFromClient={removeDealFromClient}
                />

                <div className="my-6 border-2" />

                {suggestiveItems && suggestiveItems.length > 0 && (
                  <CompleteMealWrapper
                    data={suggestiveItems}
                    locale={locale}
                    resources={resources}
                    currency={CurrencyName}
                  />
                )}
              </div>
            </div>

            <div className="col-span-full lg:col-span-4">
              <CartSummary
                resources={resources}
                data={cartData}
                currency={CurrencyName}
                MinOrderValue={MinOrderValue}
                locale={locale}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
