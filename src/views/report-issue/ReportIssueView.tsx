import PageHeader from "@/components/global/PageHeader";
import ReportIssueForm from "./ReportIssueForm";
// Types
import { ReportIssuePageResourcesProps } from "@/types/resources";

type ReportIssueViewProps = {
  resources: ReportIssuePageResourcesProps;
  locale: string;
};

export default function ReportIssueView(props: ReportIssueViewProps) {
  const { locale, resources } = props;

  return (
    <div className="w-full flex-grow bg-gray-100">
      <div className="container py-10">
        <div className="rounded-lg bg-white p-5">
          <PageHeader
            title={resources["reportIssue"]}
            backTitle={resources["backToHome"]}
            backHref="/"
          />

          <div className="mx-auto my-8 max-w-2xl">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-semibold">
                {resources["facingMenuProblem"]}
              </h2>

              <p>{resources["letUsKnow"]}</p>
            </div>

            <ReportIssueForm resources={resources} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
