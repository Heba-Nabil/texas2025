import { addLoyaltyDealController } from "@/server/controllers/discountController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await addLoyaltyDealController(request, locale);
}
