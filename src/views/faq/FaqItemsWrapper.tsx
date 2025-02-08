import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Types
import { FaqItemType } from "@/types/api";

type FaqItemsWrapperProps = {
  faqData: FaqItemType[];
};

export default function FaqItemsWrapper({ faqData }: FaqItemsWrapperProps) {
  return (
    <Accordion type="multiple" defaultValue={[faqData[0].Question]}>
      {faqData?.map((item, i) => (
        <AccordionItem
          key={i}
          value={item.Question?.trim()}
          className="mb-4 rounded-lg border-0 bg-gray-100"
        >
          <AccordionTrigger className="rounded-lg bg-gray-100 px-4 py-2 text-start text-xl font-medium capitalize hover:bg-gray-200 [&[data-state=open]]:bg-gray-200">
            <div dangerouslySetInnerHTML={{ __html: item.Question?.trim() }} />
          </AccordionTrigger>

          <AccordionContent className="p-4 text-base">
            <div dangerouslySetInnerHTML={{ __html: item.Answer?.trim() }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
