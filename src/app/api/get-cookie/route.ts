import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { cookieName } = await request.json();

  return Response.json({ value: cookies().get(cookieName)?.value });
}
