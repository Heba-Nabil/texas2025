import { getUserLoyaltyDeals } from "@/server/services/loyaltyService";
import { displayInOrder } from "@/utils";
import PointsCarousel from "./PointsCarousel";

type SpendPointsProps = {
  locale: string;
  resources: {
    readyToSpend: string;
    youHaveEarned: string;
    points: string;
  };
};

export default async function SpendPoints(props: SpendPointsProps) {
  const { locale, resources } = props;

  const dealsResponse = await getUserLoyaltyDeals(locale);

  if (!dealsResponse?.data) return null;

  const deals = displayInOrder(dealsResponse?.data);

  return (
    <div className="mb-4 pt-5">
      <div className="container">
        <div className="mb-4 mt-10 flex justify-center">
          <div className="w-full text-center md:w-3/4">
            <h2 className="text-3xl font-bold uppercase text-alt md:text-6xl">
              {resources["readyToSpend"]}
            </h2>
            <p className="mx-auto mt-3 text-lg uppercase md:w-1/2 md:text-xl">
              {resources["youHaveEarned"]}
            </p>
          </div>
        </div>
      </div>

      {deals?.length > 0 && (
        <PointsCarousel
          data={deals}
          locale={locale}
          resources={{ points: resources["points"] }}
        />
      )}
    </div>
  );
}
