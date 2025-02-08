import { getTranslations } from "next-intl/server";
import { getSession } from "@/server/lib/auth";
import { getUserDeals } from "@/server/services/dealsService";
import { getSuggestiveItems } from "@/server/services/cartService";
import CartView from "@/views/cart/CartView";
// Types
import type { Metadata } from "next";
import { CartPageResourcesProps } from "@/types/resources";

type CartPageProps = {
  params: { locale: string };
};

export async function generateMetadata(
  props: CartPageProps,
): Promise<Metadata> {
  return {
    title: "Cart",
  };
}

export default async function CartPage(props: CartPageProps) {
  const {
    params: { locale },
  } = props;

  const [t, session] = await Promise.all([getTranslations(), getSession()]);

  const userId = session?.userId;

  let dealsResponse;

  if (userId) {
    dealsResponse = await getUserDeals(locale);
  }

  const suggestiveItemsResponse = await getSuggestiveItems(locale);

  const resources: CartPageResourcesProps = {
    cartEmpty: t("cartEmpty"),
    cartEmptyDesc: t("cartEmptyDesc"),
    exploreMenu: t("exploreMenu"),
    cart: t("cart"),
    removeAll: t("removeAll"),
    orderSummary: t("orderSummary"),
    addMoreFood: t("addMoreFood"),
    addMoreFoodDesc: t("addMoreFoodDesc"),
    subTotal: t("subTotal"),
    deliveryFees: t("deliveryFees"),
    tax: t("tax"),
    discount: t("discount"),
    orderNow: t("orderNow"),
    items: t("items"),
    item: t("item"),
    viewCart: t("viewCart"),
    edit: t("edit"),
    orderMinValueMessage: t("orderMinValueMessage"),
    customized: t("customized"),
    apply: t("apply"),
    promoCodeRegexErrorMessage: t("promoCodeRegexErrorMessage"),
    character: t("character"),
    enterPromoCode: t("enterPromoCode"),
    maxLength: t("maxLength"),
    promocode: t("promocode"),
    promocodeRequired: t("promocodeRequired"),
    remove: t("remove"),
    applied: t("applied"),
    promoCodeDiscount: t("promoCodeDiscount"),
    minLength: t("minLength"),
    dealsDiscount: t("dealsDiscount"),
    removeDeal: t("removeDeal"),
    editDeal: t("editDeal"),
    dealRemoveSuccess: t("dealRemoveSuccess"),
    viewAll: t("viewAll"),
    whatYouNeedToCustomize: t("whatYouNeedToCustomize"),
    free: t("free"),
    total: t("total"),
    allPricesAreVatInclusive: t("allPricesAreVatInclusive"),
    dealAppliedSuccess: t("dealAppliedSuccess"),
    anotherDeals: t("anotherDeals"),
    youAlreadyHaveOneInYourCart: t("youAlreadyHaveOneInYourCart"),
    allDeals: t("allDeals"),
    youWillEarn: t("youWillEarn"),
    points: t("points"),
    completeYourMeal: t("completeYourMeal"),
    addToCart: t("addToCart"),
    addToFavSuccess: t("addToFavSuccess"),
    customize: t("customize"),
    kcal: t("kcal"),
    off: t("off"),
    removeFromFavSuccess: t("removeFromFavSuccess"),
  };

  return (
    <CartView
      resources={resources}
      locale={locale}
      userDeals={dealsResponse?.data}
      suggestiveItems={suggestiveItemsResponse?.data}
    />
  );
}
