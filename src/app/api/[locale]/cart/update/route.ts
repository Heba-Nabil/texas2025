import { updateCartController } from "@/server/controllers/cartController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await updateCartController(request, locale);
}
