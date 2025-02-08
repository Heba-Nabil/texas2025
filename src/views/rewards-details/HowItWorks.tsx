import { getSingleSectionContent } from "@/server/services/globalService";
import NextImage from "@/components/global/NextImage";
// Types
import { PageSectionResponseType } from "@/types/api";

type HowItWorksProps = {
  locale: string;
  sectionData: PageSectionResponseType;
  pageName: string;
};

export default async function HowItWorks(props: HowItWorksProps) {
  const { locale, sectionData, pageName } = props;

  const sectionContentResponse = await getSingleSectionContent(
    locale,
    pageName,
    sectionData.UniqueName,
  );

  const howItWorksContent = sectionContentResponse?.data;

  return (
    <div className="text-center">
      <h2 className="font-bold text-alt md:text-6xl">{sectionData.Name}</h2>

      {sectionData.DescriptionShort && (
        <p className="mb-5 mt-2 text-xl">{sectionData.DescriptionShort}</p>
      )}

      {howItWorksContent && (
        <div className="flex flex-wrap justify-center gap-5">
          {howItWorksContent?.map((item, index) => (
            <div
              style={{ order: item.Order }}
              className="w-full px-1 md:w-1/3 md:px-5 lg:w-1/4"
              key={index}
            >
              {item.ImageUrl && (
                <NextImage
                  src={item?.ImageUrl}
                  width="200"
                  height="200"
                  className="m-auto"
                  alt={item.Name}
                />
              )}

              <h2 className="mx-auto mb-0 mt-4 text-lg font-bold uppercase text-dark md:text-3xl">
                {item?.Name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
