import PageHeader from "@/components/global/PageHeader";
import NewsItem from "./NewsItem";
// Types
import { NewsPageResourcesProps } from "@/types/resources";
import { PageSectionContentType, PageSectionResponseType } from "@/types/api";

type NewsViewProps = {
  resources: NewsPageResourcesProps;
  AllNewsSection: PageSectionResponseType;
  AllNewsContent: PageSectionContentType[];
};

export default function NewsView(props: NewsViewProps) {
  const { resources, AllNewsContent, AllNewsSection } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["ourNews"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          {AllNewsSection && (
            <section className="my-8 max-w-2xl">
              {AllNewsSection.DescriptionLong && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: AllNewsSection.DescriptionLong,
                  }}
                />
              )}
            </section>
          )}

          <section className="mb-5">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {AllNewsContent.map((item, index) => (
                <NewsItem key={index} data={item} resources={resources} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
