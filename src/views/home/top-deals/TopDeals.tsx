import { getTopDeals } from "@/server/services/menuService";
import { displayInOrder } from "@/utils";
import SectionHeading from "../SectionHeading";
import TopDealsSlider from "./TopDealsSlider";
// Types
import { HomeTopDealsResourcesProps } from "@/types/resources";

type TopDealsProps = {
  locale: string;
  resources: HomeTopDealsResourcesProps;
};

export default async function TopDeals(props: TopDealsProps) {
  const { locale, resources } = props;

  const topDealsResponse = await getTopDeals(locale),
    topDealsData = topDealsResponse?.data;

  if (!topDealsData || topDealsData?.length === 0) return null;

  const sortedData = displayInOrder(topDealsData);

  return (
    <section className="mb-8 w-full">
      <div className="container">
        <SectionHeading
          title={resources["topDeals"]}
          linkLabel={resources["viewAll"]}
          linkHref="/menu"
        />

        <TopDealsSlider
          locale={locale}
          resources={resources}
          data={sortedData}
        />
      </div>
    </section>
  );
}
