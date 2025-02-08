import NextImage from "@/components/global/NextImage";
import { getSingleSectionSingleContentMedia } from "@/server/services/globalService";
// Types
import { PageSectionContentType } from "@/types/api";

type RewardsCardsProps = {
  pageName: string;
  locale: string;
  data: PageSectionContentType;
};

const classesForAdvancedContent =
  "sr-only ms-1 whitespace-nowrap text-[smaller] text-lg font-bold uppercase italic text-inherit sm:text-3xl font-normal not-italic";

export default async function RewardsCards(props: RewardsCardsProps) {
  const { data, locale, pageName } = props;

  const media = await getSingleSectionSingleContentMedia(
    locale,
    pageName,
    data.UniqueName,
  );

  if (!media?.data) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      {media?.data?.map((card, i) => (
        <div key={i} className="flex w-full flex-col items-center text-center">
          <div className="mb-3 h-[400px]">
            {card.ImageUrl && (
              <NextImage
                width="340"
                height="433"
                src={card.ImageUrl}
                className="h-full w-full object-contain"
                alt={card.Alt}
              />
            )}
          </div>

          <div
            className="w-full px-3 font-texas text-2xl font-bold uppercase xl:text-3xl"
            dangerouslySetInnerHTML={{ __html: card.ShortDescription }}
          />
        </div>
      ))}
    </div>
  );
}
