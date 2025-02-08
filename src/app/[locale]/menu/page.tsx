import { notFound } from "next/navigation";
import { redirect } from "@/navigation";
import { getMenuCategories } from "@/server/services/menuService";
import { displayInOrder } from "@/utils";

type MenuPageProps = {
  params: {
    locale: string;
  };
};

export default async function MenuPage(props: MenuPageProps) {
  const {
    params: { locale },
  } = props;

  const categoriesResponse = await getMenuCategories(locale);

  if (!categoriesResponse?.data) return notFound();

  const sortedCategories = displayInOrder(categoriesResponse?.data);

  if (sortedCategories?.length > 0) {
    return redirect(`/menu/${sortedCategories[0]?.NameUnique}`);
  } else {
    return notFound();
  }
}
