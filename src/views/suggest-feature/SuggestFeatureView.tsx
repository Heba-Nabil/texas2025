import PageHeader from "@/components/global/PageHeader";
import SuggestFeatureForm from "./SuggestFeatureForm";
// Types
import { SuggestFeaturePageResourcesProps } from "@/types/resources";

type SuggestFeatureViewProps = {
  resources: SuggestFeaturePageResourcesProps;
  locale: string;
};

export default function SuggestFeatureView(props: SuggestFeatureViewProps) {
  const { locale, resources } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["suggestFeature"]}
            backTitle={resources["backToHome"]}
            backHref="/"
          />

          <div className="mx-auto my-8 max-w-2xl">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-semibold">
                {resources["haveAFeature"]}
              </h2>
              <p>{resources["hearYourSuggestion"]}</p>
            </div>

            <SuggestFeatureForm resources={resources} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
