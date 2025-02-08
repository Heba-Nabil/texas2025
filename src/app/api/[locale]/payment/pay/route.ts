import { payController } from "@/server/controllers/paymentController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await payController(request, locale);
}
