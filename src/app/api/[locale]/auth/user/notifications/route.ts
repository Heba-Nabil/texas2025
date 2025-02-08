import { getNotificationController } from "@/server/controllers/authController";

export async function GET(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await getNotificationController(request, locale);
}
