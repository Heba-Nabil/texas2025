import PageHeader from "@/components/global/PageHeader";
import NextImage from "@/components/global/NextImage";
import { Button } from "@/components/ui/button";
import BirthdayForm from "./BirthdayForm";
// Types
import { PageSectionResponseType } from "@/types/api";
import { BirthdayPageResourcesProps } from "@/types/resources";

type BirthdayViewProps = {
  locale: string;
  resources: BirthdayPageResourcesProps;
  inStoreSection?: PageSectionResponseType;
  cateringSection?: PageSectionResponseType;
};

export default function BirthdayView(props: BirthdayViewProps) {
  const { locale, resources, inStoreSection, cateringSection } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["birthday"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          {inStoreSection && (
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div className="flex-center relative order-2 mt-8 h-[300px] overflow-hidden lg:h-full">
                {inStoreSection.ImageUrl && (
                  <NextImage
                    width={500}
                    height={500}
                    className="relative z-10 h-full w-full rounded-md object-cover"
                    src={inStoreSection.ImageUrl}
                    alt={inStoreSection.Name}
                  />
                )}
              </div>

              <div className="order-1 max-lg:mt-4">
                {inStoreSection.DescriptionLong && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: inStoreSection.DescriptionLong,
                    }}
                  />
                )}

                <Button asChild variant="dark">
                  <a href="#ApplyForm" className="mt-4 px-6">
                    {resources["applyNowonly"]}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-10" />

        {cateringSection && (
          <div className="rounded-lg bg-white px-5 pt-5">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div className="flex-center relative order-2 h-[300px] overflow-hidden lg:order-1 lg:h-full">
                {cateringSection?.ImageUrl && (
                  <NextImage
                    width={500}
                    height={500}
                    className="relative z-10 h-full w-full rounded-md object-cover"
                    src={cateringSection?.ImageUrl}
                    alt={cateringSection?.Name}
                  />
                )}
              </div>

              <div className="order-1 lg:order-2">
                {cateringSection?.DescriptionLong && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: cateringSection?.DescriptionLong,
                    }}
                  />
                )}

                <Button asChild variant="dark">
                  <a href="#ApplyForm" className="px-6">
                    {resources["applyNowonly"]}
                  </a>
                </Button>
              </div>
            </div>

            <div className="pb-5" id="ApplyForm" />
          </div>
        )}

        <div className="mb-10" />

        <div className="rounded-lg bg-white px-5 py-12">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold capitalize">
              {resources["forYourSpecialOccasion"]}
            </h2>
            <h3 className="text-lg font-semibold capitalize text-accent">
              {resources["thankYouForConsidering"]}
            </h3>
          </div>

          <div className="md:col-span-6 md:col-start-2">
            <BirthdayForm locale={locale} resources={resources} />
          </div>
        </div>
      </div>
    </div>
  );
}
