import { partyRequestController } from "@/server/controllers/informativeFormsController";

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } },
) {
  return await partyRequestController(request, locale);
}
