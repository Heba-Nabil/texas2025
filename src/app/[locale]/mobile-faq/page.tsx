import validateModule from "@/server/lib/validateModule";
import { getAllPageSection } from "@/server/services/globalService";
import { sortByOrder } from "@/utils";
import EmptyData from "@/components/emptyStates/EmptyData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MobileFAQPageProps = {
  params: {
    locale: string;
  };
};

export default async function MobileFAQPage(props: MobileFAQPageProps) {
  const {
    params: { locale },
  } = props;

  await validateModule("FAQ");

  const pageName = "mobileFaq";

  const questions = await getAllPageSection(locale, pageName);

  if (!questions?.data || questions?.data?.length === 0) return <EmptyData />;

  const faqData = sortByOrder(questions?.data);

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <Accordion
            type="multiple"
            defaultValue={[faqData[0].UniqueName?.trim()]}
          >
            {faqData?.map((item, i) => (
              <AccordionItem
                key={i}
                value={item.UniqueName?.trim()}
                className="mb-4 rounded-lg border-0 bg-gray-100"
              >
                {item.Name?.trim() && (
                  <AccordionTrigger className="rounded-lg bg-gray-100 px-4 py-2 text-start text-xl font-medium capitalize hover:bg-gray-200 [&[data-state=open]]:bg-gray-200">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.Name?.trim(),
                      }}
                    />
                  </AccordionTrigger>
                )}

                <AccordionContent className="p-4 text-base">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.DescriptionLong?.trim(),
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
