import dynamic from "next/dynamic";
import { getAllPageSection } from "@/server/services/globalService";
import { sortByOrder } from "@/utils";
import NextImage from "@/components/global/NextImage";
import QRPlaceholder from "./QRPlaceholder";
// Types
import { HomePageResources } from "@/types/resources";

const DynamicQR = dynamic(() => import("./QR"), {
  ssr: false,
  loading: () => <QRPlaceholder />,
});

type AppsSectionProps = {
  locale: string;
};

const serverClasses =
  "text-main mb-1 block uppercase text-7xl font-bold capitalize text-white";

export default async function AppsSection({ locale }: AppsSectionProps) {
  const homepageResponse = await getAllPageSection(locale, "homepage"),
    homepageData = homepageResponse?.data;

  const mobileSection = homepageData?.find(
    (item) => item.PageTitle?.trim()?.toLowerCase() === "mobileapps",
  );

  if (!mobileSection) return null;

  const mobileAppsResponse = await getAllPageSection(locale, "mobileApps");

  if (!mobileAppsResponse?.data) return null;

  const mobileAppsData = mobileAppsResponse?.data,
    sortedMobileApps = sortByOrder(mobileAppsData);

  const enImage = mobileSection?.ImageUrl?.trim() || "";
  const arImage = mobileSection?.MediumImage?.trim() || enImage;

  return (
    <section className="bg-alt">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {enImage && (
            <div className="order-1 hidden lg:block rtl:order-2">
              <NextImage
                src={locale === "ar" ? arImage : enImage}
                alt={mobileSection?.Name?.trim() || "Mobile"}
                width={454}
                height={400}
                className="h-full w-auto object-contain"
              />
            </div>
          )}

          <div className="flex-center relative z-10 order-2 flex-col gap-3 pt-14 text-center lg:pb-14 rtl:order-1">
            {mobileSection?.DescriptionLong?.trim() && (
              <div
                className="text-5xl font-bold capitalize text-white"
                dangerouslySetInnerHTML={{
                  __html: mobileSection?.DescriptionLong?.trim(),
                }}
              />
            )}

            <div className="mt-3 hidden lg:block">
              <DynamicQR url="/qr-redirect" />
            </div>

            {sortedMobileApps?.length > 0 && (
              <div className="flex-center mt-4 gap-4">
                {sortedMobileApps?.map((item, index) => (
                  <a
                    key={index}
                    href={item.Link1?.trim()}
                    target="_blank"
                    rel="noopener"
                    className="flex"
                    aria-label={item.Name?.trim()}
                  >
                    {item.ImageUrl?.trim() && (
                      <img
                        src={item.ImageUrl?.trim()}
                        alt={item.Name?.trim() || "mobile app"}
                        width={130}
                        height={40}
                        loading="lazy"
                        className="object-contain"
                      />
                    )}
                  </a>
                ))}
              </div>
            )}

            {enImage && (
              <div className="lg:hidden">
                <NextImage
                  src={locale === "ar" ? arImage : enImage}
                  alt={mobileSection?.Name?.trim() || "Mobile"}
                  width={454}
                  height={400}
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
