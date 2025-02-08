import { getStoreGeoFencingController } from "@/server/controllers/storeController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await getStoreGeoFencingController(request, locale);
}
