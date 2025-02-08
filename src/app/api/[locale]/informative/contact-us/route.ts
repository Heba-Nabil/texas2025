import { contactUsController } from "@/server/controllers/informativeFormsController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await contactUsController(request, locale);
}
