import { checkoutController } from "@/server/controllers/checkoutController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await checkoutController(request, locale);
}
