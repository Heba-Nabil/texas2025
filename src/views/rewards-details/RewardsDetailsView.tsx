import { Suspense } from "react";
import NextImage from "@/components/global/NextImage";
import HowItWorks from "./HowItWorks";
import DealsSection from "./DealsSection";
import TiersSection from "./TiersSection";
// Types
import { RewardsDetailsPageResourcesProps } from "@/types/resources";
import { PageSectionResponseType, UserDealsResponseProps } from "@/types/api";

type RewardsDetailsViewProps = {
  locale: string;
  resources: RewardsDetailsPageResourcesProps;
  pageName: string;
  rewardsDetailsBanner?: PageSectionResponseType;
  howItWorksSection?: PageSectionResponseType;
  tierListSection?: PageSectionResponseType;
  deals: UserDealsResponseProps[];
};

export default function RewardsDetailsView(props: RewardsDetailsViewProps) {
  const {
    locale,
    resources,
    pageName,
    rewardsDetailsBanner,
    howItWorksSection,
    tierListSection,
    deals,
  } = props;

  return (
    <div className="w-full flex-grow">
      <div className="container pt-4">
        {/* Banner */}
        {rewardsDetailsBanner && (
          <div className="relative mb-4">
            {locale === "en"
              ? rewardsDetailsBanner.ImageUrl && (
                  <NextImage
                    src={rewardsDetailsBanner.ImageUrl}
                    className="w-full object-contain"
                    width={1000}
                    height={500}
                    alt="rewards"
                  />
                )
              : rewardsDetailsBanner.MediumImage && (
                  <NextImage
                    src={rewardsDetailsBanner.MediumImage}
                    className="w-full object-contain"
                    width={1000}
                    height={500}
                    alt="rewards"
                  />
                )}
          </div>
        )}

        {/* How Section */}
        {howItWorksSection && (
          <Suspense fallback={<p>Loading...</p>}>
            <HowItWorks
              locale={locale}
              sectionData={howItWorksSection}
              pageName={pageName}
            />
          </Suspense>
        )}

        {/* Filtration */}
        {deals?.length > 0 && (
          <DealsSection locale={locale} resources={resources} data={deals} />
        )}

        {/* Teirs Secion */}
        {tierListSection && (
          <Suspense fallback={<p>Loading...</p>}>
            <TiersSection
              locale={locale}
              pageName={pageName}
              sectionData={tierListSection}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
