import PageHeader from "@/components/global/PageHeader";
import NextImage from "@/components/global/NextImage";
// Types
import { AboutPageResourcesProps } from "@/types/resources";
import {
  PageSectionContentType,
  PageSectionResponseType,
  SingleCategoryMediaProps,
} from "@/types/api";

type AboutViewProps = {
  resources: AboutPageResourcesProps;
  servingSection: PageSectionResponseType;
  texasHistorySection: PageSectionResponseType;
  texasHistoryVideo: SingleCategoryMediaProps;
  keyBrandsSection: PageSectionResponseType;
  keyBrandsContent?: PageSectionContentType[] | null;
  isMobileView: boolean;
};

export default function AboutView(props: AboutViewProps) {
  const {
    resources,
    servingSection,
    texasHistorySection,
    texasHistoryVideo,
    keyBrandsSection,
    keyBrandsContent,
    isMobileView,
  } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          {!isMobileView && (
            <PageHeader
              title={resources["ourStory"]}
              backHref="/"
              backTitle={resources["backToHome"]}
            />
          )}

          {servingSection && (
            <section className="mt-5">
              {servingSection?.Name && (
                <h2 className="mb-5 max-w-2xl text-xl font-semibold capitalize md:text-2xl">
                  {servingSection?.Name}
                </h2>
              )}
              {servingSection?.DescriptionLong && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: servingSection?.DescriptionLong,
                  }}
                />
              )}
            </section>
          )}
        </div>

        <div className="mb-5"></div>

        <div className="rounded-lg bg-white p-5">
          <section className="w-full overflow-hidden bg-gray-100 px-4 py-10">
            <div className="grid w-full grid-cols-12 md:gap-10">
              <div className="order-2 col-span-full mt-5 md:order-1 md:col-span-6">
                {texasHistorySection?.Name && (
                  <h2 className="mb-5 text-xl font-semibold capitalize md:text-2xl">
                    {texasHistorySection?.Name}
                  </h2>
                )}

                {texasHistorySection?.DescriptionLong && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: texasHistorySection?.DescriptionLong,
                    }}
                  />
                )}
              </div>

              <div className="order-1 col-span-full md:order-2 md:col-span-6">
                {texasHistoryVideo && (
                  <video
                    muted
                    autoPlay
                    playsInline
                    controls
                    poster={
                      texasHistoryVideo?.ThumbnailImage ||
                      "/images/about/videoimg.jpg"
                    }
                    className="h-80 w-full rounded object-cover"
                  >
                    <source src={texasHistoryVideo?.Video} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="mb-5"></div>

        <section className="rounded-lg bg-white p-5">
          {keyBrandsSection?.Name && (
            <h2 className="mb-5 text-xl font-semibold capitalize md:text-2xl">
              {keyBrandsSection?.Name}
            </h2>
          )}

          {keyBrandsSection?.DescriptionLong && (
            <div
              dangerouslySetInnerHTML={{
                __html: keyBrandsSection?.DescriptionLong,
              }}
            />
          )}

          {keyBrandsContent && keyBrandsContent?.length > 0 && (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {keyBrandsContent?.map((item, index) => (
                <div key={index} className="text-center">
                  {item?.ImageUrl && (
                    <div className="relative m-auto mb-5 size-52 overflow-hidden rounded-full">
                      <NextImage
                        src={item?.ImageUrl}
                        alt={item?.Name}
                        width={208}
                        height={208}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                  {item?.Name && (
                    <h3 className="text-xl font-semibold capitalize">
                      {item?.Name}
                    </h3>
                  )}
                  {item?.DescriptionLong && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item?.DescriptionLong,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
