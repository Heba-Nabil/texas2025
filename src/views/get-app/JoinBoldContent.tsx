import { getSingleSectionContent } from "@/server/services/globalService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsCards from "./RewardsCards";

type JoinBoldContentProps = {
  locale: string;
  pageName: string;
  UniqueName: string;
};

export default async function JoinBoldContent(props: JoinBoldContentProps) {
  const { UniqueName, locale, pageName } = props;

  const joinBoldnessContentResponse = await getSingleSectionContent(
    locale,
    pageName,
    UniqueName,
  );

  if (!joinBoldnessContentResponse?.data) return null;

  const joinBoldnessContent = joinBoldnessContentResponse?.data;

  return (
    <div className="w-full">
      <div className="cls-1 sr-only w-fit fill-main group-data-[state=active]:fill-white" />
      <div className="sr-only fill-alt" />

      <Tabs
        defaultValue={joinBoldnessContent[0].UniqueName}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TabsList className="flex-center mb-7 h-auto w-full gap-4 bg-transparent">
          {joinBoldnessContent?.map((item, i) => (
            <TabsTrigger
              key={i}
              className="flex-center group h-16 max-w-xs flex-1 cursor-pointer rounded-lg bg-white px-2 py-1 shadow-md data-[state=active]:bg-alt"
              // className="group flex h-16 w-44 cursor-pointer items-center justify-center rounded-lg bg-white p-5 shadow-md data-[state=active]:bg-alt"
              value={item.UniqueName}
            >
              {item.DescriptionLong && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.DescriptionLong,
                  }}
                  className="[&>*]:w-full"
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {joinBoldnessContent.map((item, i) => (
          <TabsContent key={i} value={item.UniqueName}>
            <RewardsCards data={item} pageName={pageName} locale={locale} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
