import PageHeader from "@/components/global/PageHeader";
import FaqItemsWrapper from "./FaqItemsWrapper";
// Types
import { FaqItemType } from "@/types/api";
import { FaqPageResourcesProps } from "@/types/resources";

type FAQViewProps = {
  resources: FaqPageResourcesProps;
  faqData: FaqItemType[];
  isMobileView: boolean;
};

export default function FAQView(props: FAQViewProps) {
  const { resources, faqData, isMobileView } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          {!isMobileView && (
            <PageHeader
              title={resources["faqs"]}
              backHref="/"
              backTitle={resources["backToHome"]}
            />
          )}

          <section className="mt-8">
            <FaqItemsWrapper faqData={faqData} />
          </section>
        </div>
      </div>
    </div>
  );
}
