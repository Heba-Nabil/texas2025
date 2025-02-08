import { getAllPageSection } from "@/server/services/globalService";
import { sortByOrder } from "@/utils";

type AppsSectionProps = {
  locale: string;
};

export default async function AppsSection({ locale }: AppsSectionProps) {
  const mobileAppsResponse = await getAllPageSection(locale, "mobileApps");

  if (!mobileAppsResponse?.data) return null;

  const mobileAppsData = mobileAppsResponse?.data,
    sortedMobileApps = sortByOrder(mobileAppsData);

  return (
    <div className="flex-center my-6 gap-2">
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
              width={150}
              height={44}
              loading="lazy"
              className="max-w-full object-contain"
            />
          )}
        </a>
      ))}
    </div>
  );
}
