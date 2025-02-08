import PageHeader from "@/components/global/PageHeader";
import BlogItem from "./BlogItem";
// Types
import { PageSectionContentType, PageSectionResponseType } from "@/types/api";
import { BlogsPageResourcesProps } from "@/types/resources";

type BlogsViewProps = {
  resources: BlogsPageResourcesProps;
  AllBlogsSection: PageSectionResponseType;
  AllBlogsContent?: PageSectionContentType[] | null;
};

export default function BlogsView(props: BlogsViewProps) {
  const { AllBlogsSection, resources, AllBlogsContent } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["ourBlogs"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          <div className="my-10 max-w-2xl">
            {AllBlogsSection.DescriptionLong && (
              <div
                dangerouslySetInnerHTML={{
                  __html: AllBlogsSection.DescriptionLong,
                }}
              />
            )}
          </div>

          {AllBlogsContent && AllBlogsContent?.length > 0 && (
            <section>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {AllBlogsContent.map((item, index) => (
                  <BlogItem key={index} data={item} resources={resources} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
