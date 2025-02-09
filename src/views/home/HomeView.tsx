import dynamic from "next/dynamic";
import HomeBanner from "./banner/HomeBanner";
import BestSeller from "./best-seller/BestSeller";
import ExploreMenu from "./explore-menu/ExploreMenu";
import TopDealsPlaceholder from "./top-deals/TopDealsPlaceholder";
import FeaturedBanner from "./featured-banner/FeaturedBanner";
import OrderAgainPlaceholder from "./order-again/OrderAgainPlaceholder";
import AppsSectionPlaceholder from "./apps/AppsSectionPlaceholder";
// Types
import { HomeBannerResponseProps, MenuCategoryProps } from "@/types/api";
import { HomePageResources } from "@/types/resources";

const DynamicTopDeals = dynamic(() => import("./top-deals/TopDeals"), {
  loading: () => <TopDealsPlaceholder />,
});

const DynamicOrderAgain = dynamic(() => import("./order-again/OrderAgain"), {
  loading: () => <OrderAgainPlaceholder />,
});

const DynamicWorldOfTexas = dynamic(
  () => import("./world-of-texas/WorldOfTexas"),
);

const DynamicAppsSection = dynamic(() => import("./apps/AppsSection"), {
  loading: () => <AppsSectionPlaceholder />,
});

type HomeViewProps = {
  locale: string;
  resources: HomePageResources;
  bannerData: HomeBannerResponseProps[];
  bestSellerData: HomeBannerResponseProps[];
  featuredBannerData: HomeBannerResponseProps[];
  worldOfTexasData: HomeBannerResponseProps[];
};

export default function HomeView(props: HomeViewProps) {
  const {
    locale,
    resources,
    bannerData,
    bestSellerData,
    worldOfTexasData,
    featuredBannerData,
  } = props;

  return (
    <div className="w-full flex-grow">
      {bannerData?.length > 0 && (
        <HomeBanner locale={locale} data={bannerData} />
      )}

      <div className="mb-3" />

      <ExploreMenu
        locale={locale}
        resources={{
          exploreMenuCategories: resources["exploreMenuCategories"],
          viewAll: resources["viewAll"],
        }}
      />

      <div className="mb-8" />

      {bestSellerData?.length > 0 && (
        <BestSeller
          locale={locale}
          data={bestSellerData}
          resources={{
            bestSeller: resources["bestSeller"],
            viewAll: resources["viewAll"],
          }}
        />
      )}

      <div className="mb-8" />

      <DynamicTopDeals
        locale={locale}
        resources={{
          topDeals: resources["topDeals"],
          viewAll: resources["viewAll"],
          addToCart: resources["addToCart"],
          customize: resources["customize"],
          kcal: resources["kcal"],
          addToFavSuccess: resources["addToFavSuccess"],
          removeFromFavSuccess: resources["removeFromFavSuccess"],
          off: resources["off"],
        }}
      />

      <DynamicOrderAgain
        locale={locale}
        resources={{
          orderAgain: resources["orderAgain"],
          viewAll: resources["viewAll"],
          currentOrders: resources["currentOrders"],
          item: resources["item"],
          items: resources["items"],
          noOrdersYet: resources["noOrdersYet"],
          orderNo: resources["orderNo"],
          orderNow: resources["orderNow"],
          pastOrders: resources["pastOrders"],
          reorder: resources["reorder"],
          trackOrder: resources["trackOrder"],
          viewDetails: resources["viewDetails"],
          orderType: resources["orderType"],
        }}
      />

      {featuredBannerData?.length > 0 && (
        <FeaturedBanner locale={locale} data={featuredBannerData} />
      )}

      {worldOfTexasData?.length > 0 && (
        <DynamicWorldOfTexas
          locale={locale}
          data={worldOfTexasData}
          resources={{ worldOfTexas: resources["worldOfTexas"] }}
        />
      )}

      <DynamicAppsSection locale={locale} />
    </div>
  );
}
