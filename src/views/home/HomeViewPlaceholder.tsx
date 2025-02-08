import HomeBannerPlaceholder from "./banner/HomeBannerPlaceholder";
import BestSellerPlaceholder from "./best-seller/BestSellerPlaceholder";
import ExploreMenuPlaceholder from "./explore-menu/ExploreMenuPlaceholder";
import TopDealsPlaceholder from "./top-deals/TopDealsPlaceholder";
import FeaturedBannerPlaceholder from "./featured-banner/FeaturedBannerPlaceholder";
import OrderAgainPlaceholder from "./order-again/OrderAgainPlaceholder";
import WorldOfTexasPlaceholder from "./world-of-texas/WorldOfTexasPlaceholder";

export default function HomeViewPlaceholder() {
  return (
    <div className="w-full flex-grow">
      <HomeBannerPlaceholder />

      <div className="mb-8" />

      <ExploreMenuPlaceholder />

      <div className="mb-8" />

      <BestSellerPlaceholder />

      <div className="mb-8" />

      <TopDealsPlaceholder />

      <FeaturedBannerPlaceholder />

      <div className="mb-8" />

      <OrderAgainPlaceholder />

      <WorldOfTexasPlaceholder />
    </div>
  );
}
