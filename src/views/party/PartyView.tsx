import NextImage from "@/components/global/NextImage";
import PageHeader from "@/components/global/PageHeader";
import PartyForm from "./PartyForm";
// Types
import { PageSectionResponseType } from "@/types/api";
import { PartyPageResourcesProps } from "@/types/resources";

type PartyViewProps = {
  locale: string;
  resources: PartyPageResourcesProps;
  inStoreSection: PageSectionResponseType;
};

export default function PartyView(props: PartyViewProps) {
  const { locale, resources, inStoreSection } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["party"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          <div className="mx-auto mt-5 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex-center relative order-1 h-80 overflow-hidden md:order-2 md:h-full">
              {inStoreSection.ImageUrl && (
                <NextImage
                  width={500}
                  height={500}
                  className="relative z-10 h-full w-full rounded-md object-cover"
                  src={inStoreSection?.ImageUrl}
                  alt={inStoreSection?.Name}
                />
              )}
            </div>

            {inStoreSection?.DescriptionLong?.trim() && (
              <div className="order-2 md:order-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html: inStoreSection?.DescriptionLong,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-5"></div>

        <div className="rounded-lg bg-white p-5">
          <div id="ApplyForm">
            <h2 className="mt-4 text-2xl font-semibold capitalize">
              {resources["forYourSpecialOccasion"]}
            </h2>

            <h3 className="mb-10 text-lg font-semibold capitalize text-accent">
              {resources["forYourSpecialOccasion"]}
            </h3>

            <PartyForm locale={locale} resources={resources} />
          </div>
        </div>
      </div>
    </div>
  );
}
