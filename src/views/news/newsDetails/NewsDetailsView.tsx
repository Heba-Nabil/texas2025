import PageHeader from "@/components/global/PageHeader";
import NewsDetailsSlider from "./NewsDetailsSlider";
// Types
import { NewsDetailsPageResourcesProps } from "@/types/resources";
import { PageSectionContentType, PageSectionMediaType } from "@/types/api";

type NewsDetailsViewProps = {
  locale: string;
  resources: NewsDetailsPageResourcesProps;
  innerNewsContent: PageSectionContentType;
  innerNewsMedia?: PageSectionMediaType[] | null;
};

export default function NewsDetailsView(props: NewsDetailsViewProps) {
  const { locale, innerNewsContent, innerNewsMedia, resources } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={innerNewsContent?.Name}
            backHref="/news"
            backTitle={resources["backToNews"]}
          />

          <div className="my-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {innerNewsMedia && innerNewsMedia?.length > 0 && (
              <div className="order-1 w-full lg:order-2">
                <NewsDetailsSlider locale={locale} Media={innerNewsMedia} />
              </div>
            )}

            {innerNewsContent?.DescriptionLong && (
              <div
                dangerouslySetInnerHTML={{
                  __html: innerNewsContent.DescriptionLong,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
