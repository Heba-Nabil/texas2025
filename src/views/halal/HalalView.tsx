import cn from "@/utils/cn";
import PageHeader from "@/components/global/PageHeader";
import NextImage from "@/components/global/NextImage";
import { Button } from "@/components/ui/button";
// Types
import { HalalPageResourcesProps } from "@/types/resources";
import {
  PageSectionResponseType,
  SingleCategoryDocResponseProps,
} from "@/types/api";

const serverClasses = "list-disc";

type HalalViewProps = {
  resources: HalalPageResourcesProps;
  whatIsHalalFoodSection: PageSectionResponseType;
  internalControlsSection: PageSectionResponseType[];
  halalDoc?: SingleCategoryDocResponseProps;
  isMobileView: boolean;
};

export default function HalalView(props: HalalViewProps) {
  const {
    resources,
    whatIsHalalFoodSection,
    internalControlsSection,
    halalDoc,
    isMobileView,
  } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          {!isMobileView && <PageHeader title={resources["halal"]} />}

          <div className="my-8">
            <h2 className="mb-2 text-2xl font-semibold">
              {whatIsHalalFoodSection.Name}
            </h2>
            {whatIsHalalFoodSection.DescriptionLong && (
              <div
                dangerouslySetInnerHTML={{
                  __html: whatIsHalalFoodSection.DescriptionLong,
                }}
              />
            )}
          </div>
        </div>

        <div className="mb-5"></div>

        <div className="space-y-5">
          {internalControlsSection?.map((item, index) => (
            <div key={index} className="rounded-lg bg-white p-5">
              <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-10">
                {item.ImageUrl && (
                  <div
                    className={cn(
                      "flex-center relative order-1 h-[300px] w-full overflow-hidden lg:h-full",
                      (index + 1) % 2 > 0 ? "lg:order-2" : "lg:order-1",
                    )}
                  >
                    <NextImage
                      width={500}
                      height={500}
                      className="relative z-10 h-full w-full rounded-md object-cover"
                      src={item.ImageUrl}
                      alt={item.Name}
                    />
                  </div>
                )}

                {item.DescriptionLong && (
                  <div
                    className={cn(
                      "order-2 w-full",
                      (index + 1) % 2 > 0 ? "lg:order-1" : "lg:order-2",
                    )}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.DescriptionLong,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5"></div>

        {!isMobileView && halalDoc && (
          <div className="rounded-lg bg-white p-5">
            <div className="flex-center my-4 flex-col text-center">
              <h2 className="mb-4 text-3xl font-semibold">
                {resources["seeOurHalal"]}
              </h2>

              {halalDoc.URL && (
                <Button asChild>
                  <a
                    href={halalDoc.URL}
                    target="_blank"
                    download
                    aria-label="halal"
                  >
                    {resources["downloadPdf"]}
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
