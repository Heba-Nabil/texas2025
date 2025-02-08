import PageHeader from "@/components/global/PageHeader";
import ContactForm from "./ContactForm";
// Types
import { PageSectionResponseType } from "@/types/api";
import { ContactPageResourcesProps } from "@/types/resources";

type ContactViewProps = {
  resources: ContactPageResourcesProps;
  locale: string;
  getInTouchSection: PageSectionResponseType;
};

export default function ContactView(props: ContactViewProps) {
  const { locale, resources, getInTouchSection } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["contactUs"]}
            backHref="/"
            backTitle={resources["backToHome"]}
          />

          <div className="mx-auto my-8 max-w-2xl">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-semibold">
                {getInTouchSection.Name}
              </h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: getInTouchSection.DescriptionLong,
                }}
              />
            </div>

            <ContactForm resources={resources} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
