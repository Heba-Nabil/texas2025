import { ordersRollBackController } from "@/server/controllers/ordersController";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await ordersRollBackController(request, locale);
}
