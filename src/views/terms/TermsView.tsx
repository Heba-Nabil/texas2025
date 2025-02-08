import PageHeader from "@/components/global/PageHeader";
// Types
import { PageSectionResponseType } from "@/types/api";
import { TermsPageResourcesProps } from "@/types/resources";

type TermsViewProps = {
  resources: TermsPageResourcesProps;
  AllTermsSection?: PageSectionResponseType;
  isMobileView: boolean;
};

// Don't remove this
const serverClasses = "rtl:text-2xl";

export default function TermsView(props: TermsViewProps) {
  const { resources, AllTermsSection, isMobileView } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          {!isMobileView && (
            <PageHeader
              title={resources["termsConditions"]}
              backHref="/"
              backTitle={resources["backToHome"]}
            />
          )}

          {AllTermsSection?.DescriptionLong && (
            <div
              dangerouslySetInnerHTML={{
                __html: AllTermsSection.DescriptionLong,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
