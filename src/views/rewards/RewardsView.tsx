import { Suspense } from "react";
import cn from "@/utils/cn";
import NextImage from "@/components/global/NextImage";
import NextLink from "@/components/global/NextLink";
import SpendPoints from "./SpendPoints";
import { Button } from "@/components/ui/button";
// Types
import { RewardsPageResourcesProps } from "@/types/resources";
import { PageSectionContentType, PageSectionResponseType } from "@/types/api";
import { getSession } from "@/server/lib/auth";
import AppsSection from "./AppsSection";

type RewardsViewProps = {
  locale: string;
  resources: RewardsPageResourcesProps;
  rewardBanner?: PageSectionResponseType;
  moreRewardingSection?: PageSectionResponseType;
  moreRewardingContent?: PageSectionContentType[];
  introducingSection?: PageSectionResponseType;
  moreAppsclusiveSection?: PageSectionResponseType;
};

export default async function RewardsView(props: RewardsViewProps) {
  const {
    locale,
    resources,
    rewardBanner,
    moreRewardingSection,
    moreRewardingContent,
    introducingSection,
    moreAppsclusiveSection,
  } = props;

  const { userId } = await getSession();

  return (
    <div className="w-full flex-grow">
      {/* Banner */}
      {rewardBanner?.BannerImageUrl && (
        <div className="mb-4 w-full bg-dark">
          <NextImage
            src={rewardBanner.BannerImageUrl}
            width="2000"
            height="1000"
            className="w-full object-contain md:h-[500px]"
            alt={rewardBanner?.Name || "banner"}
          />
        </div>
      )}

      {/* Steps */}
      {moreRewardingSection && (
        <div className="container">
          <div className="relative p-3">
            {moreRewardingSection?.Name?.trim() && (
              <h2 className="mb-1 text-center text-3xl font-bold capitalize text-alt md:text-5xl">
                {moreRewardingSection?.Name?.trim()}
              </h2>
            )}

            {moreRewardingSection.DescriptionShort && (
              <p className="mx-auto text-center text-xl uppercase">
                {moreRewardingSection.DescriptionShort}
              </p>
            )}
            <div className="mt-5 flex w-full justify-center gap-3">
              {userId ? (
                <Button asChild>
                  <NextLink href="/dashboard/rewards">
                    {resources["viewPoints"]}
                  </NextLink>
                </Button>
              ) : (
                <>
                  <Button asChild variant="secondary">
                    <NextLink
                      href="/signup"
                      className="hover:bg-main hover:text-main-foreground"
                    >
                      {resources["signUp"]}
                    </NextLink>
                  </Button>
                  <Button asChild>
                    <NextLink href="/login">{resources["signIn"]}</NextLink>
                  </Button>
                </>
              )}
            </div>
          </div>

          {moreRewardingContent && (
            <div className="relative py-5">
              {moreRewardingContent?.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "mx-auto mb-4 flex w-full flex-col items-center justify-center border p-3 max-md:text-center md:gap-5 lg:w-3/4",
                    { "md:flex-row-reverse": index % 2 !== 0 },
                    { "md:flex-row": index % 2 === 0 },
                  )}
                >
                  <div className="relative my-5 flex items-center justify-center md:w-1/2">
                    {item?.ImageUrl && (
                      <div className="after:right-0-[5%] relative after:absolute after:left-0 after:top-[5%] after:-z-10 after:h-full after:w-full after:rounded-full after:bg-[#f2f2f2] md:after:left-[5%]">
                        <NextImage
                          className="aspect-square w-[200px] object-contain md:w-[350px]"
                          src={item?.ImageUrl}
                          width={350}
                          height={350}
                          alt="texas rewards logo"
                        />
                      </div>
                    )}
                  </div>

                  <div className="md:w-1/2 md:pl-16">
                    {item?.Name?.trim() && (
                      <h2 className="mb-1 font-texas text-4xl font-bold uppercase text-alt">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.Name?.trim(),
                          }}
                        />
                      </h2>
                    )}
                    {item.DescriptionLong?.trim() && (
                      <div
                        className="text-xl md:pr-10"
                        dangerouslySetInnerHTML={{
                          __html: item?.DescriptionLong?.trim(),
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Intro */}
      {introducingSection && (
        <div className="flex min-h-[55vh] items-center justify-center bg-dark py-16 md:bg-[url(/images/rewards/chicken.svg)] md:bg-[length:30%] md:bg-right-top md:bg-no-repeat">
          <div className="position-relative z-index-2 container">
            <div className="flex items-center justify-end">
              <div className="w-full text-center">
                <h2 className="mb-0 text-6xl font-bold uppercase text-main">
                  {introducingSection.Name}
                </h2>
                <h2 className="mb-4 text-center font-biker text-3xl text-white">
                  {introducingSection.DescriptionShort}
                </h2>
                {introducingSection.ImageUrl && (
                  <NextImage
                    src={introducingSection.ImageUrl}
                    width="400"
                    height="135"
                    alt={introducingSection.Name}
                    className="inline-block"
                  />
                )}

                {introducingSection.DescriptionLong && (
                  <div
                    className="mt-2"
                    dangerouslySetInnerHTML={{
                      __html: introducingSection.DescriptionLong,
                    }}
                  />
                )}

                <Button asChild>
                  <NextLink
                    href={introducingSection.Link1 || "/rewards-details"}
                  >
                    {resources["learnMore"]}
                  </NextLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deals */}
      <Suspense fallback={<p>Loading...</p>}>
        <SpendPoints
          locale={locale}
          resources={{
            readyToSpend: resources["readyToSpend"],
            youHaveEarned: resources["youHaveEarned"],
            points: resources["points"],
          }}
        />
      </Suspense>

      {/* Download */}
      {moreAppsclusiveSection && (
        <div className="py-10">
          <div className="flex h-full flex-col justify-center text-center">
            <div className="w-full">
              <div className="flex flex-col items-center justify-center">
                {moreAppsclusiveSection.Name?.trim() && (
                  <h2 className="mb-0 text-3xl font-bold uppercase text-alt md:text-6xl">
                    {moreAppsclusiveSection.Name?.trim()}
                  </h2>
                )}

                <div className="progress relative flex h-[120px] w-[120px] items-center justify-center rounded-full text-center">
                  <span
                    className="title timer"
                    data-from="0"
                    data-to="60"
                    data-speed="1500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      x="0"
                      y="0"
                      viewBox="0 0 464 464"
                    >
                      <g>
                        <path
                          d="M416.483 265.441a14.29 14.29 0 0 0-10.295-4.321h-75.52c-5.891 0-10.667-4.776-10.667-10.667V14.293C320.001 6.399 313.602 0 305.708 0H158.721c-7.894 0-14.293 6.399-14.293 14.293v236.16c0 5.891-4.776 10.667-10.667 10.667H58.028c-7.893-.149-14.412 6.128-14.561 14.02a14.295 14.295 0 0 0 4.321 10.513l174.08 174.08A14.298 14.298 0 0 0 231.895 464a14.294 14.294 0 0 0 10.24-4.267l174.08-174.08c5.655-5.507 5.775-14.556.268-20.212z"
                          fill="#F6B318"
                          opacity="1"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  <div className="overlay"></div>
                  <div className="left"></div>
                  <div className="right"></div>
                </div>

                {moreAppsclusiveSection.ImageUrl && (
                  <img
                    src={moreAppsclusiveSection.ImageUrl}
                    width="300"
                    height="100"
                    alt="texas rewards logo"
                    className="inline-block"
                  />
                )}
                <div className="mx-auto mt-4 w-1/2 uppercase">
                  {moreAppsclusiveSection.DescriptionLong && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: moreAppsclusiveSection.DescriptionLong,
                      }}
                    />
                  )}
                </div>

                <Suspense fallback={<p>Loading...</p>}>
                  <AppsSection locale={locale} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
