import { getTranslations } from "next-intl/server";
import { getHomeBanners } from "@/server/services/homeService";
import { getMenuCategories } from "@/server/services/menuService";
import { displayInOrder } from "@/utils";
import HomeView from "@/views/home/HomeView";
// Types
import type { Metadata } from "next";
import { HomePageResources } from "@/types/resources";
import { HomeBannerEnum } from "@/types/enums";

type HomePageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata(
  props: HomePageProps,
): Promise<Metadata> {
  return {
    title: "Home",
  };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const [t, homeBannersResponse, menuCategoriesResponse] = await Promise.all([
    getTranslations(),
    getHomeBanners(locale),
    getMenuCategories(locale),
  ]);

  const resources: HomePageResources = {
    exploreMenuCategories: t("exploreMenuCategories"),
    viewAll: t("viewAll"),
    bestSeller: t("bestSeller"),
    topDeals: t("topDeals"),
    texasChicken: t("texasChicken"),
    download: t("download"),
    apps: t("apps"),
    worldOfTexas: t("worldOfTexas"),
    addToCart: t("addToCart"),
    customize: t("customize"),
    kcal: t("kcal"),
    addToFavSuccess: t("addToFavSuccess"),
    removeFromFavSuccess: t("removeFromFavSuccess"),
    off: t("off"),
    orderAgain: t("orderAgain"),
    currentOrders: t("currentOrders"),
    item: t("item"),
    items: t("items"),
    noOrdersYet: t("noOrdersYet"),
    orderNo: t("orderNo"),
    orderNow: t("orderNow"),
    pastOrders: t("pastOrders"),
    reorder: t("reorder"),
    trackOrder: t("trackOrder"),
    viewDetails: t("viewDetails"),
    orderType: t("orderType"),
  };

  const homeBannersData = homeBannersResponse?.data;

  if (!homeBannersData) return null;

  const bannerData = displayInOrder(
      homeBannersData?.filter((item) => item.TypeID === HomeBannerEnum.banner),
    ),
    bestSellerData = displayInOrder(
      homeBannersData?.filter(
        (item) => item.TypeID === HomeBannerEnum.bestSeller,
      ),
    ),
    featuredBannerData = displayInOrder(
      homeBannersData?.filter(
        (item) => item.TypeID === HomeBannerEnum.featuredBanner,
      ),
    ),
    worldOfTexasData = displayInOrder(
      homeBannersData?.filter(
        (item) => item.TypeID === HomeBannerEnum.worldOfTexas,
      ),
    );

  const categoriesData = menuCategoriesResponse?.data
    ? displayInOrder(menuCategoriesResponse?.data)
    : [];

  return (
    <HomeView
      locale={locale}
      resources={resources}
      categoriesData={categoriesData}
      bannerData={bannerData}
      bestSellerData={bestSellerData}
      worldOfTexasData={worldOfTexasData}
      featuredBannerData={featuredBannerData}
    />
  );
}
