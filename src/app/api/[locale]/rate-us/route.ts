import { rateusController } from "@/server/controllers/rateUsController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await rateusController(request, locale);
}
