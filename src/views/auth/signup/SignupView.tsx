import { XMarkIcon } from "@heroicons/react/24/solid";
import PageModal from "@/components/global/PageModal";
import SignupForm from "./SignupForm";
// Types
import { SignupPageResourcesProps } from "@/types/resources";

type SignupViewProps = {
  resources: SignupPageResourcesProps;
  locale: string;
};

export default function SignupView(props: SignupViewProps) {
  const { resources, locale } = props;

  return (
    <PageModal
      modalTitle={resources["signUp"]}
      closeIcon={<XMarkIcon className="size-4 shrink-0" />}
      wrapperClasses="bg-white"
    >
      <div className="px-4 pb-6 pt-3">
        <SignupForm resources={resources} locale={locale} />
      </div>
    </PageModal>
  );
}
