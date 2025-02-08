import { getSingleSectionContent } from "@/server/services/globalService";
import NextImage from "@/components/global/NextImage";

type ConvenienceContentProps = {
  locale: string;
  pageName: string;
  UniqueName: string;
};

export default async function ConvenienceContent(
  props: ConvenienceContentProps,
) {
  const { UniqueName, locale, pageName } = props;

  const convenienceContentResponse = await getSingleSectionContent(
    locale,
    pageName,
    UniqueName,
  );

  if (!convenienceContentResponse?.data) return null;

  const convenienceContent = convenienceContentResponse?.data;

  return (
    <div className="flex flex-wrap items-start justify-center text-center">
      {convenienceContent.map((item, i) => (
        <div key={i} className="mb-6 w-1/2 md:w-1/3">
          <div
            style={{ order: item.Order }}
            className="flex flex-col items-center justify-start gap-4"
          >
            {item.ImageUrl && (
              <NextImage
                src={item.ImageUrl}
                width={221}
                height={221}
                alt={item.Name}
                className="px-2"
              />
            )}

            <h6 className="text-2xl font-bold uppercase text-white">
              {item.Name}
            </h6>
          </div>
        </div>
      ))}
    </div>
  );
}
