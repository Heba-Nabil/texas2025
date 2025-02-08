import { getSingleSectionContent } from "@/server/services/globalService";
import TeirsItem from "./TeirsItem";
// Types
import { PageSectionResponseType } from "@/types/api";

type TiersSectionProps = {
  locale: string;
  pageName: string;
  sectionData: PageSectionResponseType;
};

export default async function TiersSection(props: TiersSectionProps) {
  const { locale, pageName, sectionData } = props;

  const tiersListResponse = sectionData.UniqueName
    ? await getSingleSectionContent(locale, pageName, sectionData.UniqueName)
    : undefined;

  const tierListContent = tiersListResponse?.data;

  return (
    <div className="p-8 py-12">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold uppercase text-alt md:text-5xl">
          {sectionData.Name}
        </h2>

        {sectionData.DescriptionShort && (
          <p className="mb-0 text-lg uppercase">
            {sectionData.DescriptionShort}
          </p>
        )}
      </div>

      {tierListContent && (
        <div className="flex-center flex-col gap-10 md:flex-row">
          {tierListContent?.map((item, index) => (
            <div className="basis-1/3" key={index}>
              <TeirsItem data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
