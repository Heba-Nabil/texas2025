import { paymentStatusController } from "@/server/controllers/paymentController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await paymentStatusController(request, locale);
}
