import { getSession } from "@/server/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();

  const session = await getSession();

  session.info = body?.email
    ? {
        firstName: body?.firstName,
        lastName: body?.lastName,
        email: body?.email,
        phone: body?.phone,
        note: body?.note,
      }
    : undefined;

  await session.save();

  return Response.json({ data: "Update Success" });
}
