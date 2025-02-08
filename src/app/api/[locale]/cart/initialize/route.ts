import { initializeCartController } from "@/server/controllers/cartController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await initializeCartController(request, locale);
}
