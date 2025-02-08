import { removeDealController } from "@/server/controllers/discountController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await removeDealController(request, locale);
}
