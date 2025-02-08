import { XMarkIcon } from "@heroicons/react/24/solid";
import PageModal from "@/components/global/PageModal";
import ForgetPasswordForm from "./ForgetPasswordForm";
// Types
import { ForgetPasswordPageResourcesProps } from "@/types/resources";

type ForgetPasswordViewProps = {
  locale: string;
  resources: ForgetPasswordPageResourcesProps;
};

export default function ForgetPasswordView(props: ForgetPasswordViewProps) {
  const { locale, resources } = props;

  return (
    <PageModal
      modalTitle={resources["forgetPass"]}
      closeIcon={<XMarkIcon className="size-4 shrink-0" />}
      wrapperClasses="bg-white z-0"
    >
      <div className="px-4 py-6">
        <ForgetPasswordForm locale={locale} resources={resources} />
      </div>
    </PageModal>
  );
}
