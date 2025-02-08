import { thirdPartyController } from "@/server/controllers/authController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await thirdPartyController(request, locale);
}
