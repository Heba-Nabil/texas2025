import cn from "@/utils/cn";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import LoyaltyHeader from "../LoyaltyHeader";
import NextLink from "@/components/global/NextLink";
import DealsWithoutLoyalty from "./DealsWithoutLoyalty";
import EmptyDeals from "@/components/emptyStates/EmptyDeals";
// Types
import { DealsPageResourcesProps } from "@/types/resources";
import { UserDealsResponseProps } from "@/types/api";
import NextImage from "@/components/global/NextImage";

type DealsViewProps = {
  locale: string;
  resources: DealsPageResourcesProps;
  data: UserDealsResponseProps[];
  enableLoyalty: boolean;
};

export default function DealsView(props: DealsViewProps) {
  const { locale, resources, data, enableLoyalty } = props;

  return (
    <DashBoardPagesWrapper label={resources["deals"]}>
      <div
        className={cn("flex flex-grow overflow-y-auto px-5 max-lg:mt-6", {
          "flex-col": enableLoyalty,
        })}
      >
        {enableLoyalty && (
          <>
            <LoyaltyHeader />

            <div className="mb-4" />

            <div className="relative z-10 flex min-h-60 w-full flex-col justify-center overflow-hidden rounded-xl bg-alt p-3 text-white sm:p-5">
              <div className="flex-between gap-2 sm:px-3">
                <div className="shrink-0">
                  <NextLink href="/rewards-details">
                    <NextImage
                      src="/images/rewards/deals-img.png"
                      alt="deals-img"
                      width={160}
                      height={132}
                      className="w-40 object-contain sm:w-44"
                    />
                  </NextLink>

                  <NextLink
                    href="/rewards-details"
                    className="ms-2 border-b py-0.5 text-xl md:text-2xl"
                  >
                    {resources["howToEarnPoints"]}
                  </NextLink>
                </div>

                <NextLink href="/rewards-details">
                  <img
                    src="/images/icons/tex-deals.svg"
                    alt="tex deals"
                    width={160}
                    height={144}
                    loading="lazy"
                    className="w-40 object-contain"
                  />
                </NextLink>
              </div>
            </div>

            <div className="mb-6" />
          </>
        )}

        {data?.length > 0 ? (
          <DealsWithoutLoyalty
            locale={locale}
            resources={resources}
            data={data}
          />
        ) : (
          <EmptyDeals
            resources={{
              noDealsYet: resources["noDealsYet"],
              startExploring: resources["startExploring"],
            }}
          />
        )}
      </div>
    </DashBoardPagesWrapper>
  );
}
