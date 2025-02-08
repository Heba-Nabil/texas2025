import { Suspense } from "react";
import NextImage from "@/components/global/NextImage";
import ConvenienceContent from "./ConvenienceContent";
import JoinBoldContent from "./JoinBoldContent";
import DiscoverDeal from "./DiscoverDeal";
// Types
import { PageSectionResponseType } from "@/types/api";
import { GetAppPageResourcesProps } from "@/types/resources";

type GetTheAppViewProps = {
  locale: string;
  pageName: string;
  resources: GetAppPageResourcesProps;
  orderingEasySection?: PageSectionResponseType;
  mobileAppsData?: PageSectionResponseType[] | null;
  convenienceSection?: PageSectionResponseType;
  joinBoldnessSection?: PageSectionResponseType;
  discoverDealSection?: PageSectionResponseType;
};

export default function GetTheAppView(props: GetTheAppViewProps) {
  const {
    resources,
    locale,
    pageName,
    orderingEasySection,
    mobileAppsData,
    convenienceSection,
    joinBoldnessSection,
    discoverDealSection,
  } = props;

  return (
    <div className="w-full">
      {orderingEasySection && (
        <section
          className="relative flex h-[600px] items-center overflow-hidden bg-white bg-cover py-20"
          style={{
            backgroundImage: orderingEasySection?.BannerImageUrl
              ? `url(${orderingEasySection?.BannerImageUrl})`
              : "none",
          }}
        >
          <div className="mx-auto w-[80%]">
            <div className="relative flex items-center justify-center py-20">
              <div className="w-full max-md:text-center md:w-1/2">
                <div>
                  <h2 className="py-2 text-5xl font-bold text-alt md:py-6 md:text-8xl">
                    {orderingEasySection?.Name}
                  </h2>

                  <p className="text-4xl font-bold text-main md:text-6xl">
                    {orderingEasySection.DescriptionShort}
                  </p>

                  {mobileAppsData && (
                    <div className="flex w-full items-center gap-3 py-6">
                      {mobileAppsData?.map((item, index) => (
                        <a
                          key={index}
                          href={item.Link1?.trim()}
                          target="_blank"
                          rel="noopener"
                          aria-label={item.Name?.trim()}
                          className="google-play w-48"
                        >
                          {item.ImageUrl?.trim() && (
                            <img
                              src={item.ImageUrl?.trim()}
                              alt={item.Name?.trim() || "mobile app"}
                              width={130}
                              height={40}
                              loading="lazy"
                              className="w-full object-contain"
                            />
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full max-md:hidden md:w-1/2">
                {orderingEasySection.ImageUrl && (
                  <div className="absolute -bottom-40 -right-36 top-auto h-[800px] w-[800px]">
                    <NextImage
                      className="h-full w-full object-cover"
                      fill
                      src={orderingEasySection.ImageUrl}
                      alt="banner-background"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* <!-- First App Services --> */}
      {convenienceSection && (
        <section className="relative bg-alt py-20">
          <div className="mx-auto w-[80%] max-md:w-[95%]">
            <div className="mb-8 text-center">
              {convenienceSection?.Name && (
                <h3 className="text-4xl font-bold uppercase text-main md:text-6xl">
                  {convenienceSection?.Name}
                </h3>
              )}
              {convenienceSection.DescriptionShort && (
                <p className="text-2xl font-bold uppercase text-white">
                  {convenienceSection?.DescriptionShort}
                </p>
              )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
              <ConvenienceContent
                locale={locale}
                pageName={pageName}
                UniqueName={convenienceSection?.UniqueName}
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* <!-- New Join Section --> */}
      {joinBoldnessSection && (
        <section className="texas-section app-feature">
          {joinBoldnessSection.ImageUrl && (
            <NextImage
              src={joinBoldnessSection.ImageUrl}
              className="absolute -z-10 h-full w-full object-cover"
              width={1900}
              height={1069}
              alt={joinBoldnessSection.Name}
            />
          )}

          <div className="mx-auto px-3 py-20 sm:w-[80%]">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-4xl font-bold uppercase text-dark md:text-6xl">
                {joinBoldnessSection.Name}
              </h3>
              {joinBoldnessSection.DescriptionShort && (
                <p>{joinBoldnessSection.DescriptionShort}</p>
              )}
            </div>

            <Suspense fallback={<p>Loading...</p>}>
              <JoinBoldContent
                locale={locale}
                pageName={pageName}
                UniqueName={joinBoldnessSection.UniqueName}
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* <!-- Video Section  --> */}
      {discoverDealSection && (
        <section className="bg-main py-20">
          <div className="mx-auto flex w-[80%] flex-col items-center justify-center gap-6 max-md:w-[90%]">
            <h3 className="text-center text-4xl font-bold uppercase text-white md:text-8xl">
              {discoverDealSection.Name} <br />
              {discoverDealSection.DescriptionShort}
            </h3>

            <Suspense fallback={<p>Loading...</p>}>
              <DiscoverDeal
                locale={locale}
                pageName={pageName}
                UniqueName={discoverDealSection.UniqueName}
              />
            </Suspense>
          </div>
        </section>
      )}

      {/* <!-- Get the app  --> */}
      {mobileAppsData && (
        <div className="py-20">
          <div className="mx-auto w-[80%]">
            <h3 className="text-center text-4xl font-bold text-dark md:text-6xl">
              {resources["foodLove"]}
            </h3>
            <p className="text-center text-lg font-bold">
              {resources["donwloadOurApp"]}
            </p>

            <div className="mt-5 flex items-center justify-center gap-4">
              {mobileAppsData?.map((item, index) => (
                <a
                  key={index}
                  href={item.Link1?.trim()}
                  target="_blank"
                  rel="noopener"
                  aria-label={item.Name?.trim()}
                  className="w-56 max-w-full"
                >
                  {item.ImageUrl?.trim() && (
                    <img
                      src={item.ImageUrl?.trim()}
                      alt={item.Name?.trim() || "mobile app"}
                      width={130}
                      height={40}
                      loading="lazy"
                      className="w-full object-contain"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
