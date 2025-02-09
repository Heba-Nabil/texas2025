import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { RESOURCES_CACHE } from "@/utils/constants";
import { getCountryData } from "@/server/services/globalService";
import { defaultLanguage } from "@/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const countryResponse = await getCountryData(defaultLanguage);

  const languages = countryResponse?.data?.Languages?.map((item) => item.Code);

  revalidateTag(RESOURCES_CACHE);

  if (languages && languages?.length > 0) {
    languages?.forEach((item) => {
      revalidateTag(`${item}_country_data`);
    });
  }

  redirect("/");
}
