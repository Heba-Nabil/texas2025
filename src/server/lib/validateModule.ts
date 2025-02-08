import { notFound } from "next/navigation";
import { getCountryData } from "@/server/services/globalService";
import { defaultLanguage } from "@/config";

export default async function validateModule(moduleName: string) {
  const countryResponse = await getCountryData(
    defaultLanguage,
    "Validate Module",
  );

  const countryModules = countryResponse?.data?.Module;

  const isModuleOn = countryModules?.find(
    (item) => item.Name?.toLowerCase() === moduleName?.toLowerCase(),
  )?.Status;

  if (!isModuleOn) return notFound();
}
