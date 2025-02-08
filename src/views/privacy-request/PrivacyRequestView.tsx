import PageHeader from "@/components/global/PageHeader";
import PrivacyRequestForm from "./PrivacyRequestForm";
// Types
import { PageSectionResponseType } from "@/types/api";
import { PrivacyRequestPageeResourcesProps } from "@/types/resources";

type PrivacyRequestViewProps = {
  resources: PrivacyRequestPageeResourcesProps;
  locale: string;
  fillTheFormSection: PageSectionResponseType;
};

export default function PrivacyRequestView(props: PrivacyRequestViewProps) {
  const { locale, resources, fillTheFormSection } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["privacyRequest"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          <div className="mx-auto my-8 max-w-2xl">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-semibold">
                {fillTheFormSection.Name}
              </h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: fillTheFormSection.DescriptionLong,
                }}
              />
            </div>

            <PrivacyRequestForm resources={resources} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
