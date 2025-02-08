import { ordersController } from "@/server/controllers/ordersController";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await ordersController(request, locale);
}
