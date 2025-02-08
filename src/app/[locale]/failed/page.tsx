import { getTranslations } from "next-intl/server";
import FailedView from "@/views/failed/FailedView";
// Types
import { OrderFailedPageResourcesProps } from "@/types/resources";

export default async function FailedPaymentPage() {
  const t = await getTranslations();

  const resources: OrderFailedPageResourcesProps = {
    orderFailed: t("orderFailed"),
    orderFailedDesc: t("orderFailedDesc"),
    viewMenu: t("viewMenu"),
  };

  return <FailedView resources={resources} />;
}
