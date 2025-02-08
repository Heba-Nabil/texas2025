import PageHeader from "@/components/global/PageHeader";
// Types
import { PageSectionResponseType } from "@/types/api";
import { PrivacyPageResourcesProps } from "@/types/resources";

type PrivacyViewProps = {
  resources: PrivacyPageResourcesProps;
  AllPrivacySection: PageSectionResponseType;
  isMobileView: boolean;
};

// Don't remove this
const serverClasses = "rtl:text-2xl";

export default function PrivacyView(props: PrivacyViewProps) {
  const { resources, AllPrivacySection, isMobileView } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          {!isMobileView && (
            <PageHeader
              title={resources["privacyPolicy"]}
              backHref="/"
              backTitle={resources["backToHome"]}
            />
          )}

          {AllPrivacySection.DescriptionLong && (
            <div
              dangerouslySetInnerHTML={{
                __html: AllPrivacySection.DescriptionLong,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
