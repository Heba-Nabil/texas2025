import { getUserAddressesController } from "@/server/controllers/authController";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await getUserAddressesController(locale);
}
