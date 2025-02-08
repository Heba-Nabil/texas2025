import { preCheckoutController } from "@/server/controllers/ordersController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await preCheckoutController(request, locale);
}
