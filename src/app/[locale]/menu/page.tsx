import { notFound } from "next/navigation";
import { redirect } from "@/navigation";
// import { getMenuCategories } from "@/server/services/menuService";
import { displayInOrder } from "@/utils";
import { getCountryData } from "@/server/services/globalService";

type MenuPageProps = {
  params: {
    locale: string;
  };
};

export default async function MenuPage(props: MenuPageProps) {
  const {
    params: { locale },
  } = props;

  const countryRes = await getCountryData(locale);

  const countryData = countryRes?.data;

  const categories = countryData?.Categories;

  if (!categories) return notFound();

  const categoriesInOrder = categories ? displayInOrder(categories) : [];

  // const categoriesResponse = await getMenuCategories(locale);

  // if (!categoriesResponse?.data) return notFound();

  // const sortedCategories = displayInOrder(categoriesResponse?.data);

  if (categoriesInOrder?.length > 0) {
    return redirect(`/menu/${categoriesInOrder[0]?.NameUnique}`);
  } else {
    return notFound();
  }
}
