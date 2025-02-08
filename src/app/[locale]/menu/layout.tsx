import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { getUserDeals } from "@/server/services/dealsService";
import { getSession } from "@/server/lib/auth";
// Types
import { MenuLayoutResourcesProps } from "@/types/resources";

const DynamicMenuCategoriesNav = dynamic(
  () => import("@/views/menu/MenuCategoriesNav"),
);

const DynamicMenuCartSummary = dynamic(
  () => import("@/views/menu/MenuCartSummary"),
);

type MenuLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function MenuLayout(props: MenuLayoutProps) {
  const {
    children,
    params: { locale },
  } = props;

  const [t, session] = await Promise.all([getTranslations(), getSession()]);

  const resources: MenuLayoutResourcesProps = {
    myCart: t("myCart"),
    removeAll: t("removeAll"),
    item: t("item"),
    items: t("items"),
    viewCart: t("viewCart"),
    cartEmpty: t("cartEmpty"),
    cartEmptyDesc: t("cartEmptyDesc"),
    edit: t("edit"),
    favourites: t("favourites"),
    customized: t("customized"),
    editDeal: t("editDeal"),
    removeDeal: t("removeDeal"),
    whatYouNeedToCustomize: t("whatYouNeedToCustomize"),
    free: t("free"),
    dealRemoveSuccess: t("dealRemoveSuccess"),
  };

  const userId = session?.userId;

  let dealsResponse;

  if (userId) {
    dealsResponse = await getUserDeals(locale);
  }

  return (
    <div className="flex w-full flex-col bg-gray-100 max-lg:pb-16">
      <DynamicMenuCategoriesNav locale={locale} />

      <div className="container flex-grow pb-10 pt-6">
        <div className="h-full lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-8">{children}</div>

          <div className="lg:col-span-4">
            <DynamicMenuCartSummary
              resources={resources}
              locale={locale}
              userDeals={dealsResponse?.data}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
