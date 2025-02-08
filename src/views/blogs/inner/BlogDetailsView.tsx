import PageHeader from "@/components/global/PageHeader";
// Types
import { PageSectionContentType, PageSectionMediaType } from "@/types/api";
import { BlogsDetailsPageResourcesProps } from "@/types/resources";
import BlogInnerSlider from "./BlogInnerSlider";

type BlogsDetailsViewProps = {
  locale: string;
  innerBlogsContent: PageSectionContentType;
  innerBlogsMedia?: PageSectionMediaType[] | null;
  resources: BlogsDetailsPageResourcesProps;
};

export default function BlogDetailsView(props: BlogsDetailsViewProps) {
  const { locale, resources, innerBlogsContent, innerBlogsMedia } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={innerBlogsContent.Name}
            backHref="/blogs"
            backTitle={resources["backToBlogs"]}
          />

          <div className="my-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {innerBlogsMedia && innerBlogsMedia?.length > 0 && (
              <div className="order-1 w-full lg:order-2">
                <BlogInnerSlider locale={locale} media={innerBlogsMedia} />
              </div>
            )}

            {innerBlogsContent.DescriptionLong && (
              <div
                dangerouslySetInnerHTML={{
                  __html: innerBlogsContent.DescriptionLong,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
